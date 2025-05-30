using Microsoft.Extensions.Logging;
using Pictures.Core.DTOs;
using Pictures.Core.Models;
using Pictures.Core.Repositories;
using Pictures.Core.Services;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Pictures.Service
{
    public class ImageProcessingService : IImageProcessingService
    {
        private readonly ILogger<ImageProcessingService> _logger;
        private readonly IManagerRepository _managerRepository;
        private readonly IAIService _aiService;
        private readonly S3Service _s3Service;

        public ImageProcessingService(
            ILogger<ImageProcessingService> logger,
            IManagerRepository managerRepository,
            IAIService aiService,
            S3Service s3Service)
        {
            _logger = logger;
            _managerRepository = managerRepository;
            _aiService = aiService;
            _s3Service = s3Service;
        }

        public async Task<ImageProcessingResultDto> ProcessImageAsync(int photoId, ImageProcessingRequestDto request)
        {
            try
            {
                // קבלת התמונה ממסד הנתונים
                var photo = await _managerRepository.Photos.GetPhotoAsync(photoId);
                if (photo == null)
                {
                    throw new Exception($"Photo with ID {photoId} not found");
                }

                // קבלת URL להורדה
                var imageUrl = await _s3Service.GetDownloadUrlAsync(photo.Url);

                // עיבוד התמונה
                var result = new ImageProcessingResult
                {
                    PhotoId = photoId,
                    UserId = photo.UserId,
                    OriginalImageUrl = imageUrl,
                    ProcessedImageUrl = imageUrl, // ברירת מחדל - אותה תמונה
                    IsFromFallback = request.UseFallback,
                    ProcessedAt = DateTime.UtcNow
                };

                // עיבוד התמונה באמצעות AI
                await ProcessWithAI(result, imageUrl, request);

                // שמירת התוצאה במסד הנתונים
                // כאן צריך להוסיף לוגיקה לשמירת התוצאה במסד הנתונים

                // המרה ל-DTO
                return MapToDto(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error processing image with ID {photoId}");
                throw;
            }
        }

        public async Task<ImageProcessingResultDto> UploadAndProcessImageAsync(byte[] imageData, string fileName, ImageProcessingRequestDto request)
        {
            try
            {
                // העלאת התמונה ל-S3
                var s3Key = $"uploads/{Guid.NewGuid()}/{fileName}";
                var contentType = GetContentType(fileName);

                // קבלת URL להעלאה
                var uploadUrl = _s3Service.GeneratePresignedUrlAsync(s3Key, contentType);

                // העלאת התמונה
                // כאן צריך להוסיף לוגיקה להעלאת התמונה ל-S3

                // קבלת URL להורדה
                var imageUrl = await _s3Service.GetDownloadUrlAsync(s3Key);

                // יצירת רשומת תמונה חדשה
                var photo = new Photo
                {
                    Url = s3Key,
                    Title = Path.GetFileNameWithoutExtension(fileName),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                    // כאן צריך להוסיף את ה-UserId ו-AlbumId
                };

                // שמירת התמונה במסד הנתונים
                var createdPhoto = await _managerRepository.Photos.CreatePhotoAsync(photo);
                await _managerRepository.SaveAsync();

                // עיבוד התמונה
                var result = new ImageProcessingResult
                {
                    PhotoId = createdPhoto.PhotoId,
                    UserId = createdPhoto.UserId,
                    OriginalImageUrl = imageUrl,
                    ProcessedImageUrl = imageUrl, // ברירת מחדל - אותה תמונה
                    IsFromFallback = request.UseFallback,
                    ProcessedAt = DateTime.UtcNow
                };

                // עיבוד התמונה באמצעות AI
                await ProcessWithAI(result, imageUrl, request);

                // שמירת התוצאה במסד הנתונים
                // כאן צריך להוסיף לוגיקה לשמירת התוצאה במסד הנתונים

                // המרה ל-DTO
                return MapToDto(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading and processing image");
                throw;
            }
        }

        private async Task ProcessWithAI(ImageProcessingResult result, string imageUrl, ImageProcessingRequestDto request)
        {
            try
            {
                // זיהוי אובייקטים
                if (request.DetectObjects)
                {
                    result.DetectedObjects = await _aiService.DetectObjectsAsync(imageUrl);
                }

                // זיהוי צבעים
                if (request.DetectColors)
                {
                    result.DominantColors = await _aiService.ExtractDominantColorsAsync(imageUrl);
                }

                // יצירת כיתוב
                if (request.GenerateCaption)
                {
                    result.Caption = await _aiService.GenerateImageCaptionAsync(imageUrl);
                }

                // שיפור איכות התמונה
                if (request.EnhanceImage)
                {
                    // הורדת התמונה
                    // כאן צריך להוסיף לוגיקה להורדת התמונה מה-URL
                    byte[] imageData = new byte[0]; // לוגיקה להורדת התמונה

                    // שיפור התמונה
                    var enhancedImageData = await _aiService.EnhanceImageAsync(imageData);

                    // העלאת התמונה המשופרת
                    var enhancedS3Key = $"enhanced/{Guid.NewGuid()}/{Path.GetFileName(new Uri(imageUrl).AbsolutePath)}";
                    // כאן צריך להוסיף לוגיקה להעלאת התמונה המשופרת ל-S3

                    // עדכון ה-URL של התמונה המעובדת
                    result.ProcessedImageUrl = await _s3Service.GetDownloadUrlAsync(enhancedS3Key);
                }

                // יצירת תגיות
                result.Tags = new System.Collections.Generic.List<string>();
                if (result.DetectedObjects != null)
                {
                    result.Tags.AddRange(result.DetectedObjects);
                }
                if (!string.IsNullOrEmpty(result.Caption))
                {
                    // חילוץ מילות מפתח מהכיתוב
                    var keywords = result.Caption.Split(' ', ',', '.', '!', '?', ';', ':', '-', '(', ')', '[', ']', '{', '}')
                        .Where(k => k.Length > 3)
                        .Distinct()
                        .Take(5);
                    result.Tags.AddRange(keywords);
                }
                result.Tags = result.Tags.Distinct().ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing image with AI");
                result.IsFromFallback = true;

                // יצירת תוצאות ברירת מחדל
                if (request.DetectObjects && (result.DetectedObjects == null || result.DetectedObjects.Count == 0))
                {
                    result.DetectedObjects = new System.Collections.Generic.List<string> { "תמונה", "צילום" };
                }

                if (request.DetectColors && (result.DominantColors == null || result.DominantColors.Count == 0))
                {
                    result.DominantColors = new System.Collections.Generic.List<string> { "#4285F4", "#34A853", "#FBBC05", "#EA4335" };
                }

                if (request.GenerateCaption && string.IsNullOrEmpty(result.Caption))
                {
                    var fileName = Path.GetFileNameWithoutExtension(new Uri(imageUrl).AbsolutePath);
                    result.Caption = $"תמונה {fileName}";
                }

                if (result.Tags == null || result.Tags.Count == 0)
                {
                    result.Tags = new System.Collections.Generic.List<string> { "תמונה", "צילום", "אלבום" };
                }
            }
        }

        private string GetContentType(string fileName)
        {
            var extension = Path.GetExtension(fileName).ToLower();
            return extension switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                ".bmp" => "image/bmp",
                ".webp" => "image/webp",
                _ => "application/octet-stream"
            };
        }

        private ImageProcessingResultDto MapToDto(ImageProcessingResult result)
        {
            return new ImageProcessingResultDto
            {
                Id = result.Id,
                PhotoId = result.PhotoId,
                OriginalImageUrl = result.OriginalImageUrl,
                ProcessedImageUrl = result.ProcessedImageUrl,
                Caption = result.Caption,
                Tags = result.Tags,
                DetectedObjects = result.DetectedObjects,
                DominantColors = result.DominantColors,
                IsFromFallback = result.IsFromFallback,
                ProcessedAt = result.ProcessedAt
            };
        }
    }
}
