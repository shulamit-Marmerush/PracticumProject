//using Microsoft.Extensions.Configuration;
//using Microsoft.Extensions.Logging;
//using Pictures.Core.DTOs;
//using Pictures.Core.Services;
//using System;
//using System.Collections.Generic;
//using System.IO;
//using System.Net.Http;
//using System.Net.Http.Json;
//using System.Net.Http.Headers;
//using System.Threading.Tasks;

//namespace Pictures.Service
//{
//    public class AIService : IAIService
//    {
//        private readonly ILogger<AIService> _logger;
//        private readonly HttpClient _httpClient;
//        private readonly string? _aiApiKey;
//        private readonly string? _aiEndpoint;
//        private bool _isAIAvailable = true;

//        public AIService(ILogger<AIService> logger, IConfiguration configuration, IHttpClientFactory httpClientFactory)
//        {
//            _logger = logger;
//            _httpClient = httpClientFactory.CreateClient("AIService");
//            _aiApiKey = configuration["AI:OPENAI_API_KEY"];
//            _aiEndpoint = configuration["AI:Endpoint"];

//            // בדיקה האם ה-AI זמין
//            CheckAIAvailability().GetAwaiter().GetResult(); // הפעלת בדיקת זמינות סינכרונית
//        }

//        private async Task CheckAIAvailability()
//        {
//            try
//            {
//                if (string.IsNullOrEmpty(_aiApiKey) || string.IsNullOrEmpty(_aiEndpoint))
//                {
//                    _isAIAvailable = false;
//                    _logger.LogWarning("AI service is not available: Missing API key or endpoint");
//                    return;
//                }

//                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _aiApiKey);
//                var response = await _httpClient.GetAsync($"{_aiEndpoint}");
//                _isAIAvailable = response.IsSuccessStatusCode;
//            }
//            catch (Exception ex)
//            {
//                _logger.LogWarning($"AI service is not available: {ex.Message}");
//                _isAIAvailable = false;
//            }
//        }

//        public async Task<string> GenerateImageCaptionAsync(string imageUrl)
//        {
//            if (!_isAIAvailable)
//            {
//                return GenerateFallbackCaption(imageUrl);
//            }

//            try
//            {
//                var request = new { imageUrl };
//                var response = await _httpClient.PostAsJsonAsync($"{_aiEndpoint}/vision/caption", request);

//                if (response.IsSuccessStatusCode)
//                {
//                    var result = await response.Content.ReadFromJsonAsync<CaptionResponse>();
//                    return result?.Caption ?? GenerateFallbackCaption(imageUrl);
//                }

//                _logger.LogWarning($"Failed to generate caption: {response.StatusCode}");
//                return GenerateFallbackCaption(imageUrl);
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Error generating image caption");
//                return GenerateFallbackCaption(imageUrl);
//            }
//        }

//        public async Task<List<string>> DetectObjectsAsync(string imageUrl)
//        {
//            if (!_isAIAvailable)
//            {
//                return GenerateFallbackObjects();
//            }

//            try
//            {
//                var request = new { imageUrl };
//                var response = await _httpClient.PostAsJsonAsync($"{_aiEndpoint}/vision/objects", request);

//                if (response.IsSuccessStatusCode)
//                {
//                    var result = await response.Content.ReadFromJsonAsync<ObjectsResponse>();
//                    return result?.Objects ?? GenerateFallbackObjects();
//                }

//                _logger.LogWarning($"Failed to detect objects: {response.StatusCode}");
//                return GenerateFallbackObjects();
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Error detecting objects");
//                return GenerateFallbackObjects();
//            }
//        }

//        public async Task<List<string>> ExtractDominantColorsAsync(string imageUrl)
//        {
//            if (!_isAIAvailable)
//            {
//                return GenerateFallbackColors();
//            }

//            try
//            {
//                var request = new { imageUrl };
//                var response = await _httpClient.PostAsJsonAsync($"{_aiEndpoint}/vision/colors", request);

//                if (response.IsSuccessStatusCode)
//                {
//                    var result = await response.Content.ReadFromJsonAsync<ColorsResponse>();
//                    return result?.Colors ?? GenerateFallbackColors();
//                }

