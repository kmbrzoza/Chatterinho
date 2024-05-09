import { Injectable, signal } from '@angular/core';
import { configuration } from '../../app.config';
import { NewChatMessage, ReceivedChatMessage } from '../models/chat.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    messages = signal<ReceivedChatMessage[]>([]);

    constructor(private _http: HttpClient) { }

    sendChatMessage(chatMessage: NewChatMessage): Observable<void> {
        return this._http.post<void>(`${configuration.apiUrl}/chat/messages`, chatMessage);
    }

    receiveChatMessage(chatMessage: ReceivedChatMessage): void {
        this.messages.set([...this.messages(), chatMessage])
    }
}
