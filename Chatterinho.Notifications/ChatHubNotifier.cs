using Microsoft.AspNetCore.SignalR;
using Wetlab.Notifications.INotifiers;

namespace Chatterinho.Notifications;

public class ChatHubNotifier(IHubContext<UserHub> _hubContext) : IChatHubNotifier
{
    private readonly IHubContext<UserHub> _hubContext = _hubContext;

    public async Task NotifyAll(string nick, string message, DateTime date) =>
        await _hubContext.Clients.All
            .SendAsync("Chat", new ChatMessage(nick, message, date));
}
