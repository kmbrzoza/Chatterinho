import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SetNickForm } from '../../../core/models/chat.model';
import { ControlsOf } from '../../../../main';
import { MatInputModule } from '@angular/material/input';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';

@Component({
    selector: 'app-set-nick',
    standalone: true,
    imports: [
        MatButtonModule,
        MatDialogModule,
        MatInputModule,
        ReactiveFormsModule,
        ErrorMessageComponent
    ],
    templateUrl: './set-nick.component.html'
})
export class SetNickComponent implements OnInit {
    form: FormGroup;

    constructor(
        private _dialogRef: MatDialogRef<SetNickComponent>,
        private _fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.form = this._fb.group<ControlsOf<SetNickForm>>({
            nick: this._fb.nonNullable.control('', [Validators.required])
        });
    }

    confirm(): void {
        if (this.form.valid) {
            this._dialogRef.close(this.form.value.nick as string);
        } else {
            this.form.markAllAsTouched();
        }
    }
}
