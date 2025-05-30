using Pictures.Core.DTOs;
using System.Threading.Tasks;

namespace Pictures.Core.Services
{
    public interface ICollageService
    {
        Task<CollageResultDto> CreateCollageAsync(CollageRequestDto request, int userId);
        Task<AIThemeResponseDto> GetThemeSuggestionsAsync(AIThemeRequestDto request);
        Task<CollageResultDto> GetCollageAsync(int collageId);
        Task DeleteCollageAsync(int collageId);
    }
}
