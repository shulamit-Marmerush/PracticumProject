using System.Collections.Generic;
using System.Threading.Tasks;

public interface IChatService
{
    Task<string> SendChatMessageAsync(List<(string role, string content)> messages);
}
