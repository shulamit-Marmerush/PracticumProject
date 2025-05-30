using Pictures.Core.DTOs;
using System.Threading.Tasks;

namespace Pictures.Core.Services
{
    public interface IImageProcessingService
    {
        Task<ImageProcessingResultDto> ProcessImageAsync(int photoId, ImageProcessingRequestDto request);
        Task<ImageProcessingResultDto> UploadAndProcessImageAsync(byte[] imageData, string fileName, ImageProcessingRequestDto request);
    }
}
