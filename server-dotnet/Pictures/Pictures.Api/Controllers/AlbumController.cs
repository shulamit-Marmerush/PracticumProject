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
    public class AlbumController : ControllerBase
    {
        private readonly IAlbumService _albumService;
        private readonly IMapper _mapper;

        public AlbumController(IAlbumService albumService, IMapper mapper)
        {
            _albumService = albumService;
            _mapper = mapper;
        }

        // GET: api/album
        [HttpGet]
        public async Task<IEnumerable<AlbumDto>> Get()
        {
            var albums = await _albumService.GetAllAlbumsAsync();
            return _mapper.Map<IEnumerable<AlbumDto>>(albums);
        }

        // GET api/album/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AlbumDto>> Get(int id)
        {
            var album = await _albumService.GetAlbumAsync(id);
            if (album == null)
                return NotFound();
            return _mapper.Map<AlbumDto>(album);
        }

        // POST api/album
        [HttpPost]
        public async Task<ActionResult<AlbumDto>> Post([FromBody] AlbumPostModel albumPostModel)
        {
            if (albumPostModel == null)
                return BadRequest("Album cannot be null.");

            var album = _mapper.Map<Album>(albumPostModel); // המרת AlbumPostModel ל-Album
            var createdAlbum = await _albumService.CreateAlbumAsync(album);
            var createdAlbumDto = _mapper.Map<AlbumDto>(createdAlbum); // המרת Album ל-AlbumDto

            return CreatedAtAction(nameof(Get), new { id = createdAlbumDto.AlbumId }, createdAlbumDto);
        }

        // PUT api/album/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] AlbumPostModel albumPostModel)
        {
            if (albumPostModel == null)
                return BadRequest("Album cannot be null.");

            var album = _mapper.Map<Album>(albumPostModel);

            var updatedAlbum = await _albumService.UpdateAlbumAsync(id, album);
            if (updatedAlbum == null)
                return NotFound();

            return NoContent();
        }

        // DELETE api/album/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _albumService.DeleteAlbumAsync(id);
            return NoContent();
        }
    }
}
