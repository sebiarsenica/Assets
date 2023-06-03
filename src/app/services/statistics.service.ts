import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private url = "Statistics";

  constructor(private http: HttpClient) { }

  public getCounts():Observable<any>{
    return this.http.get<any>(environment.apiUrl + '/' + this.url +'/counts');
  }

  public getMonthsCount():Observable<any>{
    return this.http.get<any>(environment.apiUrl + '/' + this.url +'/months');
  }
}
