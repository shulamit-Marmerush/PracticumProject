
using Pictures.Core.models;
using Pictures.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pictures.Core.Services
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllAsync();

        Task<User?> GetByIdAsync(int id);

        Task<User> AddAsync(User user);

        Task<User> UpdateAsync(int id, User user);

        Task DeleteAsync(int id);

        //Task<User> LoginAsync(UserLogin userLogin);
    }
}
