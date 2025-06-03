FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["Pictures.Api/Pictures.Api.csproj", "Pictures.Api/"]
COPY ["Pictures.Core/Pictures.Core.csproj", "Pictures.Core/"]
COPY ["Pictures.Data/Pictures.Data.csproj", "Pictures.Data/"]
COPY ["Pictures.Service/Pictures.Service.csproj", "Pictures.Service/"]

RUN dotnet restore "./Pictures.Api/Pictures.Api.csproj"

COPY . .
WORKDIR "/src/Pictures.Api"
