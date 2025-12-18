using System.ComponentModel.DataAnnotations;

namespace Capicash.API.DTOs;

public class SyncUserDto
{
    [Required]
    public string Id { get; set; } = string.Empty; // Clerk ID
    
    [Required]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    // Campos opcionais que podem vir ou não
    // Mapearemos para 'Document' no Model
    public string? CpfCnpj { get; set; }
    
    public string? Phone { get; set; }
    
    public string? AvatarUrl { get; set; } 
    // Aceitamos também 'Document' caso o front mande antigo, para retrocompatibilidade
    public string? Document { get; set; }
}
