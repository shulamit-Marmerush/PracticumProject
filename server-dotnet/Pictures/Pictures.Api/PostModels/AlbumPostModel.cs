namespace Pictures.Api.Models
{
    public class AlbumPostModel
    {
        public string Title { get; set; } // שם האלבום
        public string Description { get; set; } // תיאור האלבום
        public int UserId { get; set; } // מזהה המשתמש
        public DateTime CreatedAt { get; set; } // תאריך יצירה של האלבום
        public DateTime UpdatedAt { get; set; } // תאריך עדכון אחרון
    }
}
