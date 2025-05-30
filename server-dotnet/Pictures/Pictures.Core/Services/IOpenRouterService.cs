public interface IOpenRouterService
{
    Task<string> GenerateTextAsync(string topic);
}