using Capicash.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Nodes;
using Microsoft.Extensions.Options;
using Capicash.API.Settings;

namespace Capicash.API.Controllers;

[ApiController]
[Route("api/webhooks/asaas")]
public class WebhookController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly AsaasSettings _settings;
    private readonly ILogger<WebhookController> _logger;

    public WebhookController(AppDbContext context, IOptions<AsaasSettings> settings, ILogger<WebhookController> logger)
    {
        _context = context;
        _settings = settings.Value;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> HandleWebhook([FromBody] JsonNode payload, [FromHeader(Name = "asaas-access-token")] string? token)
    {
        // 1. Security Check
        if (string.IsNullOrEmpty(_settings.WebhookAccessToken) || token != _settings.WebhookAccessToken)
        {
            _logger.LogWarning("Invalid Webhook Token. Received: {Token}", token);
            return Unauthorized();
        }

        // 2. Extract Event Data
        var eventName = payload["event"]?.ToString();
        var paymentId = payload["payment"]?["id"]?.ToString();

        _logger.LogInformation("Webhook Received: {Event} for Payment {PaymentId}", eventName, paymentId);

        if (paymentId == null) return BadRequest("Missing payment ID");

        // 3. Handle Events
        if (eventName == "PAYMENT_RECEIVED" || eventName == "PAYMENT_CONFIRMED")
        {
            var transaction = await _context.Transactions
                .Include(t => t.Product) // Eager Load Product
                .FirstOrDefaultAsync(t => t.AsaasPaymentId == paymentId);
            
            if (transaction != null)
            {
                if (transaction.Status != "PAID") 
                {
                    transaction.Status = "PAID";
                    transaction.PaidAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();

                    // 4. Delivery Service (Simulated)
                    var contentUrl = transaction.Product?.ContentUrl ?? "Sem Link Configurado";
                    Console.WriteLine($"✅ [DELIVERY] Pagamento Confirmado! Enviando email para {transaction.BuyerEmail}");
                    Console.WriteLine($"📦 [DELIVERY] Conteúdo: {contentUrl}");
                }
            }
            else
            {
                _logger.LogWarning("Transaction not found for Asaas ID: {PaymentId}", paymentId);
            }
        }

        return Ok(new { received = true });
    }
}
