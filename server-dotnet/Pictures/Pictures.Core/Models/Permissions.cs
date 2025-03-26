using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pictures.Core.models
{
    public class Permissions
    {
        public int Id { get; set; }
        public string PermissionName { get; set; }
        public string Description { get; set; }
        public List<Roles> Roles { get; set; }

        public Permissions()
        {

        }

        public Permissions(int id, string permissionName, string description)
        {
            Id = id;
            PermissionName = permissionName;
            Description = description;
          
        }
    }
}
