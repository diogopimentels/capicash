using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Capicash.API.DTOs;

public class CreateCheckoutDto
{
    [Required]
    [JsonPropertyName("productId")]
    public Guid ProductId { get; set; }

    [Required]
    [JsonPropertyName("name")] // Frontend sends 'name'
    public string BuyerName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [JsonPropertyName("email")] // Frontend sends 'email'
    public string BuyerEmail { get; set; } = string.Empty;

    [Required]
    [JsonPropertyName("taxId")] // Frontend sends 'taxId'
    public string BuyerCpf { get; set; } = string.Empty; // Maps taxId -> BuyerCpf

    [JsonPropertyName("phone")]
    public string Phone { get; set; } = string.Empty;
}
