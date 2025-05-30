using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Text;

public class ChatService : IChatService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public ChatService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _apiKey = configuration["OpenRouter:OPENAI_API_KEY"];
    }

    public async Task<string> SendChatMessageAsync(List<(string role, string content)> messages)
    {
        var messagePayload = messages.Select(m => new { role = m.role, content = m.content }).ToList();

        var payload = new
        {
            model = "openai/gpt-3.5-turbo",
            messages = messagePayload
        };

        var json = JsonConvert.SerializeObject(payload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        _httpClient.DefaultRequestHeaders.Clear();
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
        _httpClient.DefaultRequestHeaders.Add("X-Title", "my-dotnet-chat");

        var response = await _httpClient.PostAsync("https://openrouter.ai/api/v1/chat/completions", content);
        response.EnsureSuccessStatusCode();

        var responseString = await response.Content.ReadAsStringAsync();
        dynamic result = JsonConvert.DeserializeObject(responseString);
        string generated = result?.choices?[0]?.message?.content;

        return generated ?? "No response.";
    }
}
