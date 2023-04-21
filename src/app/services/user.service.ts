import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { UserDto } from '../models/userDto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = "User"
  
  constructor(private http: HttpClient) { }

  public getUsers(): Observable<User[]>{
    return this.http.get<User[]>(environment.apiUrl+'/'+this.url+'/getAll');
  }

  public getUserByUserName(username: string): Observable<User>{
    return this.http.get<User>(environment.apiUrl+'/'+this.url+'/'+username);
  }

  public registerUser(user: UserDto): Observable<User[]>{
    return this.http.post<User[]>(environment.apiUrl+'/'+this.url+'/register', user);
  }

  public loginUser(user: UserDto): Observable<string> {
    return this.http.post<string>(environment.apiUrl + '/' + this.url + '/login', user);
  }

  public deleteUser(id : number):Observable<User[]>{ 
    return this.http.delete<User[]>(environment.apiUrl + '/' + this.url + '/'+id);
  }

  public editUser(user: UserDto, id: any):Observable<boolean>{
    return this.http.put<boolean>(environment.apiUrl+'/'+this.url+'/'+id, user);
  }
  
}
