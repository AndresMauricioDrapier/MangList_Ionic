import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { MatchValidator } from 'src/app/shared/validators/match.validator';
import { User } from '../interfaces/user.interface';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink, FormsModule, MatchValidator],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  user: User = {
    name: '',
    password: '',
    email: '',
    avatar: '',
    lat:0,
    lng:0
  };
  password2 = '';

  constructor(
    private authService: AuthService,
    private toast: ToastController,
    private nav: NavController
  ) { }

  ngOnInit() {
  }

  register() {
    this.authService.register(this.user).subscribe(
      async () => {
        (await this.toast.create({
          duration: 3000,
          position: 'bottom',
          message: 'User registered!'
        })).present();
        this.nav.navigateRoot(['/auth/login']);
      }
    );
  }

  async takePhoto() {;
    const photo = await Camera.getPhoto({
      source: CameraSource.Camera,
      quality: 90,
      height: 640,
      width: 640,
      allowEditing: true,
      resultType: CameraResultType.DataUrl // Base64 (url encoded)
    });

    this.user.avatar = photo.dataUrl as string;
  }

  async pickFromGallery() {
    const photo = await Camera.getPhoto({
      source: CameraSource.Photos,
      height: 640,
      width: 640,
      allowEditing: true,
      resultType: CameraResultType.DataUrl // Base64 (url encoded)
    });

    this.user.avatar = photo.dataUrl as string;
  }
}
