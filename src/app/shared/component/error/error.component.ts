import { Component, inject } from '@angular/core';
import { ErrorService } from '../../../core/services/error/error.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
    selector: 'app-error',
    imports: [DialogComponent],
    templateUrl: './error.component.html',
    styleUrl: './error.component.scss'
})
export class ErrorComponent {
  readonly errorService = inject(ErrorService);
}
