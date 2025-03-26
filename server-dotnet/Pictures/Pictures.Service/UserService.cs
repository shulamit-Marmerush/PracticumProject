
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
    public class UserService : IUserService

    {
        private readonly IManagerRepository _userRepository;

        public UserService(IManagerRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _userRepository.Users.GetAllAsync();
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _userRepository.Users.GetByIdAsync(id);
        }
        public async Task<User> AddAsync(User user)
        {
            var addedUser = await _userRepository.Users.AddAsync(user);
            await _userRepository.SaveAsync(); // הוסף await כאן
            return addedUser;
        }

        public async Task<User> UpdateAsync(int id, User user)
        {
            var updatedUser = await _userRepository.Users.UpdateAsync(id, user);
            await _userRepository.SaveAsync(); // הוסף await כאן
            return updatedUser;
        }

        public async Task DeleteAsync(int id)
        {
            await _userRepository.Users.DeleteAsync(id);
            await _userRepository.SaveAsync(); // הוסף await כאן
        }

        //public async Task<User> LoginAsync(UserLogin userLogin)
        //{
        //    var user = await _userRepository.Users.LoginAsync(userLogin);
        //    _userRepository.SaveAsync();
        //    return user;
        //}
    }
}

