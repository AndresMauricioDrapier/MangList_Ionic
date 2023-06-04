import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Auth } from 'src/app/auth/interfaces/auth';
import { AuthResponse, AuthResponses } from 'src/app/auth/interfaces/responses';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly USERS_URL = 'users';
  constructor(private readonly http: HttpClient) {}

  userId = localStorage.getItem('user-id') || '';

  getUsers(): Observable<Auth[]> {
    return this.http.get<AuthResponses>(this.USERS_URL).pipe(
      map((r) => {
        return r.result;
      }),
      catchError((resp: HttpErrorResponse) => {
        return throwError(
          () =>
            `Error al obtener usuarios. Estado: ${resp.status}. Mensaje: ${resp.message}`
        );
      })
    );
  }

  getUser(id: string, me?: boolean): Observable<Auth> {
    if (me) {
      this.userId = localStorage.getItem('user-id') || '';
      return this.http
        .get<AuthResponse>(`${this.USERS_URL}/${this.userId}`)
        .pipe(
          map((r) => {
            return r.result;
          }),
          catchError((resp: HttpErrorResponse) =>
            throwError(
              () =>
                `Error al coger tu usuario desde me. Estado: ${resp.status}. Mensaje: ${resp.message}`
            )
          )
        );
    } else {
      return this.http.get<AuthResponse>(`${this.USERS_URL}/${id}`).pipe(
        map((r) => r.result),
        catchError((resp: HttpErrorResponse) =>
          throwError(
            () =>
              `Error al coger tu usuario desde id. Estado: ${resp.status}. Mensaje: ${resp.message}`
          )
        )
      );
    }
  }

  saveProfile(name: string, email: string): Observable<void> {
    return this.http.put<void>(this.USERS_URL + '/user/' + this.userId, {
      name,
      email,
    });
  }

  saveAvatar(
    avatar: string,
    name: string,
    avatarAntigua: string
  ): Observable<string> {
    return this.http.put<string>(this.USERS_URL + '/avatar/' + this.userId, {
      avatar,
      name,
      avatarAntigua,
    });
  }

  savePassword(
    firstPassword: string,
    secondPassword: string
  ): Observable<void> {
    return this.http.put<void>(this.USERS_URL + '/password/' + this.userId, {
      firstPassword,
      secondPassword,
    });
  }
  saveLastComicRead(idUser: number, lastComicRead: string): Observable<void> {
    return this.http.put<void>(this.USERS_URL + '/lastComicRead/' + idUser, {
      lastComicRead,
    });
  }

  addFavorites(idComic: string, idUser: number): Observable<void> {
    return this.http.put<void>(this.USERS_URL + '/favorites/' + idUser, {
      idComic,
    });
  }

  deleteFavorite(idComic: string, idUser: number): Observable<void> {
    return this.http.put<void>(this.USERS_URL + '/favorites/delete/' + idUser, {
      idComic,
    });
  }

  deleteUser(): Observable<void> {
    return this.http.delete<void>(this.USERS_URL + '/' + this.userId);
  }

  passwordRecovery(email: string): Observable<void> {
    return this.http.put<void>('users/password-recovery', {
      email: email,
    });
  }

  promoveToAdmin(idUser: number): Observable<void> {
    return this.http.put<void>(this.USERS_URL + '/promote/' + idUser, {});
  }

  removeAdmin(idUser: number): Observable<void> {
    return this.http.put<void>(this.USERS_URL + '/remove/' + idUser, {});
  }

  isLogged(): boolean {
    return localStorage.getItem('auth-token') ? true : false;
  }

  hasRoleToRead(): boolean {
    this.getUser(this.userId).subscribe((user) => {
      if (user.role == 'admin' || user.role == 'subscribed') {
        return true;
      }
      return false;
    });
    return false;
  }

  hasRoleToAdd(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.getUser(this.userId).subscribe((user) => {
        observer.next(user.role === 'admin');
        observer.complete();
      });
    });
  }
}
