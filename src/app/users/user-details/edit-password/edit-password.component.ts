import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'fs-editPassword-form',
  standalone: true,
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.scss'],
  imports: [IonicModule, FormsModule],
})
export class EditPasswordComponent{
  password!: string;
  password2!: string;

  constructor(
    private modalCtrl: ModalController,
    public navParams: NavParams
  ) {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'Password not edited');
  }

  confirm() {
    if (this.password === this.password2) {
      return this.modalCtrl.dismiss(
        { password: this.password },
        'confirm'
      );
    } else {
      return this.modalCtrl.dismiss('', 'Password must be the same');
    }
  }
}
