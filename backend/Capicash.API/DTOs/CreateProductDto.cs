using System.ComponentModel.DataAnnotations;

using System.Text.Json.Serialization;

namespace Capicash.API.DTOs;

public class CreateProductDto
{
    [Required]
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [Required]
    [Range(1, 10000000)] // Min 1 centavo, Max 100k
    [JsonPropertyName("priceCents")] 
    public int PriceInCents { get; set; }

    [JsonPropertyName("redirectUrl")]
    public string? RedirectUrl { get; set; }

    [JsonPropertyName("contentUrl")]
    public string? ContentUrl { get; set; }

    [JsonPropertyName("imageUrl")]
    public string? ImageUrl { get; set; }
}
