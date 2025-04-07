import { Component, ElementRef, ViewChild } from '@angular/core';
import { ApplicationService } from '../../../core/services/application/application.service';
import { LoadingService } from '../../../core/services/loading/loading.service';
import { Response } from '../../../core/models/response/response.model';
import { CreateApplication } from '../../../core/models/response/create-application';

declare var gapi: any; // Google API

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [],
  templateUrl: './applications.page.html',
  styleUrl: './applications.page.scss',
})
export class ApplicationsPage {
  @ViewChild('application') application!: ElementRef<HTMLDivElement>;

  constructor(
    private applicationService: ApplicationService,
    private loadingService: LoadingService,
  ) {
    this.loadingService.setLoading();

    this.applicationService.createApplicationToken().subscribe({
      next: ({ data }: Response<CreateApplication>) => {
        this.loadingService.dismissLoading();
        gapi.load('gapi.iframes', () => {
          var options = {
            url: `https://play.google.com/work/embedded/search?token=${data.token}&iframehomepage=PRIVATE_APPS&mode=SELECT`,
            where: this.application.nativeElement,
            attributes: {
              style: 'width: 100%; height:700px',
              scrolling: 'yes',
            },
          };

          var iframe = gapi.iframes.getContext().openChild(options);
        });
      },
      error: (err: any) => {
        this.loadingService.dismissLoading();
        console.error('error:', err);
      },
    });
  }
}
