import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from 'src/app/auth/interfaces/auth';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'ml-user-card',
  standalone: true,
  imports: [CommonModule, RouterModule, IonicModule],
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent {
  @Input() user!: Auth;
}
