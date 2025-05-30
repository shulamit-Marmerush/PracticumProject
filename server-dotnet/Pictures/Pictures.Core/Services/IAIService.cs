using Pictures.Core.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pictures.Core.Services
{
    public interface IAIService
    {
        Task<string> GenerateImageCaptionAsync(string imageUrl);
        Task<List<string>> DetectObjectsAsync(string imageUrl);
        Task<List<string>> ExtractDominantColorsAsync(string imageUrl);
        Task<byte[]> EnhanceImageAsync(byte[] imageData);
        Task<AIThemeResponseDto> GenerateThemeSuggestionsAsync(AIThemeRequestDto request);
    }
}
