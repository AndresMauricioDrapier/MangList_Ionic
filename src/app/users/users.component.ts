import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComicCardComponent } from '../comics/comic-card/comic-card.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Comic } from '../comics/interfaces/comics';
import { Auth } from '../auth/interfaces/auth';
import { UsersService } from './services/users.service';
import { ComicsService } from '../comics/services/comics.service';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { validateEmail } from '../shared/validators/emailValidator';
import { validatePassword } from '../shared/validators/passwordValidator';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/services/auth.service';

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

  lastComic: Comic = {
    title: '',
    main_picture: {
      medium: '',
      large: '',
    },
  };

  user: Auth = {
    email: '',
    avatar: '',
  };
  userWatching: Auth = {
    email: '',
    avatar: '',
    role:"user"
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
    private readonly authService: AuthService,
    private toast: ToastController,
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
    console.log(this.user);

    this.user.favorites != undefined
      ? this.user.favorites.forEach((idComic) => {
          this.comicService.getIdComic(idComic.toString()).subscribe({
            next: (comic) => {
              this.comics.push(comic);
            },
          });
        })
      : null;

    this.comicService.getIdComic(this.user.lastComicRead!).subscribe({
      next: (comic) => {
        this.lastComic = comic;
      },
      error: (err) => {
        console.error(err);
      },
    });

    this.userService.getUser(this.userId).subscribe((user) => {
      this.userWatching = user;
  });
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

  async alertDeleteUser() {
    if(this.user._id?.toString() === this.userId || this.user.role=="admin"){
      const alert = await this.alertController.create({
        header: 'Borrar el usuario',
        message: '¿Estas seguro que quieres borrar el usuario?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: async () => {
              const alert = await this.alertController.create({
                header: '¡Cancelado!',
                message: 'El usuario no se ha borrado.',
                buttons: ['Aceptar'],
              });
              await alert.present();
            },
          },
          {
            text: 'Borrar',
            handler: () => {
              this.userService.deleteUser().subscribe({
                next: async () => {
                  (
                    await this.toast.create({
                      duration: 3000,
                      position: 'bottom',
                      message: '¡Usuario borrado correctamente!',
                    })
                  ).present();
                  this.authService.logout();
                },
                error: async (err) => {
                  const alert = await this.alertController.create({
                    header: '¡El usuario no se ha podido borrar!',
                    message: err,
                    buttons: ['Aceptar'],
                  });
                  await alert.present();
                },
              });
            },
          },
        ],
      });

      await alert.present();
    }
    else{
      const alert = await this.alertController.create({
        header: 'No se puede borrar el usuario',
        message: "El usuario que intentas borrar no es tu usuario o no tienes el rol requerido",
        buttons: ['Aceptar'],
      });
      await alert.present();
    }

  }

  promoveToAdmin(): void {
    this.userService.promoveToAdmin(this.user._id!).subscribe({
      next: async () => {
        (
          await this.toast.create({
            duration: 3000,
            position: 'bottom',
            message: '¡Usuario promovido a ADMINISTRADOR!',
          })
        ).present();
        this.router.navigate(["/users", this.userId]);
      },
      error: async () => {
        const alert = await this.alertController.create({
          header: 'Usuario no se ha promovido correctamente',
          message: "Error promoviendo el usuario",
          buttons: ['Ok'],
        });
        await alert.present();
      },
    });
  }

  removeAdmin(): void {
    this.userService.removeAdmin(this.user._id!).subscribe({
      next: async () => {
        (
          await this.toast.create({
            duration: 3000,
            position: 'bottom',
            message: '¡Se ha removido el rol del usuario a USER!',
          })
        ).present();
        this.router.navigate(["/users", this.userId]);
      },
      error: async () => {
        const alert = await this.alertController.create({
          header: 'Rol del usuario no se ha removido correctamente',
          message: "Error removiendo el rol del usuario",
          buttons: ['Ok'],
        });
        await alert.present();
      }
    });
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
