import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from './shared/component/loader/loader.component';
import { TapToTopComponent } from './shared/component/tap-to-top/tap-to-top.component';
import { ContentComponent } from './shared/component/layout/content/content.component';
import { ErrorComponent } from './shared/component/error/error.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    LoaderComponent,
    TapToTopComponent,
    ContentComponent,
    ErrorComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
