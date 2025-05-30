using System;
using System.Collections.Generic;

namespace Pictures.Core.DTOs
{
    /// <summary>
    /// תוצאת יצירת קולאז'
    /// </summary>
    public class CollageResultDto
    {
        public int CollageId { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public string ThumbnailUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsFromFallback { get; set; }
        public List<PhotoDto> Photos { get; set; }
    }
}
