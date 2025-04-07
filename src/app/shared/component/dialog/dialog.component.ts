import { Component, model } from '@angular/core';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  readonly open = model.required<boolean>();

  onDismiss() {
    this.open.set(false);
  }
}
