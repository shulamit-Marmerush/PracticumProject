using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly IChatService _chatService;

    public ChatController(IChatService chatService)
    {
        _chatService = chatService;
    }

    public class ChatMessage
    {
        public string Role { get; set; } // "user" / "assistant" / "system"
        public string Content { get; set; }
    }

    public class ChatRequest
    {
        public List<ChatMessage> Messages { get; set; }
    }

    public class ChatResponse
    {
        public string Reply { get; set; }
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendMessage([FromBody] ChatRequest request)
    {
        if (request.Messages == null || request.Messages.Count == 0)
            return BadRequest("Chat messages are required.");

        var history = request.Messages.Select(m => (m.Role, m.Content)).ToList();

        try
        {
            var reply = await _chatService.SendChatMessageAsync(history);
            return Ok(new ChatResponse { Reply = reply });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"OpenRouter error: {ex.Message}");
        }
    }
}
