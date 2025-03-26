using Pictures.Core.Models;
using System.ComponentModel.DataAnnotations;

namespace Pictures.Api.Models
{
    public class PhotoPostModel
    {
        public int AlbumId { get; set; }
        public int UserId { get; set; }
        public string Url { get; set; }
        public string Title { get; set; }
        public DateTime CreatedAt { get; set; }  // תאריך יצירה של התמונה
        public DateTime UpdatedAt { get; set; }// שם התמונה

    }
}
