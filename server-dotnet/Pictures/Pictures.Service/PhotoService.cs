using Pictures.Core.Models;
using Pictures.Core.Repositories;
using Pictures.Core.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pictures.Service
{
    public class PhotoService : IPhotoService
    {
        private readonly IManagerRepository _photoRepository;

        public PhotoService(IManagerRepository photoRepository)
        {
            _photoRepository = photoRepository;
        }

        public async Task<IEnumerable<Photo>> GetAllPhotosAsync()
        {
            return await _photoRepository.Photos.GetAllPhotosAsync();
        }

        public async Task<Photo?> GetPhotoAsync(int id)
        {
            return await _photoRepository.Photos.GetPhotoAsync(id);
        }

        public async Task<Photo> CreatePhotoAsync(Photo photo)
        {
            var createdPhoto = await _photoRepository.Photos.CreatePhotoAsync(photo);
            await _photoRepository.SaveAsync();
            return createdPhoto;
        }

        public async Task<Photo> UpdatePhotoAsync(int id, Photo photo)
        {
            var updatedPhoto = await _photoRepository.Photos.UpdatePhotoAsync(id, photo);
            await _photoRepository.SaveAsync();
            return updatedPhoto;
        }

        public async Task DeletePhotoAsync(int id)
        {
            await _photoRepository.Photos.DeletePhotoAsync(id);
            await _photoRepository.SaveAsync();
        }
    }
}
