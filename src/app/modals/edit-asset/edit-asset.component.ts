import { Component, OnInit } from '@angular/core';
import { asset } from 'src/app/models/asset';
import { assetDto } from 'src/app/models/assetDto';
import { AssetService } from 'src/app/services/asset.service';

@Component({
  selector: 'app-edit-asset',
  templateUrl: './edit-asset.component.html',
  styleUrls: ['./edit-asset.component.css']
})
export class EditAssetComponent implements OnInit {
  selectedAssets : any[] = [];
  currentAsset : asset = new asset();
 

  constructor(private assetService: AssetService) { }

  ngOnInit(): void {
    this.selectedAssets = history.state.assets;
    this.currentAsset = this.selectedAssets[0];
   
  }

  editAsset():void{
    console.log(this.currentAsset);
    
  this.assetService.editAsset(this.currentAsset).subscribe(
    (response)=>{
      console.log(response);
    }, 
    (error)=>{
      console.log(error);
    }
  );
  }

 

}
