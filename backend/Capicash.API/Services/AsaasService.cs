using System.Text.Json;
using System.Text.Json.Nodes;
using Capicash.API.Settings;
using Microsoft.Extensions.Options;

namespace Capicash.API.Services;

public class AsaasService
{
    private readonly HttpClient _httpClient;
    private readonly AsaasSettings _settings;

    public AsaasService(HttpClient httpClient, IOptions<AsaasSettings> settings)
    {
        _httpClient = httpClient;
        _settings = settings.Value;
        // O HttpClient já vem configurado do Program.cs com BaseAddress e Headers
    }

    public async Task<string> CreateSubaccount(string name, string email, string cpfCnpj)
    {
        var payload = new
        {
            name,
            email,
            cpfCnpj,
            // Configurações padrão para subconta (pode evoluir depois)
            // Celular Válido fornecido pelo usuário (Obrigatório para Asaas)
            mobilePhone = "17996322864", 
            postalCode = "01001000",
            address = "Av. Paulista", 
            addressNumber = "100",
            province = "Centro",
            city = "Sao Paulo",
            state = "SP",
            birthDate = "1990-01-01", // Obrigatório para Pessoa Física
            incomeValue = 5000 // Renda Mensal Estimada (Obrigatório em alguns casos)
        };

        var response = await _httpClient.PostAsJsonAsync("v3/accounts", payload);
        var content = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            // Estratégia de Recuperação 2.0: Se o email já existe, a conta antiga pode estar quebrada/inativa no Sandbox.
            // Solução: Criar uma NOVA conta forçando um alias de email (ex: user+timestamp@gmail.com)
            if (content.Contains("email") && content.Contains("em uso") || content.Contains("CPF") && content.Contains("em uso"))
            {
                var aliasEmail = email.Split('@')[0] + "+" + DateTime.Now.Ticks + "@" + email.Split('@')[1];
                Console.WriteLine($"♻️ [AsaasService] Email/CPF duplicado. Criando conta com Alias: {aliasEmail}");
                
                // Recursão com email novo E CPF novo (aleatório) para evitar colisão
                var randomCpf = GenerateValidCpf();
                return await CreateSubaccount(name, aliasEmail, randomCpf);
            }

            throw new Exception($"Erro ao criar conta Asaas: {content}");
        }

        var json = JsonSerializer.Deserialize<JsonNode>(content);
        return json?["id"]?.ToString() ?? throw new Exception("ID da conta Asaas não retornado");
    }

    public async Task<JsonNode> CreatePixCharge(string customerName, string customerCpf, decimal value, string description, string walletIdSeller, string? customerPhone = null)
    {
        // 1. Criar Cliente (Simplificado - em prod buscaria antes)
        var customerPayload = new 
        { 
            name = customerName, 
            cpfCnpj = customerCpf,
            mobilePhone = customerPhone 
        };
        var customerRes = await _httpClient.PostAsJsonAsync("v3/customers", customerPayload);
        var customerJson = await customerRes.Content.ReadFromJsonAsync<JsonNode>();
        var customerId = customerJson?["id"]?.ToString();

        // 2. Definir Split (80% Seller)
        var splitValue = Math.Round(value * 0.8m, 2);
        var splitRules = new[]
        {
            new 
            {
                walletId = walletIdSeller,
                fixedValue = splitValue
            }
        };

        // 3. Criar Cobrança PIX
        var paymentPayload = new
        {
            customer = customerId,
            billingType = "PIX",
            value = value,
            dueDate = DateTime.Now.AddDays(1).ToString("yyyy-MM-dd"),
            description = description,
            split = splitRules
        };

        // VERIFICAR SE A CARTEIRA EXISTE MESMO
        try 
        {
            var checkWallet = await _httpClient.GetAsync($"v3/accounts/{walletIdSeller}");
            var checkContent = await checkWallet.Content.ReadAsStringAsync();
            Console.WriteLine($"🔍 [AsaasService] Check Wallet {walletIdSeller}: {checkWallet.StatusCode}");
            if (!checkWallet.IsSuccessStatusCode)
            {
                Console.WriteLine($"❌ [AsaasService] A Carteira NÃO foi encontrada na verificação pré-cobrança!");
            }
        } 
        catch (Exception) { /* Ignora erro de check */ }

        // 3. Criar Cobrança PIX (Com Retry para Propagação do Sandbox)
        int maxRetries = 3;
        for (int i = 0; i <= maxRetries; i++)
        {
            var response = await _httpClient.PostAsJsonAsync("v3/payments", paymentPayload);
            var content = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                return JsonSerializer.Deserialize<JsonNode>(content)!;
            }

            // Se falhar e for erro de carteira (propagação), esperamos e tentamos de novo
            if (i < maxRetries && content.Contains("Wallet") && content.Contains("inexistente"))
            {
                // Se for a última tentativa de 'PROPAGAÇÃO', vamos tentar SEM SPLIT (Fallback)
                if (i == maxRetries - 1)
                {
                    Console.WriteLine("⚠️ [AsaasService] Falha de Split persistente. Tentando SEM SPLIT (Fallback)...");
                    var payloadNoSplit = new 
                    {
                        customer = customerId,
                        billingType = "PIX",
                        value = value,
                        dueDate = DateTime.Now.AddDays(1).ToString("yyyy-MM-dd"),
                        description = description
                        // Sem Split
                    };

                    var resFallback = await _httpClient.PostAsJsonAsync("v3/payments", payloadNoSplit);
                    var contentFallback = await resFallback.Content.ReadAsStringAsync();

                    if (resFallback.IsSuccessStatusCode)
                    {
                        Console.WriteLine("✅ [AsaasService] Pagamento Realizado (SEM SPLIT) via Fallback.");
                        return JsonSerializer.Deserialize<JsonNode>(contentFallback)!;
                    }
                }

                Console.WriteLine($"⏳ [AsaasService] Wallet ainda não propagada. Tentativa {i + 1}/{maxRetries}. Aguardando 2s...");
                await Task.Delay(2000); // 2 segundos de delay
                continue;
            }

            // Se for a última tentativa ou outro erro, estoura
            if (i == maxRetries)
            {
                Console.WriteLine($"❌ [AsaasService] Falha Pay (Final): {content}");
                throw new Exception($"Erro ao criar cobrança Asaas: {content}");
            }
        }
        
        throw new Exception("Erro inesperado no fluxo de pagamento.");
    }

    public async Task<JsonNode> GetPixQrCode(string paymentId)
    {
        var response = await _httpClient.GetAsync($"v3/payments/{paymentId}/pixQrCode");
        var content = await response.Content.ReadAsStringAsync();
        
        if (!response.IsSuccessStatusCode)
        {
            Console.WriteLine($"❌ [AsaasService] Falha ao obter QR Code: {content}");
            return null;
        }

        return JsonSerializer.Deserialize<JsonNode>(content);
    }

    private string GenerateValidCpf()
    {
        var rnd = new Random();
        int[] cpf = new int[11];
        for (int i = 0; i < 9; i++) cpf[i] = rnd.Next(0, 9);
        int sum = 0;
        for (int i = 0; i < 9; i++) sum += cpf[i] * (10 - i);
        int rem = sum % 11;
        cpf[9] = rem < 2 ? 0 : 11 - rem;
        sum = 0;
        for (int i = 0; i < 10; i++) sum += cpf[i] * (11 - i);
        rem = sum % 11;
        cpf[10] = rem < 2 ? 0 : 11 - rem;
        return string.Join("", cpf);
    }
}
