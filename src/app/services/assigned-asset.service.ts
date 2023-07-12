import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { assignedAsset } from '../models/assignedAsset';
import { assignedAssetDTO } from '../models/assignedAssetDTO';

@Injectable({
  providedIn: 'root'
})
export class AssignedAssetService {
  private url = "AssignedAsset";

  constructor(private http: HttpClient) { 
   }

  public getAll():Observable<assignedAsset[]>{
    return this.http.get<assignedAsset[]>(environment.apiUrl+'/'+this.url);
  }

  public addRequest(asset :assignedAssetDTO):Observable<string>{
    return this.http.post<string>(environment.apiUrl+'/'+this.url+'/request',asset);
  }

  public editRequest(asset: assignedAsset):Observable<assignedAsset>{
    return this.http.put<assignedAsset>(environment.apiUrl+'/'+this.url+'/editRequest',asset);
  }

  public deleteAssignAsset(id: number):Observable<string>{
    return this.http.delete<string>(environment.apiUrl + '/'+this.url+'/'+id)
  }

  public changeStatusToRejected(id: number): Observable<string> {
    return this.http.put<string>(environment.apiUrl + '/' + this.url + '/' + id, {});
  }
  
}
