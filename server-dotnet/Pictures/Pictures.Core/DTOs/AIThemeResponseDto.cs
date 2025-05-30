using System.Collections.Generic;

namespace Pictures.Core.DTOs
{
    /// <summary>
    /// תשובה עם הצעות נושאים לקולאז' מה-AI
    /// </summary>
    public class AIThemeResponseDto
    {
        public List<ThemeSuggestionDto> Suggestions { get; set; } = new List<ThemeSuggestionDto>();
        public bool IsFromFallback { get; set; }
    }

    /// <summary>
    /// הצעת נושא לקולאז'
    /// </summary>
    public class ThemeSuggestionDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Layout { get; set; }
        public string Theme { get; set; }
        public string BackgroundColor { get; set; }
    }
}
