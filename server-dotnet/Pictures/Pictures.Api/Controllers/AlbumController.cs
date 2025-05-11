using Amazon.S3;
using Amazon.S3.Model;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Pictures.Api.Models;
using Pictures.Core.DTOs;
using Pictures.Core.Models;
using Pictures.Core.Services;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using PutObjectRequest = Amazon.S3.Model.PutObjectRequest;

namespace Pictures.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlbumController : ControllerBase
    {
        private readonly IAlbumService _albumService;
        private readonly IMapper _mapper;
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;

        public AlbumController(IAlbumService albumService, IMapper mapper, IAmazonS3 s3Client, IConfiguration configuration)
        {
            _albumService = albumService;
            _mapper = mapper;
            _s3Client = s3Client;
            _bucketName = configuration["AWS:BucketName"];
        }


        // GET: api/album
        [HttpGet]
        public async Task<IEnumerable<AlbumDto>> Get()
        {
            var albums = await _albumService.GetAllAlbumsAsync();
            return _mapper.Map<IEnumerable<AlbumDto>>(albums);
            // הנח שה-albumDto כולל מידע על המשתמש שיצר את האלבום
            //var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value; // קבלת מזהה המשתמש הנוכחי

            //// הוספת לוגיקה לקבלת תיקיות מ-S3
            //var listRequest = new ListObjectsV2Request
            //{
            //    BucketName = _bucketName,
            //    Prefix = "", // אם אתה רוצה לקבל את כל התיקיות
            //    Delimiter = "/" // זה יפריד בין התיקיות לקבצים
            //};

            //var listResponse = await _s3Client.ListObjectsV2Async(listRequest);

            //// תיקון: שימוש ב-CommonPrefixes כדי לקבל את התיקיות
            //var folderNames = listResponse.CommonPrefixes.Select(p => p.TrimEnd('/'));

            //// סנן את התיקיות לפי המשתמש
            //var userFolders = folderNames.Where(folder => folder.StartsWith($"{userId}/"));

            //// הוספת רשימת התיקיות לאלבומים
            //var allAlbums = albumDtos.Concat(userFolders.Select(folder => new AlbumDto { Title = folder }));

            //return Ok(allAlbums);
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
        [HttpPost("album")]
        public async Task<ActionResult<AlbumDto>> Post([FromBody] AlbumPostModel albumPostModel)
        {
            if (albumPostModel == null)
                return BadRequest("Album cannot be null.");

            var album = _mapper.Map<Album>(albumPostModel);
            var createdAlbum = await _albumService.CreateAlbumAsync(album);
            var createdAlbumDto = _mapper.Map<AlbumDto>(createdAlbum);

            // הוספת לוגיקה ליצירת תיקיה ב-S3
            var albumFolder = $"{createdAlbumDto.Title}/"; // תיקיית האלבום
            var request = new PutObjectRequest
            {
                BucketName = _bucketName,
                Key = albumFolder,
                ContentBody = "", // תוכן ריק כדי ליצור את התיקיה
                ContentType = "application/x-directory" // סוג תוכן של תיקיה
            };

            try
            {
                await _s3Client.PutObjectAsync(request);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error creating album folder: {ex.Message}");
            }

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
