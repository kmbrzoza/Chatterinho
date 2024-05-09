namespace Wetlab.Notifications.INotifiers;

public interface IChatHubNotifier
{
    Task NotifyAll(string nick, string message, DateTime date);
}