//                _logger.LogWarning($"Failed to extract colors: {response.StatusCode}");
//                return GenerateFallbackColors();
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Error extracting dominant colors");
//                return GenerateFallbackColors();
//            }
//        }

//        public async Task<byte[]> EnhanceImageAsync(byte[] imageData)
//        {
//            if (!_isAIAvailable)
//            {
//                return imageData; // מחזיר את התמונה המקורית כגיבוי
//            }

//            try
//            {
//                var content = new MultipartFormDataContent();
//                content.Add(new ByteArrayContent(imageData), "image", "image.jpg");

//                var response = await _httpClient.PostAsync($"{_aiEndpoint}/vision/enhance", content);

//                if (response.IsSuccessStatusCode)
//                {
//                    return await response.Content.ReadAsByteArrayAsync();
//                }

//                _logger.LogWarning($"Failed to enhance image: {response.StatusCode}");
//                return imageData; // מחזיר את התמונה המקורית כגיבוי
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Error enhancing image");
//                return imageData; // מחזיר את התמונה המקורית כגיבוי
//            }
//        }

//        public async Task<AIThemeResponseDto> GenerateThemeSuggestionsAsync(AIThemeRequestDto request)
//        {
//            if (!_isAIAvailable || request.UseFallback)
//            {
//                return GenerateFallbackThemeSuggestions(request);
//            }

//            try
//            {
//                var response = await _httpClient.PostAsJsonAsync($"{_aiEndpoint}/collage/themes", request);

//                if (response.IsSuccessStatusCode)
//                {
//                    var result = await response.Content.ReadFromJsonAsync<AIThemeResponseDto>();
//                    return result ?? GenerateFallbackThemeSuggestions(request);
//                }

//                _logger.LogWarning($"Failed to generate theme suggestions: {response.StatusCode}");
//                return GenerateFallbackThemeSuggestions(request);
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Error generating theme suggestions");
//                return GenerateFallbackThemeSuggestions(request);
//            }
//        }

//        #region Fallback Methods

//        private string GenerateFallbackCaption(string imageUrl)
//        {
//            try
//            {
//                var fileName = Path.GetFileNameWithoutExtension(new Uri(imageUrl).AbsolutePath);
//                return $"תמונה {fileName}";
//            }
//            catch
//            {
//                return "תמונה";
//            }
//        }

//        private List<string> GenerateFallbackObjects()
//        {
//            return new List<string> { "תמונה", "צילום" };
//        }

//        private List<string> GenerateFallbackColors()
//        {
//            return new List<string> { "#4285F4", "#34A853", "#FBBC05", "#EA4335" };
//        }

//        private AIThemeResponseDto GenerateFallbackThemeSuggestions(AIThemeRequestDto request)
//        {
//            var suggestions = new List<ThemeSuggestionDto>
//            {
//                new ThemeSuggestionDto
//                {
//                    Name = "זכרונות יפים",
//                    Description = "קולאז' המציג את הרגעים היפים בצורה אלגנטית",
//                    Layout = "grid",
//                    Theme = "זכרונות",
//                    BackgroundColor = "#f8f9fa"
//                },
//                new ThemeSuggestionDto
//                {
//                    Name = "פסיפס צבעוני",
//                    Description = "קולאז' צבעוני עם מגוון תמונות בסגנון פסיפס",
//                    Layout = "masonry",
//                    Theme = "צבעוני",
//                    BackgroundColor = "#212529"
//                },
//                new ThemeSuggestionDto
//                {
//                    Name = "אוסף אקראי",
//                    Description = "קולאז' בסגנון חופשי עם תמונות מפוזרות",
//                    Layout = "random",
//                    Theme = "חופשי",
//                    BackgroundColor = "#e9ecef"
//                }
//            };

//            return new AIThemeResponseDto
//            {
//                IsFromFallback = true,
//                Suggestions = suggestions
//            };
//        }

//        #endregion

//        #region Response Classes

//        private class CaptionResponse
//        {
//            public string? Caption { get; set; }
//        }

