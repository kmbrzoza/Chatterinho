import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [
        MatToolbarModule,
        MatIconModule,
        RouterLink,
        MatButtonModule
    ],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
    @Input() isMobile: boolean | null;
    @Input() isMenuOpen: boolean | null;

    @Output() menuToggled = new EventEmitter<void>();

    menuToggle(): void {
        this.menuToggled.next();
    }
}
