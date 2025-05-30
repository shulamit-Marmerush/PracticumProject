using System;
using System.Collections.Generic;
using static Pictures.Core.Models.Collage;

namespace Pictures.Core.Models
{
    /// <summary>
    /// תוצאת עיבוד תמונה
    /// </summary>
    public class ImageProcessingResult
    {
        public int Id { get; set; }
        public int PhotoId { get; set; }
        public int UserId { get; set; }
        public string OriginalImageUrl { get; set; }
        public string ProcessedImageUrl { get; set; }
        public string Caption { get; set; }
        public List<string> Tags { get; set; } = new List<string>();
        public List<string> DetectedObjects { get; set; } = new List<string>();
        public List<string> DominantColors { get; set; } = new List<string>();
        public bool IsFromFallback { get; set; }
        public DateTime ProcessedAt { get; set; } = DateTime.UtcNow;

        public List<CollagePhoto> CollagePhotos { get; set; } = new List<CollagePhoto>();
        public Photo Photo { get; set; } // קשר ל-Photo

        public ImageProcessingResult()
        {
            
        }

        public ImageProcessingResult(int id, int photoId, int userId, string originalImageUrl, string processedImageUrl, string caption, List<string> tags, List<string> detectedObjects, List<string> dominantColors, bool isFromFallback, DateTime processedAt)
        {
            Id = id;
            PhotoId = photoId;
            UserId = userId;
            OriginalImageUrl = originalImageUrl;
            ProcessedImageUrl = processedImageUrl;
            Caption = caption;
            Tags = tags;
            DetectedObjects = detectedObjects;
            DominantColors = dominantColors;
            IsFromFallback = isFromFallback;
            ProcessedAt = processedAt;
           
        }
    }
}