//        private class ObjectsResponse
//        {
//            public List<string>? Objects { get; set; }
//        }

//        private class ColorsResponse
//        {
//            public List<string>? Colors { get; set; }
//        }

//        #endregion
//    }
//}
//using Microsoft.Extensions.Configuration;
//using Microsoft.Extensions.Logging;
//using Pictures.Core.DTOs;
//using Pictures.Core.Services;
//using System;
//using System.Collections.Generic;
//using System.IO;
//using System.Net.Http;
//using System.Net.Http.Json;
//using System.Net.Http.Headers;
//using System.Threading.Tasks;

//namespace Pictures.Service
//{
//    public class AIService : IAIService
//    {
//        private readonly ILogger<AIService> _logger;
//        private readonly HttpClient _httpClient;
//        private readonly string? _aiApiKey;
//        private readonly string? _aiEndpoint;
//        private bool _isAIAvailable = true;

//        public AIService(ILogger<AIService> logger, IConfiguration configuration, IHttpClientFactory httpClientFactory)
//        {
//            _logger = logger;
//            _httpClient = httpClientFactory.CreateClient("AIService");
//            _aiApiKey = configuration["AI:OPENAI_API_KEY"];
//            _aiEndpoint = configuration["AI:Endpoint"];

//            // בדיקה האם ה-AI זמין
//            CheckAIAvailability().GetAwaiter().GetResult(); // הפעלת בדיקת זמינות סינכרונית
//        }

//        private async Task CheckAIAvailability()
//        {
//            try
//            {
//                if (string.IsNullOrEmpty(_aiApiKey) || string.IsNullOrEmpty(_aiEndpoint))
//                {
//                    _isAIAvailable = false;
//                    _logger.LogWarning("AI service is not available: Missing API key or endpoint");
//                    return;
//                }

//                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _aiApiKey);
//                var response = await _httpClient.GetAsync($"{_aiEndpoint}");
//                _isAIAvailable = response.IsSuccessStatusCode;

//                if (!_isAIAvailable)
//                {
//                    throw new Exception("AI service is not available: Invalid response from API.");
//                }
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError($"AI service is not available: {ex.Message}");
//                throw; // מפסיק את הפעולה ומעביר את השגיאה למעלה
//            }
//        }

//        public async Task<string> GenerateImageCaptionAsync(string imageUrl)
//        {
//            if (!_isAIAvailable)
//            {
//                throw new Exception("AI service is not available.");
//            }

//            try
//            {
//                var request = new { imageUrl };
//                var response = await _httpClient.PostAsJsonAsync($"{_aiEndpoint}/vision/caption", request);

//                if (response.IsSuccessStatusCode)
//                {
//                    var result = await response.Content.ReadFromJsonAsync<CaptionResponse>();
//                    return result?.Caption ?? throw new Exception("Failed to generate caption.");
//                }

//                _logger.LogWarning($"Failed to generate caption: {response.StatusCode}");
//                throw new Exception("Failed to generate caption.");
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Error generating image caption");
//                throw; // מפסיק את הפעולה ומעביר את השגיאה למעלה
//            }
//        }

//        public async Task<List<string>> DetectObjectsAsync(string imageUrl)
//        {
//            if (!_isAIAvailable)
//            {
//                throw new Exception("AI service is not available.");
//            }

//            try
//            {
//                var request = new { imageUrl };
//                var response = await _httpClient.PostAsJsonAsync($"{_aiEndpoint}/vision/objects", request);

//                if (response.IsSuccessStatusCode)
//                {
//                    var result = await response.Content.ReadFromJsonAsync<ObjectsResponse>();
//                    return result?.Objects ?? throw new Exception("Failed to detect objects.");
//                }

//                _logger.LogWarning($"Failed to detect objects: {response.StatusCode}");
//                throw new Exception("Failed to detect objects.");
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Error detecting objects");
//                throw; // מפסיק את הפעולה ומעביר את השגיאה למעלה
//            }
//        }

//        public async Task<List<string>> ExtractDominantColorsAsync(string imageUrl)
//        {
//            if (!_isAIAvailable)
//            {
//                throw new Exception("AI service is not available.");
//            }

