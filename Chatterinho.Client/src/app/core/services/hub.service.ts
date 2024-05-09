import { Injectable, effect } from '@angular/core';
import { lastValueFrom, of } from 'rxjs';
import { configuration } from '../../app.config';
import { ReceivedChatMessage } from '../models/chat.model';
import { NickService } from './nick.service';
import { ChatService } from './chat.service';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

@Injectable({
    providedIn: 'root'
})
export class HubService {
    hubConnection: HubConnection | null;
    failureCount: number;

    constructor(
        private _nickService: NickService,
        private _chatService: ChatService
    ) {
        effect(() => {
            const nick = this._nickService.nick();
            if (nick) {
                this.startConnection(nick);
            } else {
                this.stopConnection();
            }
        })
    }

    init(): void {
        this.failureCount = 0;
    }

    private startConnection(nick: string): void {
        this.hubConnection = new HubConnectionBuilder()
            .configureLogging(LogLevel.None)
            .withUrl(`${configuration.apiUrl}/hubs/notifications`, {
                accessTokenFactory: () => lastValueFrom(of(nick))
            })
            .build();

        this.hubConnection.start().then(() => {
            this.failureCount = 0;
        }).catch((_err: Error) => {
            setTimeout(() => {
                this.failureCount++;
                if (this.failureCount === 10) {
                    return;
                }

                this.hubConnection = null;
                this.startConnection(nick);
            }, 2500);
        });

        this.hubConnection.on('Chat', (message: ReceivedChatMessage) => {
            this._chatService.receiveChatMessage(message);
        });
    }

    private stopConnection(): void {
        if (this.hubConnection) {
            this.hubConnection.stop();
            this.hubConnection = null;
        }
    }
}
