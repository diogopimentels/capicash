# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar apenas os arquivos de projeto/solução primeiro (para cachear o Restore)
COPY ["Capicash.sln", "./"]
COPY ["Capicash.API/Capicash.API.csproj", "Capicash.API/"]

# Restaurar dependências
RUN dotnet restore "Capicash.sln"

# Copiar todo o código fonte
COPY . .

# Build e Publish
WORKDIR "/src/Capicash.API"
RUN dotnet publish "Capicash.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Expor porta (Render usa a variável PORT, mas por padrão aspnet core ouve na 8080 no .NET 8)
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "Capicash.API.dll"]
