using Pictures.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pictures.Core.models
{
    public class Roles
    {
        public int Id { get; set; }
        public string RoleName { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<User> Users { get; set; } // משתמשים עם תפקיד זה
        public List<Permissions> Permissions { get; set; } // הרשאות הקשורות לתפקיד
        public Roles() { }

        public Roles(int id, string roleName, string description, DateTime createdAt, DateTime updatedAt)
        {
            Id = id;
            RoleName = roleName;
            Description = description;
            CreatedAt = createdAt;
            UpdatedAt = updatedAt;
          
        }
    }
}
