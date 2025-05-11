using Pictures.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pictures.Core.Services
{
    public interface IPhotoService
    {
        Task<IEnumerable<Photo>> GetAllPhotosAsync();
        Task<Photo?> GetPhotoAsync(int id);
        Task<Photo> CreatePhotoAsync(Photo photo);
        Task<Photo> UpdatePhotoAsync(int id, Photo photo);
        Task DeletePhotoAsync(int id);
    }
}
