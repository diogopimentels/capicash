using Capicash.API.Data;
using Capicash.API.DTOs;
using Capicash.API.Models;
using Capicash.API.Services;
using Microsoft.AspNetCore.Authorization; // FIXED: Added missing namespace
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Capicash.API.Controllers;

[ApiController]
[Route("[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly AsaasService _asaasService;
    private readonly ILogger<UsersController> _logger;

    public UsersController(AppDbContext context, AsaasService asaasService, ILogger<UsersController> logger)
    {
        _context = context;
        _asaasService = asaasService;
        _logger = logger;
    }

    [HttpPost("sync")]
    [Authorize]
    public async Task<IActionResult> Sync([FromBody] SyncUserDto dto)
    {
        Console.WriteLine($"🔄 [Sync] Recebendo requisição para: {dto.Email} (ID: {dto.Id})");

        if (!ModelState.IsValid)
        {
            Console.WriteLine("❌ [Sync] Model State Inválido");
            return BadRequest(ModelState);
        }

        try 
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == dto.Id);
            
            if (user == null)
            {
                Console.WriteLine("✨ [Sync] Usuário novo! Criando no banco...");
                
                // Prioriza Document, depois CpfCnpj, depois Default (CPF Teste válido para Sandbox)
                var doc = !string.IsNullOrEmpty(dto.Document) ? dto.Document : 
                          !string.IsNullOrEmpty(dto.CpfCnpj) ? dto.CpfCnpj : "44905398035"; // CPF Gerado para Teste

                user = new User 
                { 
                    Id = dto.Id, 
                    Name = dto.Name, 
                    Email = dto.Email,
                    Document = doc,
                    AvatarUrl = dto.AvatarUrl
                };
                
                // Tenta criar carteira no Asaas
                try {
                    Console.WriteLine("🔄 [Sync] Tentando criar conta Asaas...");
                    var walletId = await _asaasService.CreateSubaccount(user.Name, user.Email, user.Document);
                    user.AsaasWalletId = walletId;
                    Console.WriteLine($"✅ [Sync] Conta Asaas criada: {walletId}");
                } catch (Exception ex) {
                    Console.WriteLine($"⚠️ [Sync] Erro Asaas: {ex.Message}");
                }

                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                Console.WriteLine("✅ [Sync] Usuário salvo no banco com sucesso!");
            }
            else 
            {
                // SE O USUÁRIO JÁ EXISTE MAS NÃO TEM CARTEIRA (RECUPERAÇÃO)
                if (string.IsNullOrEmpty(user.AsaasWalletId))
                {
                    Console.WriteLine("⚠️ [Sync] Usuário existe mas sem Carteira Asaas. Tentando criar...");
                    try {
                        // Garante documento válido se estiver placeholder
                        if (user.Document == "00000000000" || string.IsNullOrEmpty(user.Document)) user.Document = "44905398035";

                        var walletId = await _asaasService.CreateSubaccount(user.Name, user.Email, user.Document);
                        user.AsaasWalletId = walletId;
                        await _context.SaveChangesAsync();
                        Console.WriteLine($"✅ [Sync] Carteira recuperada: {walletId}");
                    } catch (Exception ex) {
                         Console.WriteLine($"❌ [Sync] Falha na recuperação da carteira: {ex.Message}");
                    }
                }
                Console.WriteLine("ℹ️ [Sync] Usuário sincronizado.");
            }
            
            return Ok(user);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"🔥 [Sync] Erro Fatal: {ex.Message}");
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpGet("me/metrics")]
    public async Task<IActionResult> GetMetrics([FromHeader(Name = "X-User-Id")] string? headerUserId)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? headerUserId;
        
        if (string.IsNullOrEmpty(userId)) 
            return Unauthorized("User ID missing");

        var products = await _context.Products
            .Where(p => p.UserId == userId)
            .Include(p => p.User)
            .ToListAsync();
            
        var productIds = products.Select(p => p.Id).ToList();

        var transactions = await _context.Transactions
            .Where(t => productIds.Contains(t.ProductId) && t.Status == "PAID")
            .ToListAsync();

        var metrics = new 
        {
            availableBalance = transactions.Sum(t => t.Amount) * 100, // Em centavos
            totalRevenue = transactions.Sum(t => t.Amount) * 100,     // Total bruto
            activeLinks = products.Count(p => p.Active),
            salesCount = transactions.Count, 
            
            salesChart = new [] { 
                new { date = "01/12", value = 150 }, 
                new { date = "05/12", value = 300 },
                new { date = "10/12", value = 450 }
            },
            recentSales = transactions.Take(5).Select(t => new {
                name = t.BuyerEmail,
                email = t.BuyerEmail,
                amount = t.Amount * 100,
                status = "success"
            })
        };

        return Ok(metrics);
    }
}
