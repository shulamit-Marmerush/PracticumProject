using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
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
    public class UserRepository:IUserRepository
    {
        private readonly DataContext _context;

        public UserRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _context.Users.FirstOrDefaultAsync(x => x.UserId == id);
        }
        
        public  async Task<User> AddAsync(User user)
        {
          await _context.Users.AddAsync(user);
            return user;
        }

        public async Task<User> UpdateAsync(int id,User user)
        {
             var existingUser = await GetByIdAsync(id);
            if (existingUser is null)
            {
                throw new Exception("User not found");
            }
            existingUser.UserName = user.UserName;
            existingUser.Email = user.Email;
            existingUser.Password = user.Password;
            existingUser.Phone = user.Phone;

            return existingUser;
        }

        public async Task DeleteAsync(int id)
        {
            var existingUser = await  GetByIdAsync(id);
            if (existingUser is not null)
            {
                _context.Users.Remove(existingUser);
            }
        }
        //public async Task<User> LoginAsync(UserLogin userLogin)
        //{
        //    var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == userLogin.Email && x.Password == userLogin.Password);
        //    if (user is null)
        //    {
        //        throw new Exception("User not found");
        //    }
        //    return user;
        //}
    }
}
