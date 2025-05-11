using Pictures.Core.models;
using Pictures.Core.Models;
using Pictures.Core.Repositories;
using Pictures.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pictures.Service
{

    public class AlbumService : IAlbumService
    {
        private readonly IManagerRepository _managerRepository;

        public AlbumService(IManagerRepository managerRepository)
        {
            _managerRepository = managerRepository;
        }

        public async Task<IEnumerable<Album>> GetAllAlbumsAsync()
        {
            return await _managerRepository.Albums.GetAllAlbumsAsync();
        }

        public async Task<Album?> GetAlbumAsync(int id)
        {
            return await _managerRepository.Albums.GetAlbumAsync(id);
        }

        public async Task<Album> CreateAlbumAsync(Album album)
        {
            var createdAlbum = await _managerRepository.Albums.CreateAlbumAsync(album);
            await _managerRepository.SaveAsync();
            return createdAlbum;
        }

        public async Task<Album> UpdateAlbumAsync(int id, Album album)
        {
            var updatedAlbum = await _managerRepository.Albums.UpdateAlbumAsync(id, album);
            await _managerRepository.SaveAsync();
            return updatedAlbum;
        }

        public async Task DeleteAlbumAsync(int id)
        {
            await _managerRepository.Albums.DeleteAlbumAsync(id);
            await _managerRepository.SaveAsync();
        }
    }


}
