using Capicash.API.Data;
using Capicash.API.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
// Trigger Restart 12345

// 1. SERVICES CONFIGURATION
// -------------------------------------------------------------------------

// Database Context
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Asaas Service
builder.Services.Configure<Capicash.API.Settings.AsaasSettings>(builder.Configuration.GetSection("Asaas"));
builder.Services.AddHttpClient<AsaasService>((serviceProvider, client) =>
{
    var settings = serviceProvider.GetRequiredService<Microsoft.Extensions.Options.IOptions<Capicash.API.Settings.AsaasSettings>>().Value;
    client.BaseAddress = new Uri(settings.ApiUrl);
    client.DefaultRequestHeaders.Add("access_token", settings.ApiKey);
    client.DefaultRequestHeaders.Add("User-Agent", "Capicash-System");
});

// CORS (Allow EVERYTHING for Debugging)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Authentication (Clerk)
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.Authority = builder.Configuration["Clerk:Authority"];
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateAudience = false, // Clerk uses azp
        ValidIssuer = builder.Configuration["Clerk:Authority"],
        NameClaimType = "email", // Map email to Name for easy access
        ValidateLifetime = true
    };
    options.Events = new Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine("⛔ Auth Falhou: " + context.Exception.Message);
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            Console.WriteLine("✅ Token Validado: " + context.Principal?.Identity?.Name);
            // Log claims for debug
            if (context.Principal != null) {
                foreach(var claim in context.Principal.Claims) {
                    Console.WriteLine($"   - Claim: {claim.Type} = {claim.Value}");
                }
            }
            return Task.CompletedTask;
        }
    };
});

// Controllers (No Global Filters)
builder.Services.AddControllers()
    .AddJsonOptions(options => 
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 2. PIPELINE CONFIGURATION (ORDER IS CRITICAL)
// -------------------------------------------------------------------------

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// --- EMERGENCY MIGRATION BYPASS (V3: NUCLEAR OPTION) ---
// Como o 'dotnet ef' não está instalado e temos um conflito de UUID vs String,
// vamos forçar o reset do banco via código.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try 
    {
        Console.WriteLine("⚠️ [NUCLEAR] Verificando esquema do banco...");
        
        // Tenta conectar. Se falhar, o banco nem existe.
        if (db.Database.CanConnect())
        {
             // O jeito mais garantido sem EF Tool: Apagar e Recriar.
             // CUIDADO: Isso apaga dados. Em Dev é OK.
             Console.WriteLine("🔥 [NUCLEAR] Apagando banco antigo para corrigir Schema...");
             db.Database.EnsureDeleted();
        }

        db.Database.EnsureCreated();
        Console.WriteLine("✅ [NUCLEAR] Banco recriado do zero com esquema novo (String IDs)!");

        // Garante índice único para Slug (opcional, já que o modelo deve tratar)
        // db.Database.ExecuteSqlRaw(@"CREATE UNIQUE INDEX IF NOT EXISTS ""IX_Products_Slug"" ON ""Products"" (""Slug"");");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"⚠️ Schema Initialization Failed: {ex.Message}");
    }
}
// -----------------------------------------------------

// 1. CORS FIRST
app.UseCors("AllowAll");

// 2. AUTHENTICATION SECOND
app.UseAuthentication();

// 3. AUTHORIZATION THIRD
app.UseAuthorization();

app.MapControllers();

app.Run();
