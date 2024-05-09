using System;
using System.Threading.Tasks;
using Chatterinho.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Wetlab.Notifications.INotifiers;

namespace Chatterinho.Api.Controllers;

[ApiController]
public class ChatController(IChatHubNotifier _chatHubNotifier) : ControllerBase
{
    private readonly IChatHubNotifier _chatHubNotifier = _chatHubNotifier;

    [HttpPost("chat/messages")]
    public async Task<IActionResult> Post([FromBody] NewMessage message)
    {
        await _chatHubNotifier.NotifyAll(message.Nick, message.Message, DateTime.UtcNow);
        return Ok();
    }
}
