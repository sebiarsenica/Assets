import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'; 
import { Observable } from 'rxjs';
import { asset } from '../models/asset';
import { environment } from 'src/environments/environment';
import { assetDto } from '../models/assetDto';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private url = "Assets";
  
  constructor(private http: HttpClient) { }

  public getAll():Observable<asset[]>{
    return this.http.get<asset[]>(environment.apiUrl+'/'+this.url);
  }

  public addAsset(asset: assetDto):Observable<string>{
    return this.http.post<string>(environment.apiUrl+'/'+this.url, asset);
  }

  public editAsset(asset: asset):Observable<string>{
    return this.http.put<string>(environment.apiUrl+'/'+this.url, asset);
  }

  public deleteAsset(id: number):Observable<asset[]>{
    return this.http.delete<asset[]>(environment.apiUrl+'/'+this.url+'/'+id);
  }
}
