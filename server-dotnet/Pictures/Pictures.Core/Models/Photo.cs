using System;
using static Pictures.Core.Models.Collage;

namespace Pictures.Core.Models
{
    public class Photo
    {
        public int PhotoId { get; private set; }
        public int AlbumId { get; set; }
        public int UserId { get; set; }
        public string Url { get; set; }
        public string Title { get; set; } // שם התמונה
        public DateTime CreatedAt { get; set; }  // תאריך יצירה של התמונה
        public DateTime UpdatedAt { get; set; } // תאריך עדכון אחרון


        // קשרים
        public Album Album { get; set; }
        public List<CollagePhoto> CollagePhotos { get; set; } = new List<CollagePhoto>();
        public ImageProcessingResult ImageProcessingResult { get; set; }

        public Photo() { }

        public Photo(int id, int albumId, int userId, string url, string title, DateTime createdAt, DateTime updatedAt)
        {
            PhotoId = id;
            AlbumId = albumId;
            UserId = userId;
            Url = url;
            Title = title;
            CreatedAt = createdAt;
            UpdatedAt = updatedAt;
        }
    }
}
