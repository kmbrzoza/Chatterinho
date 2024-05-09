import { Component, Input } from '@angular/core';
import { ReceivedChatMessage } from '../../../core/models/chat.model';
import { DatePipe, NgClass } from '@angular/common';

@Component({
    selector: 'app-chat-message',
    standalone: true,
    imports: [
        DatePipe,
        NgClass
    ],
    templateUrl: './chat-message.component.html',
    styleUrl: './chat-message.component.scss'
})
export class ChatMessageComponent {
    @Input() isCurrentUser: boolean;
    @Input() chatMessage: ReceivedChatMessage;
}
