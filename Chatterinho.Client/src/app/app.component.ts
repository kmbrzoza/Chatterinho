import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map, tap, shareReplay, BehaviorSubject, Observable } from 'rxjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NavbarComponent } from './basic/navbar/navbar.component';
import { MenuComponent } from './basic/menu/menu.component';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { HubService } from './core/services/hub.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        MatSidenavModule,
        NavbarComponent,
        MenuComponent,
        SpinnerComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    isMobile$ = this._observer.observe(['(max-width: 768px)']).pipe(
        map(res => res.matches),
        tap(isMobile => this._isMenuOpen$.next(!isMobile)),
        shareReplay({ refCount: true, bufferSize: 1 })
    );

    private _isMenuOpen$ = new BehaviorSubject<boolean>(false);

    get isMenuOpen$(): Observable<boolean> {
        return this._isMenuOpen$.asObservable();
    }

    constructor(
        private _observer: BreakpointObserver,
        private _hubService: HubService
    ) {
        this._hubService.init();
    }

    menuToggle(): void {
        this._isMenuOpen$.next(!this._isMenuOpen$.value);
    }

    onSidenavClose(): void {
        this._isMenuOpen$.next(false);
    }
}
