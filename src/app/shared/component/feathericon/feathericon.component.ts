import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import * as feather from 'feather-icons';

@Component({
    selector: 'app-feathericon',
    imports: [CommonModule],
    templateUrl: './feathericon.component.html',
    styleUrls: ['./feathericon.component.scss']
})
export class FeathericonComponent {

  @Input('icon') public icon: string | undefined;

  ngAfterViewInit() {
    feather.replace();
  }

}
