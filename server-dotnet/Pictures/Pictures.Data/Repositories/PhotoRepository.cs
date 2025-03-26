using Microsoft.EntityFrameworkCore;
using Pictures.Core.Models;
using Pictures.Core.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pictures.Data.Repositories
{
    public class PhotoRepository : IPhotoRepository
    {
        private readonly DataContext _context;

        public PhotoRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Photo>> GetAllPhotosAsync()
        {
            return await _context.Photos.ToListAsync();
        }

        public async Task<Photo?> GetPhotoAsync(int id)
        {
            return await _context.Photos.FirstOrDefaultAsync(x => x.PhotoId == id);
        }

        public async Task<Photo> CreatePhotoAsync(Photo photo)
        {
            await _context.Photos.AddAsync(photo);
            return photo;
        }

        public async Task<Photo> UpdatePhotoAsync(int id, Photo photo)
        {
            var existingPhoto = await GetPhotoAsync(id);
            if (existingPhoto is null)
            {
                throw new Exception("Photo not found");
            }
            existingPhoto.AlbumId = photo.AlbumId;
            existingPhoto.UserId = photo.UserId;
            existingPhoto.Url = photo.Url;
            existingPhoto.Title = photo.Title;
            existingPhoto.CreatedAt = photo.CreatedAt;
            existingPhoto.UpdatedAt = photo.UpdatedAt;
            return existingPhoto;
        }

        public async Task DeletePhotoAsync(int id)
        {
            var existingPhoto = await GetPhotoAsync(id);
            if (existingPhoto is not null)
            {
                _context.Photos.Remove(existingPhoto);
            }
        }
    }
}
