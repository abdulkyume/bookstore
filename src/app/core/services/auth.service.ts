import { Injectable } from '@angular/core';
import { Auth } from '../models/auth';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, timeout } from 'rxjs';
import Swal from 'sweetalert2';
import * as bcrypt from 'bcrypt-ts';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUser!: Observable<any>;
  isLoggedIn: boolean = false;
  baseUrl: string = 'https://652246b8f43b179384145a3c.mockapi.io/';

  constructor(private http: HttpClient, private router: Router) { }

  signin(user: Auth): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}users`, user).pipe(
      map((res: any) => {
        if (res && res.id) {
          localStorage.setItem('currentUser', JSON.stringify(res));
          localStorage.setItem('userName', user.email.toString());
          Swal.fire('Success!', 'Signin Success');
          this.router.navigate(["/dashboard"])
        }
        return res;
      }),
      catchError((err) => {
        if (err.name === 'TimeoutError') {
          Swal.fire('Time Out!!', 'Internal Server Problem');
        }
        if (
          err.message === "Cannot read properties of null (reading 'message')"
        ) {
          Swal.fire(
            'Error!!',
            'Resource Not Available. Link is Not Working',
            'error'
          );
        }
        if (err === 'Bad Request') {
          Swal.fire('Error!!', 'Form Submission Error');
        }
        if (err === 'Unknown Error') {
          Swal.fire('Error!!', 'No Connection Found');
        }
        throw err;
      })
    );
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['signin']);
  }
}
