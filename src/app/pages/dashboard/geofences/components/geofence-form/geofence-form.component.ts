import { Component, effect, inject, input, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoadingService } from '../../../../../core/services/loading/loading.service';
import { GeofenceService } from '../../../../../core/services/geofence/geofence.service';
import { Geofence } from '../../../../../core/models/response/geofence.model';
import { Response } from '../../../../../core/models/response/response.model';
import { CreateGeofence } from '../../../../../core/models/request/create-geofence.model';

@Component({
  selector: 'app-geofence-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './geofence-form.component.html',
  styleUrl: './geofence-form.component.scss',
})
export class GeofenceFormComponent {
  groupId = input.required<number>();
  readonly isVisible = input.required<boolean>();
  editGeofence = input<Geofence | null>();

  private geofenceService = inject(GeofenceService);
  readonly loadingService = inject(LoadingService);

  geofence = output<Geofence>();

  geofenceForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    latitude: new FormControl(0, [
      Validators.required,
      Validators.min(-90),
      Validators.max(90),
    ]),
    longitude: new FormControl(0, [
      Validators.required,
      Validators.min(-180),
      Validators.max(180),
    ]),
    radius: new FormControl(0, [Validators.required, Validators.min(0.1)]),
  });

  private setGeofenceForm = effect(() => {
    this.resetForm();
    if (this.editGeofence()) {
      this.geofenceForm.controls.name.setValue(
        this.editGeofence()!.geofenceName,
      );
      this.geofenceForm.controls.latitude.setValue(
        this.editGeofence()!.latitude,
      );
      this.geofenceForm.controls.longitude.setValue(
        this.editGeofence()!.longitude,
      );
      this.geofenceForm.controls.radius.setValue(this.editGeofence()!.radius);
    }
  });

  private resetForm() {
    this.geofenceForm.reset({ name: '', latitude: 0, longitude: 0, radius: 0 });
  }

  private resetOnHide = effect(() => {
    if (!this.isVisible()) {
      this.resetForm();
    }
  });

  onSubmit() {
    if (this.geofenceForm.invalid) return;

    this.loadingService.setLoading();

    const geofence: CreateGeofence = {
      name: this.geofenceForm.value.name!,
      latitude: this.geofenceForm.value.latitude!,
      longitude: this.geofenceForm.value.longitude!,
      radius: this.geofenceForm.value.radius!,
    };

    if (this.editGeofence()) {
      this.editCurrentGeofence(geofence);
      return;
    }

    this.createGeofence(geofence);
  }

  private createGeofence(newGeofence: CreateGeofence) {
    this.geofenceService.create(this.groupId(), newGeofence).subscribe({
      next: ({ data }: Response<Geofence>) => {
        this.geofence.emit(data);
        this.resetForm();
        this.loadingService.dismissLoading();
      },
      error: (err: any) => {
        console.error('error:', err);
        this.loadingService.dismissLoading();
      },
    });
  }

  private editCurrentGeofence(editGeofence: CreateGeofence) {
    this.geofenceService
      .update(this.groupId(), this.editGeofence()!.geofenceId, editGeofence)
      .subscribe({
        next: ({ data }: Response<Geofence>) => {
          this.geofence.emit(data);
          this.loadingService.dismissLoading();
        },
        error: (err: any) => {
          console.error('error:', err);
          this.loadingService.dismissLoading();
        },
      });
  }
}
