using Capicash.API.Data;
using Capicash.API.DTOs;
using Capicash.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Capicash.API.Controllers;

// [ApiController] // TEMPORARY DEBUG: Commented out to debug 400 error AGAIN
[Route("[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    [Authorize] // Criar produto EXIGE login
    public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
    {
        Console.WriteLine(">>> [Create] Iniciando criação de produto...");
        
        if (!ModelState.IsValid)
        {
            Console.WriteLine("❌ [Create] Validation Failed! Errors:");
            foreach (var state in ModelState)
            {
                foreach (var error in state.Value.Errors)
                {
                    Console.WriteLine($"   -> Field: {state.Key} | Error: {error.ErrorMessage} | Exception: {error.Exception?.Message}");
                }
            }
            return BadRequest(ModelState);
        }
        try
        {
            // 1. Pega o ID do usuário logado (Clerk)
            // O ClaimTypes.NameIdentifier deve estar mapeado para o User ID do Clerk
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            
            // Fallback: Se o token do Clerk não tiver o claim padrão, tente achar pelo "sub" ou "id"
            if (string.IsNullOrEmpty(userId))
                userId = User.FindFirst("sub")?.Value;

            Console.WriteLine($">>> [Create] User ID identificado no token: '{userId}'");

            if (string.IsNullOrEmpty(userId))
            {
                Console.WriteLine("❌ [Create] Falha: Usuário não identificado no token (token inválido ou claims vazias).");
                return Unauthorized(new { message = "Usuário não identificado no token." });
            }

            // 2. Garante que o usuário existe no banco local (Sync de segurança)
            // Agora comparamos string com string, sem parse de GUID.
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            
            if (user == null)
            {
                // --- LAZY SYNC (Auto-Correction) ---
                Console.WriteLine($"⚠️ [Create] Usuário '{userId}' não encontrado. Executando Lazy Sync...");
                
                // Tenta extrair dados do token para criar o user 'on the fly'
                var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value 
                            ?? User.FindFirst("email")?.Value 
                            ?? "user@anon.com";
                            
                var name = User.Identity?.Name ?? email.Split('@')[0];

                user = new User 
                {
                   Id = userId,
                   Name = name,
                   Email = email,
                   Document = "00000000000", // Placeholder para permitir criação
                   AsaasWalletId = null // Será criado depois ou em background
                };
                
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                Console.WriteLine("✅ [Create] Lazy Sync realizado com sucesso! Usuário criado.");
            }
            else 
            {
               Console.WriteLine(">>> [Create] Usuário Local encontrado. Prosseguindo.");
            }

            // 3. Gera o Slug (Ex: "meu-ebook" -> "meu-ebook-a1b2")
            // Adicionamos um sufixo curto para garantir unicidade sem consultar o banco toda hora
            var slugBase = dto.Title.ToLower()
                .Replace(" ", "-")
                .Replace("ã", "a").Replace("õ", "o") // Tratamento básico
                .Replace("ç", "c");
                
            // Gera sufixo seguro (nunca nulo)
            var uniqueSuffix = Guid.NewGuid().ToString("N").Substring(0, 6);
            var finalSlug = $"{slugBase}-{uniqueSuffix}";
            
            Console.WriteLine($">>> [Create] Slug gerado: {finalSlug}");

            // 4. Cria o objeto
            var product = new Product
            {
                Id = Guid.NewGuid(),
                UserId = userId, // String direta
                Title = dto.Title,
                Description = dto.Description,
                PriceInCents = dto.PriceInCents,
                ImageUrl = dto.ImageUrl,
                Active = true,
                Slug = finalSlug,
                RedirectUrl = dto.RedirectUrl,
                ContentUrl = dto.ContentUrl
            };

            Console.WriteLine(">>> [Create] Salvando no banco de dados...");
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            Console.WriteLine("✅ [Create] Produto salvo com sucesso!");

            return CreatedAtAction(nameof(GetBySlug), new { slug = finalSlug }, product);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"🔥 [CRITICAL ERROR] Erro ao criar produto: {ex.Message}");
            if (ex.InnerException != null)
                Console.WriteLine($"🔥 [Inner Exception]: {ex.InnerException.Message}");
                
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new { message = "Erro interno ao criar produto.", error = ex.Message });
        }
    }

    [HttpGet("public/{slug}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        try 
        {
            Console.WriteLine($"🔍 [GetBySlug] Iniciando busca por: '{slug}'");

            if (string.IsNullOrEmpty(slug))
                return BadRequest("Slug não fornecido.");

            // Verificação de segurança para não travar o banco
            var product = await _context.Products
                .Include(p => p.User)
                .Where(p => p.Slug != null && p.Slug.ToLower() == slug.ToLower()) 
                .FirstOrDefaultAsync();

            if (product == null)
            {
                Console.WriteLine($"❌ [GetBySlug] Produto não encontrado para o slug: {slug}");
                return NotFound(new { message = "Produto não encontrado ou indisponível." });
            }

            Console.WriteLine($"✅ [GetBySlug] Produto encontrado: {product.Title} (ID: {product.Id})");

            // Retorno anônimo seguro
            return Ok(new 
            {
                id = product.Id,
                title = product.Title,
                description = product.Description,
                priceCents = product.PriceInCents,
                imageUrl = product.ImageUrl,
                userId = product.UserId, // Mantendo compatibilidade
                slug = product.Slug,
                user = new {
                    name = product.User?.Name ?? "Vendedor",
                    avatarUrl = product.User?.AvatarUrl ?? "https://ui-avatars.com/api/?name=Vendedor"
                }
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"🔥 [CRITICAL ERROR] Erro ao buscar produto: {ex.Message}");
            Console.WriteLine(ex.StackTrace); 
            return StatusCode(500, new { message = "Erro interno no servidor.", error = ex.Message });
        }
    }
    
    [HttpGet]
    public async Task<IActionResult> List([FromHeader(Name = "X-User-Id")] string? headerUserId)
    {
        // Adaptação para listar produtos do seller logado
        // Se tiver token, usa o token. Se não, tenta header debug.
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value 
                     ?? User.FindFirst("sub")?.Value 
                     ?? headerUserId;

        if (string.IsNullOrEmpty(userId))
            return Unauthorized("User ID missing from Token and Header.");
        
        var products = await _context.Products
            .Where(p => p.UserId == userId && p.Active)
            .Select(p => new 
            {
                id = p.Id,
                title = p.Title,
                description = p.Description,
                priceCents = p.PriceInCents, // Fix: Maps explicit property name for Frontend
                imageUrl = p.ImageUrl,
                slug = p.Slug,
                sales = 0, // Placeholder for future stats
                revenue = 0, // Placeholder for future stats
                active = p.Active
            })
            .ToListAsync();

        return Ok(products);
    }
}
