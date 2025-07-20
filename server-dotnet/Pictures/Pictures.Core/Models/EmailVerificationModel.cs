using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pictures.Core.Models
{
    public class EmailVerificationModel
    {
        public int Id { get; set; } // Primary key
        public string Email { get; set; }
        public string Code { get; set; }
        public int UserId { get; set; } // Foreign key
        public User User { get; set; }  // Navigation property to User
        public EmailVerificationModel() { }
        public EmailVerificationModel(int id, string email, string code, int userId)
        {
            Id = id;
            Email = email;
            Code = code;
            UserId = userId;
        }
    }


}
