using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pictures.Core.Models
{
    public class Album
    {
        public int AlbumId { get; private set; }
        public int UserId { get;  set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime Created_at { get; set; } = DateTime.Now;//תאריך יצירה של האלבום
        public DateTime Updated_at { get; set; } = DateTime.Now;//תאריך עדכון אחרון
        public List<Photo>Photos { get; set; }
        public Album()
        {

        }

        public Album(int id, int userId, string title, string description, DateTime created_at, DateTime updated_at)
        {
            AlbumId = id;
            UserId = userId;
            Title = title;
            Description = description;
            Created_at = created_at;
            Updated_at = updated_at;
        }
    }
}
