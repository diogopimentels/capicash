using System.ComponentModel.DataAnnotations;

namespace Capicash.API.Models;

public class User
{
    // Changed to String to match Clerk ID (e.g. "user_2p...")
    public string Id { get; set; } = string.Empty;

    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    public string? PasswordHash { get; set; }

    public string? AvatarUrl { get; set; }

    // --- ASAAS SPLIT INTEGRATION ---
    [Required] 
    public string Document { get; set; } = string.Empty; // CPF ou CNPJ

    public string? AsaasApiKey { get; set; }
    public string? AsaasWalletId { get; set; }

    public ICollection<Product> Products { get; set; } = new List<Product>();
}
