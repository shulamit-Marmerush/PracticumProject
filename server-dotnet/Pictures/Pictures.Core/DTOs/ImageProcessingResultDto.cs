using System;
using System.Collections.Generic;

namespace Pictures.Core.DTOs
{
    /// <summary>
    /// תוצאת עיבוד תמונה - DTO
    /// </summary>
    public class ImageProcessingResultDto
    {
        public int Id { get; set; }
        public int PhotoId { get; set; }
        public string OriginalImageUrl { get; set; }
        public string ProcessedImageUrl { get; set; }
        public string Caption { get; set; }
        public List<string> Tags { get; set; }
        public List<string> DetectedObjects { get; set; }
        public List<string> DominantColors { get; set; }
        public bool IsFromFallback { get; set; }
        public DateTime ProcessedAt { get; set; }
    }
}
