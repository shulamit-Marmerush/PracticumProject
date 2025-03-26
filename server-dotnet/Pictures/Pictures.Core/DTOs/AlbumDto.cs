using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pictures.Core.DTOs
{
    public class AlbumDto
    {

        public int AlbumId { get; set; } // מזהה האלבום
        public int UserId { get; set; } // מזהה המשתמש
        public string Title { get; set; } // שם האלבום
        public string Description { get; set; } // תיאור האלבום
        public DateTime CreatedAt { get; set; } // תאריך יצירה של האלבום
        public DateTime UpdatedAt { get; set; } // תאריך עדכון אחרון


    }
}
