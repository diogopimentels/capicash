using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Capicash.API.Models;

public class Transaction
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public decimal Amount { get; set; }
    public string Status { get; set; } = "PENDING"; // PENDING, PAID, FAILED

    [Required]
    public string AsaasPaymentId { get; set; } = string.Empty;

    public string? BuyerEmail { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? PaidAt { get; set; }

    // Relation
    public Guid ProductId { get; set; }
    
    [JsonIgnore]
    public Product? Product { get; set; }
}
