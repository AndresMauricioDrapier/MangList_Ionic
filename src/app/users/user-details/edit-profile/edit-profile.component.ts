import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { User } from 'src/app/auth/interfaces/user.interface';

@Component({
  selector: 'fs-editProfile-form',
  standalone: true,
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
  imports: [IonicModule, FormsModule],
})
export class EditProfileComponent implements OnInit {
  user!: User;
  email2!: string;

  constructor(
    private modalCtrl: ModalController,
    public navParams: NavParams
  ) {}

  ngOnInit(): void {
    this.user = this.navParams.get('user');
    this.email2 = this.user.email;
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'Profile not edited');
  }

  confirm() {
    if (this.user.email == this.email2) {
      return this.modalCtrl.dismiss(
        { name: this.user.name, email: this.user.email },
        'confirm'
      );
    } else {
      return this.modalCtrl.dismiss('', 'Emails must be the same');
    }
  }
}
