import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComicCardComponent } from '../comics/comic-card/comic-card.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Comic } from '../comics/interfaces/comics';
import { Auth } from '../auth/interfaces/auth';
import { UsersService } from './services/users.service';
import { ComicsService } from '../comics/services/comics.service';
import { AlertController, IonicModule } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { validateEmail } from '../shared/validators/emailValidator';
import { validatePassword } from '../shared/validators/passwordValidator';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ml-users',
  standalone: true,
  imports: [CommonModule, ComicCardComponent, IonicModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  comics: Comic[] = [];
  userId: string = localStorage.getItem('user-id') || '';
  isMe!: boolean;
  haveRoleToAddComic!: boolean;

  newAvatar: string = '';
  isModalAvatarOpen = false;

  user: Auth = {
    email: '',
    avatar: '',
  };

  public alertButtons = [
    {
      text: 'Guardar',
      role: true,
    },
    {
      text: 'Cerrar',
      role: false,
    },
  ];
  public alertProfileInputs = [
    {
      type: 'text',
      placeholder: 'Nombre',
    },
    {
      type: 'email',
      placeholder: 'Email',
    },
  ];

  public alertAvatarInputs = [
    {
      type: 'image',
      placeholder: 'Avatar',
    },
  ];

  public alertPasswordInputs = [
    {
      type: 'password',
      placeholder: 'Contraseña',
    },
    {
      type: 'password',
      placeholder: 'Repita la contraseña',
    },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UsersService,
    private readonly comicService: ComicsService,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((user) => {
      if (user['user']) {
        this.user = user['user'];
        this.makeAtInit();
      } else {
        this.userService.getUser('0', true).subscribe((u) => {
          this.user = u;
          this.makeAtInit();
        });
      }
    });
  }

  makeAtInit(): void {
    this.userService.hasRoleToAdd().subscribe((bool) => {
      this.haveRoleToAddComic = bool;
    });
    this.isMe = this.userId === this.user._id?.toString();

    this.user.favorites != undefined
      ? this.user.favorites.forEach((idComic) => {
          this.comicService.getIdComic(idComic.toString()).subscribe({
            next: (comic) => {
              this.comics.push(comic);
            },
          });
        })
      : null;
  }

  async saveUser(profile: any): Promise<void> {
    if (profile.detail.role) {
      let user =
        profile.detail.data.values[0] !== ''
          ? profile.detail.data.values[0]
          : this.user.name!;
      let email =
        profile.detail.data.values[1] !== ''
          ? profile.detail.data.values[1]
          : this.user.email!;
      if (validateEmail(email)) {
        this.userService.saveProfile(user, email).subscribe({
          next: async () => {
            const alert = await this.alertController.create({
              header: '¡Perfil editado!',
              message: 'El perfil se ha editado correctamente.',
              buttons: ['Aceptar'],
            });
            await alert.present();
            this.router.navigate(['/users', this.userId]);
          },
          error: async (err) => {
            const alert = await this.alertController.create({
              header: '¡Usuario descartado!',
              message: 'El perfil se ha descartado.',
              buttons: ['Aceptar'],
            });
            await alert.present();
            this.router.navigate(['/users', this.userId]);
          },
        });
      } else {
        const alert = await this.alertController.create({
          header: '¡Email incorrecto!',
          message: 'El email no es correcto.',
          buttons: ['Aceptar'],
        });
        await alert.present();
      }
    }
  }

  async savePassword(password: any): Promise<void> {
    let pass1 = password.detail.data.values[0];
    let pass2 = password.detail.data.values[1];
    if (validatePassword(pass1)) {
      if (password.detail.role && pass1 === pass2) {
        this.userService
          .savePassword(
            password.detail.data.values[0],
            password.detail.data.values[1]
          )
          .subscribe({
            next: async () => {
              const alert = await this.alertController.create({
                header: '¡Contraseña editada!',
                message: 'la contraseña ha sido editada con exito.',
                buttons: ['Aceptar'],
              });
              await alert.present();
              this.router.navigate(['/users/', this.userId]);
            },
            error: async (err) => {
              const alert = await this.alertController.create({
                header: '¡Cancelado!',
                message: 'la contraseña no ha podido cambiarse.',
                buttons: ['Aceptar'],
              });
              await alert.present();
              this.router.navigate(['/users', this.userId]);
            },
          });
      } else {
        const alert = await this.alertController.create({
          header: '¡Cancelado!',
          message: 'La contraseña no se ha cambiado.',
          buttons: ['Aceptar'],
        });
        await alert.present();
      }
    }
  }

  async saveAvatar(): Promise<void> {
    if (this.newAvatar) {
      this.userService
        .saveAvatar(this.newAvatar, this.user.name!, this.user.avatar!)
        .subscribe({
          next: async () => {
            const alert = await this.alertController.create({
              header: '¡Avatar guardado!',
              message: 'El avatar se ha editado correctamente.',
              buttons: ['Aceptar'],
            });
            this.isModalAvatarOpen = false;
            await alert.present();
            this.router.navigate(['/users', this.userId]);
          },
          error: async (err) => {
            console.log(err);
            const alert = await this.alertController.create({
              header: '¡Cancelado!',
              message: 'El avatar no ha podido cambiarse.',
              buttons: ['Aceptar'],
            });
            this.isModalAvatarOpen = false;
            await alert.present();
            this.router.navigate(['/users', this.userId]);
          },
        });
    } else {
      const alert = await this.alertController.create({
        header: '¡Cancelado!',
        message: 'El avatar no se ha cambiado.',
        buttons: ['Aceptar'],
      });
      this.isModalAvatarOpen = false;
      await alert.present();
    }
  }

  goToAddComic(): void {
    this.router.navigate(['/comics/add']);
  }

  async takePhoto() {
    const photo = await Camera.getPhoto({
      source: CameraSource.Camera,
      quality: 90,
      height: 640,
      width: 640,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
    });

    this.newAvatar = photo.dataUrl as string;
  }

  async pickFromGallery() {
    const photo = await Camera.getPhoto({
      source: CameraSource.Photos,
      height: 640,
      width: 640,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
    });

    this.newAvatar = photo.dataUrl as string;
  }
}
