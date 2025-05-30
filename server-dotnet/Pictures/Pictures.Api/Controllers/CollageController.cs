using Microsoft.AspNetCore.Mvc;
using Pictures.Core.DTOs;
using Pictures.Core.Services;
using System;
using System.Threading.Tasks;

namespace Pictures.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CollageController : ControllerBase
    {
        private readonly ICollageService _collageService;

        public CollageController(ICollageService collageService)
        {
            _collageService = collageService;
        }

        [HttpPost("create")]
        public async Task<ActionResult<CollageResultDto>> CreateCollage([FromBody] CollageRequestDto request)
        {
            try
            {
                // כאן צריך לקבל את מזהה המשתמש מהטוקן
                int userId = 1; // לצורך הדוגמה

                var result = await _collageService.CreateCollageAsync(request, userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error creating collage", message = ex.Message });
            }
        }

        [HttpPost("theme-suggestions")]
        public async Task<ActionResult<AIThemeResponseDto>> GetThemeSuggestions([FromBody] AIThemeRequestDto request)
        {
            try
            {
                var result = await _collageService.GetThemeSuggestionsAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error getting theme suggestions", message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CollageResultDto>> GetCollage(int id)
        {
            try
            {
                var result = await _collageService.GetCollageAsync(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error getting collage", message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCollage(int id)
        {
            try
            {
                await _collageService.DeleteCollageAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error deleting collage", message = ex.Message });
            }
        }
    }
}
