import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FeathericonComponent } from '../../feathericon/feathericon.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FeathericonComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  public show: boolean = false;

  constructor(private router: Router) {}

  open() {
    this.show = !this.show;
  }

  logOut() {
    localStorage.clear();
    this.router.navigate(['/login']).then(() => location.reload());
  }
}
