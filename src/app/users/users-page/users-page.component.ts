import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from 'src/app/auth/interfaces/auth';
import { UsersService } from '../services/users.service';
import { UserCardComponent } from '../user-card/user-card.component';
import { AlertController, IonRefresher, IonicModule } from '@ionic/angular';
import { UsersFilterPipe } from '../pipes/users-filter.pipe';

@Component({
  selector: 'ml-users-page',
  standalone: true,
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss'],
  imports: [CommonModule, UserCardComponent, UsersFilterPipe, IonicModule],
})
export class UsersPageComponent implements OnInit {
  users!: Auth[];
  toSearch!: string;
  haveContent = false;

  userSearch = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly usersService: UsersService,
    private readonly router: Router,
    private readonly alertController: AlertController,
  ) {}

  ngOnInit(): void {
    this.usersService.getUsers().subscribe((users) => {
      this.users = users;
      this.userSearch = true;
      this.mainHaveContent();
    });

    this.route.queryParams.subscribe((params) => {
      this.toSearch = params['username'];
    });
  }

  search(search: any) {
    const toSearch = search.target.value;
    if (!toSearch.startsWith('@')) {
      this.router.navigate([''], {
        queryParams: { search: toSearch },
      });
    } else {
      this.router.navigate(['/users/all'], {
        queryParams: { username: toSearch.slice(1) },
      });
    }
  }

  reloadUsers(refresher: IonRefresher) {
    if (!this.userSearch) {
      this.usersService.getUsers().subscribe({
        next: (users) => {
          this.users = users;
          refresher.complete();
        },
        error: (e) => {
          this.alertController.create({
            header: 'Error al recoger los comics',
            message: e,
            buttons: ['Ok'],
          });
        },
      });
    }
  }

  mainHaveContent() {
    setTimeout(() => {
      const userCard = document.getElementsByTagName('ml-user-card');
      this.haveContent = userCard.length > 0 ? true : false;
    }, 1000);
  }

  @ViewChild('pageTop') pageTop: any;

  public pageScroller() {
    this.pageTop.scrollToTop();
  }
}
