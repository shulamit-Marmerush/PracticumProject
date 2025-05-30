using System.Collections.Generic;

namespace Pictures.Core.DTOs
{
    /// <summary>
    /// בקשה ליצירת קולאז'
    /// </summary>
    public class CollageRequestDto
    {
        public List<int> PhotoIds { get; set; }
        public CollageSettingsDto Settings { get; set; }
        public bool UseFallback { get; set; } = true;
    }

    /// <summary>
    /// הגדרות קולאז'
    /// </summary>
    public class CollageSettingsDto
    {
        public string Name { get; set; } = "New Collage";
        public int Width { get; set; } = 1200;
        public int Height { get; set; } = 800;
        public string BackgroundColor { get; set; } = "#FFFFFF";
        public string Layout { get; set; } = "auto";
        public string Theme { get; set; } = "";
        public int Padding { get; set; } = 10;
        public bool AllowRotation { get; set; } = true;
        public bool AddShadow { get; set; } = true;
        public bool AddBorder { get; set; } = false;
        public string BorderColor { get; set; } = "#000000";
        public int BorderWidth { get; set; } = 2;
    }
}
