import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class NickService {
    nick = signal<string | null>(null);

    setNick(nick: string | null): void {
        this.nick.set(nick);
    }
}