//            try
//            {
//                var request = new { imageUrl };
//                var response = await _httpClient.PostAsJsonAsync($"{_aiEndpoint}/vision/colors", request);

//                if (response.IsSuccessStatusCode)
//                {
//                    var result = await response.Content.ReadFromJsonAsync<ColorsResponse>();
//                    return result?.Colors ?? throw new Exception("Failed to extract colors.");
//                }

//                _logger.LogWarning($"Failed to extract colors: {response.StatusCode}");
//                throw new Exception("Failed to extract colors.");
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Error extracting dominant colors");
//                throw; // מפסיק את הפעולה ומעביר את השגיאה למעלה
//            }
//        }

//        public async Task<byte[]> EnhanceImageAsync(byte[] imageData)
//        {
//            if (!_isAIAvailable)
//            {
//                throw new Exception("AI service is not available.");
//            }

//            try
//            {
//                var content = new MultipartFormDataContent();
//                content.Add(new ByteArrayContent(imageData), "image", "image.jpg");

//                var response = await _httpClient.PostAsync($"{_aiEndpoint}/vision/enhance", content);

//                if (response.IsSuccessStatusCode)
//                {
//                    return await response.Content.ReadAsByteArrayAsync();
//                }

//                _logger.LogWarning($"Failed to enhance image: {response.StatusCode}");
//                throw new Exception("Failed to enhance image.");
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Error enhancing image");
//                throw; // מפסיק את הפעולה ומעביר את השגיאה למעלה
//            }
//        }

//        public async Task<AIThemeResponseDto> GenerateThemeSuggestionsAsync(AIThemeRequestDto request)
//        {
//            if (!_isAIAvailable)
//            {
//                throw new Exception("AI service is not available.");
//            }

//            try
//            {
//                var response = await _httpClient.PostAsJsonAsync($"{_aiEndpoint}/collage/themes", request);

//                if (response.IsSuccessStatusCode)
//                {
//                    var result = await response.Content.ReadFromJsonAsync<AIThemeResponseDto>();
//                    return result ?? throw new Exception("Failed to generate theme suggestions.");
//                }

//                _logger.LogWarning($"Failed to generate theme suggestions: {response.StatusCode}");
//                throw new Exception("Failed to generate theme suggestions.");
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Error generating theme suggestions");
//                throw; // מפסיק את הפעולה ומעביר את השגיאה למעלה
//            }
//        }

//        #region Response Classes

//        private class CaptionResponse
//        {
//            public string? Caption { get; set; }
//        }

//        private class ObjectsResponse
//        {
//            public List<string>? Objects { get; set; }
//        }

//        private class ColorsResponse
//        {
//            public List<string>? Colors { get; set; }
//        }

