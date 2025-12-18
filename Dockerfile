# Estágio de Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# 1. Copiar o .csproj com o caminho CORRETO (adicionando backend/)
# A sintaxe é: COPY ["caminho/no/repo", "caminho/no/container"]
COPY ["backend/Capicash.API/Capicash.API.csproj", "backend/Capicash.API/"]

# 2. Restaurar dependências
RUN dotnet restore "backend/Capicash.API/Capicash.API.csproj"

# 3. Copiar todo o resto do projeto
COPY . .

# 4. Mudar para a pasta do projeto para fazer o build
WORKDIR "/src/backend/Capicash.API"
RUN dotnet build "Capicash.API.csproj" -c Release -o /app/build

# 5. Publicar
FROM build AS publish
RUN dotnet publish "Capicash.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Estágio Final (Runtime)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Configuração de Porta
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "Capicash.API.dll"]
