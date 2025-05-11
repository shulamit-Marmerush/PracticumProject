using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pictures.Core.Repositories
{
    public interface IManagerRepository
    {
        IUserRepository Users { get; }
        IAlbumRepository Albums { get; }
        IPhotoRepository Photos { get; }

        Task SaveAsync();
    }
}
