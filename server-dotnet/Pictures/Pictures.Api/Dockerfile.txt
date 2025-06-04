# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy project files and restore dependencies
COPY ["Pictures.Api/Pictures.Api.csproj", "Pictures.Api/"]
COPY ["Pictures.Core/Pictures.Core.csproj", "Pictures.Core/"]
COPY ["Pictures.Data/Pictures.Data.csproj", "Pictures.Data/"]
COPY ["Pictures.Service/Pictures.Service.csproj", "Pictures.Service/"]

RUN dotnet restore "./Pictures.Api/Pictures.Api.csproj"

# Copy the rest of the application code
COPY . .
WORKDIR "/src/Pictures.Api"

# Build the application
RUN dotnet build "./Pictures.Api.csproj" -c Release -o /app

# Stage 2: Run
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# Copy the built application from the build stage
COPY --from=build /app .

# Set the entry point for the application
ENTRYPOINT ["dotnet", "Pictures.Api.dll"]