//        #endregion
//    }
//}
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Pictures.Core.DTOs;
using Pictures.Core.Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Net.Http.Json;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace Pictures.Service
{
    public class AIService : IAIService
    {
        private readonly ILogger<AIService> _logger;
        private readonly HttpClient _httpClient;
        private readonly string? _aiApiKey;
        private readonly string? _aiEndpoint;
        private bool _isAIAvailable = true;

        public AIService(ILogger<AIService> logger, IConfiguration configuration, IHttpClientFactory httpClientFactory)
        {
            _logger = logger;
            _httpClient = httpClientFactory.CreateClient("AIService");
            _aiApiKey = configuration["AI:API_KEY"];
            _aiEndpoint = configuration["AI:Endpoint"];

            // בדיקה האם ה-AI זמין
            CheckAIAvailability().GetAwaiter().GetResult(); // הפעלת בדיקת זמינות סינכרונית
        }

        private async Task CheckAIAvailability()
        {
            try
            {
                if (string.IsNullOrEmpty(_aiApiKey) || string.IsNullOrEmpty(_aiEndpoint))
                {
                    _isAIAvailable = false;
                    _logger.LogWarning("AI service is not available: Missing API key or endpoint");
                    return;
                }

                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _aiApiKey);
                var response = await _httpClient.GetAsync($"{_aiEndpoint}");
                _isAIAvailable = response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"AI service is not available: {ex.Message}");
                _isAIAvailable = false;
            }
        }

        public async Task<string> GenerateImageCaptionAsync(string imageUrl)
        {
            if (!_isAIAvailable)
            {
                throw new Exception("AI service is not available.");
            }

            try
            {
                var request = new
                {
                    prompt = $"what's in this image? {imageUrl}",
                    n = 1, // מספר התגובות שתרצה לקבל
                    size = "1024x1024" // גודל התמונה
                };

                var response = await _httpClient.PostAsJsonAsync($"{_aiEndpoint}/vision/caption", request);

                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadFromJsonAsync<CaptionResponse>();
                    return result?.Caption ?? throw new Exception("Failed to generate caption.");
                }

                _logger.LogWarning($"Failed to generate caption: {response.StatusCode}");
                throw new Exception("Failed to generate caption.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating image caption");
                throw; // מפסיק את הפעולה ומעביר את השגיאה למעלה
            }
        }

        public async Task<List<string>> DetectObjectsAsync(string imageUrl)
        {
            if (!_isAIAvailable)
            {
                throw new Exception("AI service is not available.");
            }

            try
            {
                var request = new { imageUrl };
                var response = await _httpClient.PostAsJsonAsync($"{_aiEndpoint}/vision/objects", request);

                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadFromJsonAsync<ObjectsResponse>();
                    return result?.Objects ?? throw new Exception("Failed to detect objects.");
                }

                _logger.LogWarning($"Failed to detect objects: {response.StatusCode}");
                throw new Exception("Failed to detect objects.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error detecting objects");
                throw; // מפסיק את הפעולה ומעביר את השגיאה למעלה
            }
        }

        public async Task<List<string>> ExtractDominantColorsAsync(string imageUrl)
        {
            if (!_isAIAvailable)
            {
                throw new Exception("AI service is not available.");
            }

            try
            {
                var request = new { imageUrl };
                var response = await _httpClient.PostAsJsonAsync($"{_aiEndpoint}/vision/colors", request);

                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadFromJsonAsync<ColorsResponse>();
                    return result?.Colors ?? throw new Exception("Failed to extract colors.");
                }

                _logger.LogWarning($"Failed to extract colors: {response.StatusCode}");
                throw new Exception("Failed to extract colors.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error extracting dominant colors");
                throw; // מפסיק את הפעולה ומעביר את השגיאה למעלה
            }
        }

        public async Task<byte[]> EnhanceImageAsync(byte[] imageData)
        {
            if (!_isAIAvailable)
            {
                throw new Exception("AI service is not available.");
            }

            try
            {
                var content = new MultipartFormDataContent();
                content.Add(new ByteArrayContent(imageData), "image", "image.jpg");

                var response = await _httpClient.PostAsync($"{_aiEndpoint}/vision/enhance", content);

                if (response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadAsByteArrayAsync();
                }

                _logger.LogWarning($"Failed to enhance image: {response.StatusCode}");
                throw new Exception("Failed to enhance image.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error enhancing image");
                throw; // מפסיק את הפעולה ומעביר את השגיאה למעלה
            }
        }

        public async Task<AIThemeResponseDto> GenerateThemeSuggestionsAsync(AIThemeRequestDto request)
        {
            if (!_isAIAvailable)
            {
                throw new Exception("AI service is not available.");
            }

            try
            {
                var response = await _httpClient.PostAsJsonAsync($"{_aiEndpoint}/collage/themes", request);

                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadFromJsonAsync<AIThemeResponseDto>();
                    return result ?? throw new Exception("Failed to generate theme suggestions.");
                }

                _logger.LogWarning($"Failed to generate theme suggestions: {response.StatusCode}");
                throw new Exception("Failed to generate theme suggestions.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating theme suggestions");
                throw; // מפסיק את הפעולה ומעביר את השגיאה למעלה
            }
        }

        #region Response Classes

        private class CaptionResponse
        {
            public string? Caption { get; set; }
        }

        private class ObjectsResponse
        {
            public List<string>? Objects { get; set; }
        }

        private class ColorsResponse
        {
            public List<string>? Colors { get; set; }
        }

        #endregion
    }
}

