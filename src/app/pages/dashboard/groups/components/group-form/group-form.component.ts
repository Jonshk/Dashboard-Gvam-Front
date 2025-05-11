import { Component, effect, inject, input, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CreateGroup } from '../../../../../core/models/request/create-group.model';
import { GroupService } from '../../../../../core/services/group/group.service';
import { Group } from '../../../../../core/models/response/group.model';
import { Response } from '../../../../../core/models/response/response.model';
import { LoadingService } from '../../../../../core/services/loading/loading.service';

@Component({
  selector: 'app-group-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './group-form.component.html',
  styleUrl: './group-form.component.scss',
})
export class GroupFormComponent {
  readonly editGroup = input<Group | null>(null);
  readonly isVisible = input.required<boolean>();

  readonly group = output<Group>();

  private groupService = inject(GroupService);
  readonly loadingService = inject(LoadingService);

  groupForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  private setGroupForm = effect(() => {
    this.resetForm();
    if (this.editGroup()) {
      this.groupForm.controls.name.setValue(this.editGroup()!.groupName);
    }
  });

  private resetForm() {
    this.groupForm.reset({ name: '' });
  }

  private resetOnHide = effect(() => {
    if (!this.isVisible()) {
      this.resetForm();
    }
  });

  onSubmit() {
    if (this.groupForm.invalid) return;

    this.loadingService.setLoading();

    const group: CreateGroup = {
      groupName: this.groupForm.value.name!,
    };

    if (this.editGroup()) {
      this.editCurrentGroup(group);
      return;
    }

    this.createGroup(group);
  }

  private createGroup(newGroup: CreateGroup) {
    this.groupService.create(newGroup).subscribe({
      next: ({ data }: Response<Group>) => {
        this.group.emit(data);
        this.resetForm();
        this.loadingService.dismissLoading();
      },
      error: (err: any) => {
        console.error('error:', err);
        this.loadingService.dismissLoading();
      },
    });
  }

  private editCurrentGroup(editedGroup: CreateGroup) {
    this.group.emit({
      groupId: this.editGroup()!.groupId,
      groupName: editedGroup.groupName,
    });
    this.groupService.update(this.editGroup()!.groupId, editedGroup).subscribe({
      next: ({ data }: Response<Group>) => {
        this.group.emit(data);
        this.loadingService.dismissLoading();
      },
      error: (err: any) => {
        console.error('error:', err);
        this.loadingService.dismissLoading();
      },
    });
  }
}
