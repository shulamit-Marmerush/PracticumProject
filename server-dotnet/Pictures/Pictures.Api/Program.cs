using Microsoft.Extensions.DependencyInjection;Add commentMore actions

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile("secret.json", optional: true, reloadOnChange: true);


//  AWS
builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());
builder.Services.AddAWSService<IAmazonS3>();

// äåñôú HttpClientFactory
builder.Services.AddHttpClient("AIService", client =>
{
    client.Timeout = TimeSpan.FromSeconds(30);

    policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
}));


builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<AuthService>();


builder.Services.AddDbContext<DataContext>();

// øéùåí AutoMapper
builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<MappingProfile>();
    cfg.AddProfile<MapingProfileApi>();
});
builder.Services.AddSingleton<S3Service>();

// øéùåí S3 Client
builder.Services.AddSingleton<IAmazonS3>(sp =>
{
    var configuration = sp.GetRequiredService<IConfiguration>();

    return new AmazonS3Client(credentials, clientConfig);
});

//OpenRouterService
builder.Services.AddScoped<IOpenRouterService>(sp =>
{
    var httpClient = sp.GetRequiredService<IHttpClientFactory>().CreateClient("AIService");

    return new ChatService(httpClient, configuration);
});

// JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;

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
