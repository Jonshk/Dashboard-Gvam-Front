import { Component, inject, input, OnInit, output } from '@angular/core';
import { Group } from '../../../../../core/models/response/group.model';
import { RouterModule } from '@angular/router';
import { LoadingService } from '../../../../../core/services/loading/loading.service';
import { DeviceService } from '../../../../../core/services/device/device.service';
import { DeviceFilter } from '../../../../../core/enums/device-filter';
import { DEFAULT_PAGINATION } from '../../../../../shared/util/pagination';
import { Response } from '../../../../../core/models/response/response.model';
import { Device } from '../../../../../core/models/response/device.model';

@Component({
  selector: 'app-group-list-item',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './group-list-item.component.html',
  styleUrl: './group-list-item.component.scss',
})
export class GroupListItemComponent implements OnInit {
  readonly group = input.required<Group>();

  readonly onEditGroup = output<Group>();
  readonly onDeleteGroup = output<Group>();

  readonly loadingService = inject(LoadingService);
  private readonly deviceService = inject(DeviceService);

  numberOfDevices: number = 0;

  ngOnInit(): void {
    this.deviceService
      .list(this.group().groupId, DeviceFilter.ALL, '', DEFAULT_PAGINATION)
      .subscribe({
        next: ({ data }: Response<Device[]>) => {
          this.numberOfDevices = data.length;
        },
        error: (err: any) => {
          console.error('error:', err);
        },
      });
  }

  editGroup() {
    this.onEditGroup.emit(this.group());
  }

  deleteGroup() {
    this.onDeleteGroup.emit(this.group());
  }
}
