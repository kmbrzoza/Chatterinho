import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SetNickComponent } from './set-nick/set-nick.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatIconModule } from '@angular/material/icon';
import { NickService } from '../../core/services/nick.service';
import { NewChatMessage, ChatMessageForm, ReceivedChatMessage } from '../../core/models/chat.model';
import { ControlsOf } from '../../../main';
import { ChatService } from '../../core/services/chat.service';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import { createClient, LiveClient, LiveTranscriptionEvents } from '@deepgram/sdk';
import { configuration } from '../../app.config';
import { Subject } from 'rxjs';

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
    microphone = signal<MediaRecorder | undefined>(undefined);

    private _dataFromMicrophone = new Subject<Blob>();
    private _connection: LiveClient;

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

        this._dataFromMicrophone.subscribe(data => {
            if (this._connection && this.microphone()) {
                this._connection.send(data);
            }
        })
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

    async microphoneClicked(): Promise<void> {
        if (!this.microphone()) {
            try {
                this.microphone.set(await this.getMicrophone());
                this.initDeepgram();
                await this.openMicrophone(this.microphone() as MediaRecorder);
            } catch (error) {
                console.error("error opening microphone:", error);
            }
        } else {
            await this.closeMicrophone(this.microphone() as MediaRecorder);
            this.microphone.set(undefined);
            this._connection.finish();
        }
    }

    private initDeepgram(): void {
        const deepgram = createClient(configuration.deepgramApiKey);

        this._connection = deepgram.listen.live({
            model: "nova-2",
            language: "pl",
            smart_format: true
        });

        this._connection.on(LiveTranscriptionEvents.Open, () => {
            this._connection.on(LiveTranscriptionEvents.Close, () => {
                console.log("Connection closed.");
                this.closeMicrophone(this.microphone());
                this.microphone.set(undefined);
            });

            this._connection.on(LiveTranscriptionEvents.Transcript, (data) => {
                console.log(data);
                if (data.channel.alternatives[0].transcript && data.is_final === true) {
                    const prefix = this.form.controls.message.value ? this.form.controls.message.value + ' ' : '';
                    this.form.controls.message.setValue(prefix + data.channel.alternatives[0].transcript);
                }
            });

            this._connection.on(LiveTranscriptionEvents.Metadata, (data) => {
                console.log(data);
            });

            this._connection.on(LiveTranscriptionEvents.Error, (err) => {
                console.error(err);
            });
        });
    }

    private async getMicrophone(): Promise<MediaRecorder> {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            return new MediaRecorder(stream, { mimeType: "audio/webm" });
        } catch (error) {
            throw error;
        }
    }

    private async openMicrophone(microphone: MediaRecorder) {
        return new Promise((resolve) => {
            microphone.onstart = () => {
                console.log("client: microphone opened");
                resolve(undefined);
            };

            microphone.onstop = () => {
                console.log("client: microphone closed");
            };

            microphone.ondataavailable = (event) => {
                console.log("client: microphone data received");
                if (event.data.size > 0 && this.microphone()) {
                    this._dataFromMicrophone.next(event.data);
                }
            };

            microphone.start(1000);
        });
    }

    async closeMicrophone(microphone: MediaRecorder | undefined) {
        if (microphone) {
            microphone.stop();
        }
    }
}
