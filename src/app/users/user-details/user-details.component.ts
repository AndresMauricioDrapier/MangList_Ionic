import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { User } from "../interfaces/user";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { UserService } from "../services/user-service.service";
import { AlertController, IonicModule, ModalController } from "@ionic/angular";
import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { EditPasswordComponent } from "./edit-password/edit-password.component";
import { EditAvatarComponent } from "./edit-avatar/edit-avatar.component";

@Component({
    selector: "fs-user-details",
    standalone: true,
    imports: [CommonModule, RouterLink,IonicModule],
    templateUrl: "./user-details.component.html",
    styleUrls: ["./user-details.component.css"],
})
export class UserDetailsComponent implements OnInit {


  user!: User;


  constructor(
    private readonly route: ActivatedRoute,
    private readonly userServices: UserService,
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private readonly router: Router,
  ) {}

  async makeAlert(message: string){
    const alert = await this.alertController.create({
      header: message,
      buttons: ['OK'],
    });
    await alert.present();
  }


    ngOnInit(): void {
        this.route.data.subscribe((data) => {
            if (data["user"]) {
                this.user = data["user"];
            } else {
                this.userServices.getUser().subscribe((data) => {
                    this.user = data;
                });
            }
        });
    }
    async openModalPerfil() {
      const modal = await this.modalCtrl.create({
        component: EditProfileComponent,
        componentProps: {user: this.user},
      });
      modal.present();

      const { data, role } = await modal.onWillDismiss();

      if (role === 'confirm') {
        try{
          this.userServices.saveProfile(data.name, data.email).subscribe();
          this.makeAlert('Profile updated!');
        }catch (e) {
          this.makeAlert('Error: '+ e);
        }
      } else {
        this.makeAlert(role!);
      }
    }

    async openModalPassword() {
      const modal = await this.modalCtrl.create({
        component: EditPasswordComponent,
        componentProps: {user: this.user},
      });
      modal.present();

      const { data, role } = await modal.onWillDismiss();

      if (role === 'confirm') {
        try{
          this.userServices.savePassword(data.password).subscribe();
          this.makeAlert('Password updated!');
        }catch (e) {
          this.makeAlert('Error: '+ e);
        }
      } else {
        this.makeAlert(role!);
      }
    }

    async openModalAvatar() {
      const modal = await this.modalCtrl.create({
        component: EditAvatarComponent,
        componentProps: {user: this.user},
      });
      modal.present();

      const { data, role } = await modal.onWillDismiss();

      if (role === 'confirm') {
        try{
          this.userServices.saveAvatar(data.avatar).subscribe();
          this.makeAlert('Avatar updated!');
        }catch (e) {
          this.makeAlert('Error: '+ e);
        }
      } else {
        this.makeAlert(role!);
        this.router.navigate(['/users',this.user.id]);
      }
    }
}
