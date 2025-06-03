using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Amazon.S3;
using Amazon.Extensions.NETCore.Setup;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Load configuration
builder.Configuration.AddJsonFile("secret.json", optional: true, reloadOnChange: true);

// AWS
builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());
builder.Services.AddAWSService<IAmazonS3>();

// HttpClientFactory for AIService
builder.Services.AddHttpClient("AIService", client =>
{
    client.Timeout = TimeSpan.FromSeconds(30);
});

// Add CORS policy (adjust the policy name and rules as needed)
builder.Services.AddCors(options =>
{
    options.AddPolicy("MyPolicy", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Dependency Injection registrations
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddDbContext<DataContext>();

// AutoMapper profiles
builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<MappingProfile>();
    cfg.AddProfile<MapingProfileApi>(); // Note: Is this a typo? Should it be MappingProfileApi?
});

// S3 Service (singleton)
builder.Services.AddSingleton<S3Service>();
builder.Services.AddSingleton<IAmazonS3>(sp =>
{
    var configuration = sp.GetRequiredService<IConfiguration>();
    // You need to provide valid credentials and config here
    var awsOptions = configuration.GetAWSOptions();
    return awsOptions.CreateServiceClient<IAmazonS3>();
});

// OpenRouterService
builder.Services.AddScoped<IOpenRouterService>(sp =>
{
    var httpClient = sp.GetRequiredService<IHttpClientFactory>().CreateClient("AIService");
    var configuration = sp.GetRequiredService<IConfiguration>();
    return new ChatService(httpClient, configuration);
});

// JWT Authentication (configure as needed)
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    // configure JWT validation here
    // options.TokenValidationParameters = ...
});

// Authorization policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("EditorOrAdmin", policy => policy.RequireRole("Editor", "Admin"));
    options.AddPolicy("ViewerOnly", policy => policy.RequireRole("Viewer"));
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("MyPolicy");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers(); // Only if you use controllers

app.Run();
