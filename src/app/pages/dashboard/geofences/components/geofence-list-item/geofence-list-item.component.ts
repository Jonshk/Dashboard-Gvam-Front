import { Component, inject, input, output } from '@angular/core';
import { Geofence } from '../../../../../core/models/response/geofence.model';
import { LoadingService } from '../../../../../core/services/loading/loading.service';

@Component({
  selector: 'app-geofence-list-item',
  standalone: true,
  imports: [],
  templateUrl: './geofence-list-item.component.html',
  styleUrl: './geofence-list-item.component.scss',
})
export class GeofenceListItemComponent {
  readonly geofence = input.required<Geofence>();

  readonly onEditGeofence = output<Geofence>();
  readonly onDeleteGeofence = output<Geofence>();

  readonly loadingService = inject(LoadingService);

  editGeofence() {
    this.onEditGeofence.emit(this.geofence());
  }
  deleteGeofence() {
    this.onDeleteGeofence.emit(this.geofence());
  }
}
