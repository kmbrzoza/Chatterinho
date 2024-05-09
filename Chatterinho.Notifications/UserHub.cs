using Microsoft.AspNetCore.SignalR;

namespace Chatterinho.Notifications;

public class UserHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, "ChatUsers");
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, "ChatUsers");
        await base.OnDisconnectedAsync(exception);
    }
}