
using Pictures.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pictures.Core.Repositories
{
    public interface IAlbumRepository
    {
        Task<IEnumerable<Album>> GetAllAlbumsAsync();
        Task<Album?> GetAlbumAsync(int id);
        Task<Album> CreateAlbumAsync(Album album);
        Task<Album> UpdateAlbumAsync(int id, Album album);
        Task DeleteAlbumAsync(int id);
    }
}
