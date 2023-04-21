import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { role } from '../models/role';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private url = "Role";

  constructor(private http: HttpClient) { }

  public getRoles(userid : any): Observable<role[]>{
    return this.http.get<role[]>(`${environment.apiUrl}/${this.url}?userid=${userid}`);
  }
}
