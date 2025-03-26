using Microsoft.EntityFrameworkCore;
using Pictures.Core.models;
using Pictures.Core.Models;
using Pictures.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pictures.Data.Repositories
{
    public class AlbumRepository : IAlbumRepository
    {
        private readonly DataContext _context;

        public AlbumRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Album>> GetAllAlbumsAsync()
        {
            return await _context.Albums.ToListAsync();
        }

        public async Task<Album?> GetAlbumAsync(int id)
        {
            return await _context.Albums.FirstOrDefaultAsync(x => x.AlbumId == id);
        }

        public async Task<Album> CreateAlbumAsync(Album album)
        {
            await _context.Albums.AddAsync(album);
            return album;
        }

        public async Task<Album> UpdateAlbumAsync(int id, Album album)
        {
            var existingAlbum = await GetAlbumAsync(id);
            if (existingAlbum is null)
            {
                throw new Exception("Album not found");
            }
            existingAlbum.Title = album.Title;
            existingAlbum.Description = album.Description;
            existingAlbum.Created_at = album.Created_at;
            existingAlbum.Updated_at = album.Updated_at;

            return existingAlbum;
        }

        public async Task DeleteAlbumAsync(int id)
        {
            var existingAlbum = await GetAlbumAsync(id);
            if (existingAlbum is not null)
            {
                _context.Albums.Remove(existingAlbum);
            }
        }
    }

}

