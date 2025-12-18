using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Capicash.API.Models;

public class Product
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty; // Novo campo para URL amigável

    public string? Description { get; set; }

    public int PriceInCents { get; set; }

    public string? RedirectUrl { get; set; }
    public string? ContentUrl { get; set; } // O Produto em si (Link de Download/Acesso)
    public string? ImageUrl { get; set; }

    public bool Active { get; set; } = true;

    // --- RELATIONSHIPS ---
    public string UserId { get; set; } = string.Empty; // ID do Clerk (String)

    // O CAMPO CRÍTICO:
    // public string Slug { get; set; } = string.Empty; // REMOVED DUPLICATE
    
    [JsonIgnore]
    public User? User { get; set; }
}
