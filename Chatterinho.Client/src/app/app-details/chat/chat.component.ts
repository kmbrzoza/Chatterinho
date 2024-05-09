import { Component, OnInit, WritableSignal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SetNickComponent } from './set-nick/set-nick.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatIconModule } from '@angular/material/icon';
import { NickService } from '../../core/services/nick.service';
import { NewChatMessage, ChatMessageForm, ReceivedChatMessage } from '../../core/models/chat.model';
import { ControlsOf } from '../../../main';
import { ChatService } from '../../core/services/chat.service';
import { ChatMessageComponent } from './chat-message/chat-message.component';

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [
        MatDividerModule,
        MatCardModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        TextFieldModule,
        MatIconModule,
        ChatMessageComponent
    ],
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
    nick: WritableSignal<string | null>;
    form: FormGroup<ControlsOf<ChatMessageForm>>;
    messages: WritableSignal<ReceivedChatMessage[]>;

    constructor(
        private _dialog: MatDialog,
        private _nickService: NickService,
        private _fb: FormBuilder,
        private _chatService: ChatService
    ) { }

    ngOnInit(): void {
        this.nick = this._nickService.nick;
        this.messages = this._chatService.messages;

        this.form = this._fb.group<ControlsOf<ChatMessageForm>>({
            message: this._fb.nonNullable.control('')
        });

        this._dialog.open(SetNickComponent, {
            width: '450px',
        }).afterClosed().subscribe(result => {
            if (typeof result !== 'string') {
                window.location.href = window.location.href;
            } else {
                this._nickService.setNick(result);
            }
        });
    }

    sendMessage(): void {
        const newMessage = {
            message: this.form.value.message,
            nick: this.nick()
        };

        if (newMessage.message) {
            this.form.reset();

            this._chatService.sendChatMessage(newMessage as NewChatMessage)
                .subscribe();
        }
    }
}
