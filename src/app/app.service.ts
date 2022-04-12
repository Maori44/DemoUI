import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService implements OnInit {

  private userLoggedIn = new Subject<boolean>();
  
  constructor(private http: HttpClient) {
    this.userLoggedIn.next(false);
  }

  ngOnInit() {}

  getData() {
    return this.http.get('https://localhost:5001/api/Domain');
  }

  addData(model) {
    return this.http.post('https://localhost:5001/api/Domain', model);
  }

  removeData(id) {
    return this.http.delete('https://localhost:5001/api/Domain/' +id);
  }

  setUserLoggedIn(userLoggedIn: boolean) {
    this.userLoggedIn.next(userLoggedIn);
  }

  getUserLoggedIn(): Observable<boolean> {
    return this.userLoggedIn.asObservable();
  }
}
