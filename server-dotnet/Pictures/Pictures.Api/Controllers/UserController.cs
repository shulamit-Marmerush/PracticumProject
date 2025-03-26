
//using AutoMapper;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using Pictures.Api.Models;
//using Pictures.Core.DTOs;
//using Pictures.Core.models;
//using Pictures.Core.Models;
//using Pictures.Core.Services;
//using static System.Reflection.Metadata.BlobBuilder;

//// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

//namespace Pictures.Api.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class UserController : ControllerBase
//    {
//        private readonly IUserService _userService;
//        private readonly IMapper _mapper;
//        public UserController(IUserService userService, IMapper mapper)
//        {
//            _userService = userService;
//            _mapper = mapper;

//        }
//        [Authorize]
//        // GET: api/<UserController>
//        [HttpGet]
//        public ActionResult Get()
//        {
//            var users = _userService.GetAllAsync();
//            var usersDto = _mapper.Map<IEnumerable<UserDto>>(users);

//            return Ok(usersDto);
//        }

//        // GET api/<UserController>/5
//        [HttpGet("{id}")]
//        public ActionResult Get(int id)
//        {
//            var user = _userService.GetByIdAsync(id);
//            var userDto = _mapper.Map<UserDto>(user);
//            return Ok(userDto);

//        }

//        // POST api/<UserController>
//        [HttpPost("register")]
//        public ActionResult Post([FromBody] UserPostModel user)
//        {
//            var newUser = new User { UserName = user.UserName, Email = user.Email, Phone = user.Phone, Password = user.Password };
//            _userService.AddAsync(newUser);

//            return Ok(newUser);
//        }
//        // PUT api/<UserController>/5
//        [HttpPut("{id}")]
//        public ActionResult Put(int id, [FromBody] UserPostModel user)
//        {
//            var updatedUser = new User { UserId = id, UserName = user.UserName, Email = user.Email, Phone = user.Phone, Password = user.Password };
//            _userService.UpdateAsync(id, updatedUser);
//            return Ok(updatedUser);

//        }

//        // DELETE api/<UserController>/5
//        [HttpDelete("{id}")]
//        public ActionResult Delete(int id)
//        {
//            _userService.DeleteAsync(id);
//            return Ok();
//        }


//    }
//}
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pictures.Api.Models;
using Pictures.Core.DTOs;
using Pictures.Core.Models;
using Pictures.Core.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pictures.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public UserController(IUserService userService, IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }

        //[Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> Get()
        {
            var users = await _userService.GetAllAsync();
            var usersDto = _mapper.Map<IEnumerable<UserDto>>(users);
            return Ok(usersDto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> Get(int id)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            var userDto = _mapper.Map<UserDto>(user);
            return Ok(userDto);
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Post([FromBody] UserPostModel user)
        {
            var newUser = new User
            {
                UserName = user.UserName,
                Email = user.Email,
                Phone = user.Phone,
                Password = user.Password
            };

            await _userService.AddAsync(newUser);

            var newUserDto = _mapper.Map<UserDto>(newUser); // מיפוי ל-DTO
            return CreatedAtAction(nameof(Get), new { id = newUser.UserId }, newUserDto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> Put(int id, [FromBody] UserPostModel user)
        {
            var updatedUser = new User
            {
                UserId = id,
                UserName = user.UserName,
                Email = user.Email,
                Phone = user.Phone,
                Password = user.Password
            };

            await _userService.UpdateAsync(id, updatedUser);
            return Ok(updatedUser);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            await _userService.DeleteAsync(id);
            return NoContent(); // מחזיר 204 No Content
        }
    }
}
