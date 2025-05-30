using System.Collections.Generic;

namespace Pictures.Core.DTOs
{
    /// <summary>
    /// בקשה להצעות נושאים לקולאז' מה-AI
    /// </summary>
    public class AIThemeRequestDto
    {
        public int ImageCount { get; set; }
        public List<string> ImageNames { get; set; }
        public List<string> Tags { get; set; }
        public bool UseFallback { get; set; } = true;
    }
}
