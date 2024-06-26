import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [
        MatListModule,
        RouterLink,
        MatIconModule
    ],
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.scss'
})
export class MenuComponent {

}
