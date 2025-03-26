using Pictures.Core.Repositories;
using System.Threading.Tasks;

namespace Pictures.Data.Repositories
{
    public class ManagerRepository : IManagerRepository
    {
        private readonly DataContext _context;

        public IUserRepository Users { get; }
        public IAlbumRepository Albums { get; }
        public IPhotoRepository Photos { get; }

        public ManagerRepository(DataContext context, IUserRepository userRepository, IAlbumRepository albums, IPhotoRepository photos)
        {
            _context = context;
            Users = userRepository;
            Albums = albums;
            Photos = photos;
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
