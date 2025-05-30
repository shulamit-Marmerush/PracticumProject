
using Microsoft.AspNetCore.Mvc;
using Pictures.Core.Models;

[ApiController]
[Route("api/[controller]")]
public class TextGeneratorController : ControllerBase
{
    private readonly IOpenRouterService _openRouterService;

    public TextGeneratorController(IOpenRouterService openRouterService)
    {
        _openRouterService = openRouterService;
    }

    [HttpPost("generate-description")]
    public async Task<IActionResult> GenerateDescription([FromBody] HuggingFaceRequest request)
    {
        try
        {
            var description = await _openRouterService.GenerateTextAsync(request.GeneratedText);
            return Ok(new { description });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"OpenRouter error: {ex.Message}");
        }
    }
}