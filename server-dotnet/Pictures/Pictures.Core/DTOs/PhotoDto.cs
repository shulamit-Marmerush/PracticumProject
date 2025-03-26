using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pictures.Core.DTOs
{
    public class PhotoDto
    {
        public int PhotoId { get; }
        public int AlbumId { get; set; }
        public int UserId { get; set; }
        public string Url { get; set; }
        public DateTime Created_at { get; set; }//תאריך יצירה של האלבום
        public DateTime Updated_at { get; set; }//תאריך עדכון אחרון

    }
}
