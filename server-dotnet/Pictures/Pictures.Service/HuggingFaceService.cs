
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

public class OpenRouterService : IOpenRouterService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public OpenRouterService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _apiKey = configuration["OpenRouter:OPENAI_API_KEY"];

        if (string.IsNullOrEmpty(_apiKey))
        {
            throw new Exception("Missing OpenRouter API key. Check your configuration.");
        }
    }

    public async Task<string> GenerateTextAsync(string topic)
    {
        var payload = new
        {
            model = "openai/gpt-3.5-turbo",
            messages = new[]
            {
                new { role = "user", content = $"Write a poetic and vivid 5-line description about: {topic}" }
            }
        };

        var json = JsonConvert.SerializeObject(payload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        _httpClient.DefaultRequestHeaders.Clear();
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
        _httpClient.DefaultRequestHeaders.Add("X-Title", "my-dotnet-app");

        var response = await _httpClient.PostAsync("https://openrouter.ai/api/v1/chat/completions", content);
        response.EnsureSuccessStatusCode();

        var responseString = await response.Content.ReadAsStringAsync();
        dynamic result = JsonConvert.DeserializeObject(responseString);
        string generated = result?.choices?[0]?.message?.content;

        return generated ?? "No description generated.";
    }
}