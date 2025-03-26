using AutoMapper;
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
    public class PhotoController : ControllerBase
    {
        private readonly IPhotoService _photoService;
        private readonly IMapper _mapper;

        public PhotoController(IPhotoService photoService, IMapper mapper)
        {
            _photoService = photoService;
            _mapper = mapper;
        }

        // GET: api/photo
        [HttpGet]
        public async Task<IEnumerable<PhotoDto>> Get()
        {
            var photos = await _photoService.GetAllPhotosAsync();
            return _mapper.Map<IEnumerable<PhotoDto>>(photos);
        }

        // GET api/photo/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PhotoDto>> Get(int id)
        {
            var photo = await _photoService.GetPhotoAsync(id);
            if (photo == null)
                return NotFound();
            return _mapper.Map<PhotoDto>(photo);
        }

        // POST api/photo
        [HttpPost]
        public async Task<ActionResult<PhotoDto>> Post([FromBody] PhotoPostModel photoPostModel)
        {
            if (photoPostModel == null)
                return BadRequest("Photo cannot be null.");

            var photo = _mapper.Map<Photo>(photoPostModel); // המרת PhotoPostModel ל-Photo
            var createdPhoto = await _photoService.CreatePhotoAsync(photo);
            var createdPhotoDto = _mapper.Map<PhotoDto>(createdPhoto); // המרת Photo ל-PhotoDto

            return CreatedAtAction(nameof(Get), new { id = createdPhotoDto.PhotoId }, createdPhotoDto);
        }

        // PUT api/photo/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] PhotoPostModel photoPostModel)
        {
            if (photoPostModel == null)
                return BadRequest("Photo cannot be null.");

            var photo = _mapper.Map<Photo>(photoPostModel); // המרת PhotoPostModel ל-Photo

            var updatedPhoto = await _photoService.UpdatePhotoAsync(id, photo);
            if (updatedPhoto == null)
                return NotFound();

            return NoContent();
        }

        // DELETE api/photo/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _photoService.DeletePhotoAsync(id);
            return NoContent();
        }
    }
}
