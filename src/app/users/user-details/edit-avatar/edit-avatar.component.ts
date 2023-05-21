import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { User } from 'src/app/auth/interfaces/user.interface';

@Component({
  selector: 'fs-editAvatar-form',
  standalone: true,
  templateUrl: './edit-avatar.component.html',
  styleUrls: ['./edit-avatar.component.scss'],
  imports: [IonicModule, FormsModule],
})
export class EditAvatarComponent implements OnInit{
  user!: User;

  constructor(
    private modalCtrl: ModalController,
    public navParams: NavParams
  ) {}

  ngOnInit(): void {
    this.user = this.navParams.get('user');
  }

  async takePhoto() {
    const photo = await Camera.getPhoto({
      source: CameraSource.Camera,
      quality: 90,
      height: 640,
      width: 640,
      resultType: CameraResultType.DataUrl,
    });

    this.user.avatar = photo.dataUrl as string;
  }

  async pickFromGallery() {
    const photo = await Camera.getPhoto({
      source: CameraSource.Photos,
      height: 640,
      width: 640,
      resultType: CameraResultType.DataUrl,
    });

    this.user.avatar = photo.dataUrl as string;
  }

  cancelButton() {
    return this.modalCtrl.dismiss(null, 'Avatar not edited');
  }

  confirmButton() {
    return this.modalCtrl.dismiss({ avatar: this.user.avatar }, 'confirm');
  }
}
