import { Pipe, PipeTransform } from '@angular/core';
import { Auth } from 'src/app/auth/interfaces/auth';

@Pipe({
  name: 'usersFilter',
  standalone: true,
})
export class UsersFilterPipe implements PipeTransform {
  transform(users: Auth[], name: string): Auth[] {
    if (name && users) {
      const filteredUserRankings: Auth[] = [];

      users.forEach((userRanking) => {
        if (userRanking.name!.toLowerCase().includes(name.toLowerCase())) {
          filteredUserRankings.push(userRanking);
        }
      });

      return filteredUserRankings;
    } else {
      return users;
    }
  }
}
