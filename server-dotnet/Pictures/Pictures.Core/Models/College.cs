using System;
using System.Collections.Generic;

namespace Pictures.Core.Models
{
    /// <summary>
    /// מודל המייצג קולאז' תמונות
    /// </summary>
    public class Collage
    {
        public int CollageId { get; set; }
        public int UserId { get; set; }
        public int? AlbumId { get; set; } // שים לב שזה nullable כי לא כל קולאז' חייב להיות משויך לאלבום
        public string Name { get; set; }
        public string Url { get; set; }
        public string ThumbnailUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // הגדרות הקולאז'
        public int Width { get; set; } = 1200;
        public int Height { get; set; } = 800;
        public string BackgroundColor { get; set; } = "#FFFFFF";
        public string Layout { get; set; } = "auto";
        public string Theme { get; set; }
        public int Padding { get; set; } = 10;
        public bool AllowRotation { get; set; } = true;
        public bool AddShadow { get; set; } = true;
        public bool AddBorder { get; set; } = false;
        public string BorderColor { get; set; } = "#000000";
        public int BorderWidth { get; set; } = 2;

        // קשרים
        public List<CollagePhoto> CollagePhotos { get; set; } = new List<CollagePhoto>();
        public User User { get; set; }
        public Album Album { get; set; }

        public Collage()
        {
            
        }

        public Collage(int collageId, int userId, int? albumId, string name, string url, string thumbnailUrl, DateTime createdAt, int width, int height, string backgroundColor, string layout, string theme, int padding, bool allowRotation, bool addShadow, bool addBorder, string borderColor, int borderWidth)
        {
            CollageId = collageId;
            UserId = userId;
            AlbumId = albumId;
            Name = name;
            Url = url;
            ThumbnailUrl = thumbnailUrl;
            CreatedAt = createdAt;
            Width = width;
            Height = height;
            BackgroundColor = backgroundColor;
            Layout = layout;
            Theme = theme;
            Padding = padding;
            AllowRotation = allowRotation;
            AddShadow = addShadow;
            AddBorder = addBorder;
            BorderColor = borderColor;
            BorderWidth = borderWidth;
          
        }
    }
}