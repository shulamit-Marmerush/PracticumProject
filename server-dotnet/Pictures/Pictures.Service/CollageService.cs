using Microsoft.Extensions.Logging;
using Pictures.Core.DTOs;
using Pictures.Core.Models;
using Pictures.Core.Repositories;
using Pictures.Core.Services;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Pictures.Service
{
    public class CollageService : ICollageService
    {
        private readonly ILogger<CollageService> _logger;
        private readonly IManagerRepository _managerRepository;
        private readonly IAIService _aiService;
        private readonly S3Service _s3Service;

        public CollageService(
            ILogger<CollageService> logger,
            IManagerRepository managerRepository,
            IAIService aiService,
            S3Service s3Service)
        {
            _logger = logger;
            _managerRepository = managerRepository;
            _aiService = aiService;
            _s3Service = s3Service;
        }

        public async Task<CollageResultDto> CreateCollageAsync(CollageRequestDto request, int userId)
        {
            try
            {
                // בדיקת תקינות הבקשה
                if (request.PhotoIds == null || request.PhotoIds.Count == 0)
                {
                    throw new ArgumentException("No photos selected for collage");
                }

                // קבלת התמונות ממסד הנתונים
                var photos = new List<Photo>();
                foreach (var photoId in request.PhotoIds)
                {
                    var photo = await _managerRepository.Photos.GetPhotoAsync(photoId);
                    if (photo != null)
                    {
                        photos.Add(photo);
                    }
                }

                if (photos.Count == 0)
                {
                    throw new ArgumentException("No valid photos found for collage");
                }

                // יצירת הקולאז'
                var collageFileName = $"collage_{Guid.NewGuid()}.png";
                var collagePath = $"collages/{userId}/{collageFileName}";

                // יצירת הקולאז' באמצעות ImageSharp
                byte[] collageData = await CreateCollageImageAsync(photos, request.Settings);

                // העלאת הקולאז' ל-S3
                // כאן צריך להוסיף לוגיקה להעלאת הקולאז' ל-S3

                // קבלת URL להורדה
                var collageUrl = await _s3Service.GetDownloadUrlAsync(collagePath);

                // יצירת תמונה ממוזערת
                byte[] thumbnailData = await CreateThumbnailAsync(collageData);
                var thumbnailPath = $"thumbnails/{userId}/{collageFileName}";

                // העלאת התמונה הממוזערת ל-S3
                // כאן צריך להוסיף לוגיקה להעלאת התמונה הממוזערת ל-S3

                // קבלת URL להורדה של התמונה הממוזערת
                var thumbnailUrl = await _s3Service.GetDownloadUrlAsync(thumbnailPath);

                // שמירת הקולאז' במסד הנתונים
                var collage = new Collage(
                    0, // collageId - יוגדר על ידי מסד הנתונים
                    userId,
                    null, // albumId
                    request.Settings.Name,
                    collagePath,
                    thumbnailPath,
                    DateTime.UtcNow,
                    request.Settings.Width,
                    request.Settings.Height,
                    request.Settings.BackgroundColor,
                    request.Settings.Layout,
                    request.Settings.Theme,
                    request.Settings.Padding,
                    request.Settings.AllowRotation,
                    request.Settings.AddShadow,
                    request.Settings.AddBorder,
                    request.Settings.BorderColor,
                    request.Settings.BorderWidth
                );

                // כאן צריך להוסיף לוגיקה לשמירת הקולאז' במסד הנתונים

                // יצירת קשרים בין הקולאז' לתמונות
                for (int i = 0; i < photos.Count; i++)
                {
                    var collagePhoto = new CollagePhoto(
                        0, // collagePhotoId - יוגדר על ידי מסד הנתונים
                        collage.CollageId,
                        photos[i].PhotoId,
                        i * 100, // positionX - ערך לדוגמה
                        i * 100, // positionY - ערך לדוגמה
                        200, // width - ערך לדוגמה
                        200, // height - ערך לדוגמה
                        i, // zIndex
                        0 // rotation
                    );

                    // כאן צריך להוסיף לוגיקה לשמירת הקשר במסד הנתונים
                }

                // המרה ל-DTO
                return new CollageResultDto
                {
                    CollageId = collage.CollageId,
                    Name = collage.Name,
                    Url = collageUrl,
                    ThumbnailUrl = thumbnailUrl,
                    CreatedAt = collage.CreatedAt,
                    IsFromFallback = false,
                    Photos = photos.Select(p => new PhotoDto
                    {
                        PhotoId = p.PhotoId,
                        Title = p.Title,
                        Url = p.Url
                    }).ToList()
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating collage");

                // במקרה של שגיאה, אם הוגדר להשתמש בגיבוי
                if (request.UseFallback)
                {
                    return await CreateFallbackCollageAsync(request, userId);
                }

                throw;
            }
        }

        public async Task<AIThemeResponseDto> GetThemeSuggestionsAsync(AIThemeRequestDto request)
        {
            try
            {
                return await _aiService.GenerateThemeSuggestionsAsync(request);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting theme suggestions");
                throw;
            }
        }

        public async Task<CollageResultDto> GetCollageAsync(int collageId)
        {
            try
            {
                // כאן צריך להוסיף לוגיקה לקבלת הקולאז' ממסד הנתונים

                // לצורך הדוגמה, נחזיר קולאז' ריק
                return new CollageResultDto
                {
                    CollageId = collageId,
                    Name = "Collage",
                    Url = "",
                    ThumbnailUrl = "",
                    CreatedAt = DateTime.UtcNow,
                    IsFromFallback = false,
                    Photos = new List<PhotoDto>()
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting collage with ID {collageId}");
                throw;
            }
        }

        public async Task DeleteCollageAsync(int collageId)
        {
            try
            {
                // כאן צריך להוסיף לוגיקה למחיקת הקולאז' ממסד הנתונים
                await Task.CompletedTask; // כדי לספק await
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting collage with ID {collageId}");
                throw;
            }
        }

        private async Task<byte[]> CreateCollageImageAsync(List<Photo> photos, CollageSettingsDto settings)
        {
            // כאן צריך להוסיף לוגיקה ליצירת תמונת הקולאז' באמצעות ImageSharp
            // לצורך הדוגמה, נחזיר מערך בתים ריק
            await Task.Delay(1); // כדי לספק await
            return new byte[0];
        }

        private async Task<byte[]> CreateThumbnailAsync(byte[] imageData)
        {
            // כאן צריך להוסיף לוגיקה ליצירת תמונה ממוזערת באמצעות ImageSharp
            // לצורך הדוגמה, נחזיר מערך בתים ריק
            await Task.Delay(1); // כדי לספק await
            return new byte[0];
        }

        private async Task<CollageResultDto> CreateFallbackCollageAsync(CollageRequestDto request, int userId)
        {
            try
            {
                // במקרה של שגיאה, נחזיר את התמונה הראשונה כקולאז'
                if (request.PhotoIds.Count > 0)
                {
                    var photo = await _managerRepository.Photos.GetPhotoAsync(request.PhotoIds[0]);
                    if (photo != null)
                    {
                        var photoUrl = await _s3Service.GetDownloadUrlAsync(photo.Url);

                        return new CollageResultDto
                        {
                            CollageId = 0,
                            Name = request.Settings.Name,
                            Url = photoUrl,
                            ThumbnailUrl = photoUrl,
                            CreatedAt = DateTime.UtcNow,
                            IsFromFallback = true,
                            Photos = new List<PhotoDto>
                            {
                                new PhotoDto
                                {
                                    PhotoId = photo.PhotoId,
                                    Title = photo.Title,
                                    Url = photo.Url
                                }
                            }
                        };
                    }
                }

                // אם אין תמונות, נחזיר קולאז' ריק
                return new CollageResultDto
                {
                    CollageId = 0,
                    Name = request.Settings.Name,
                    Url = "",
                    ThumbnailUrl = "",
                    CreatedAt = DateTime.UtcNow,
                    IsFromFallback = true,
                    Photos = new List<PhotoDto>()
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating fallback collage");
                throw;
            }
        }
    }
}