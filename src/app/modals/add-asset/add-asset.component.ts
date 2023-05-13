import { Component, OnInit } from '@angular/core';
import { assetDto } from 'src/app/models/assetDto';
import { AssetService } from 'src/app/services/asset.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-add-asset',
  templateUrl: './add-asset.component.html',
  styleUrls: ['./add-asset.component.css']
})
export class AddAssetComponent implements OnInit {
  currentUsername : string = "";
  assetToAdd : assetDto = new assetDto;
  categories: string[] = ['Computers','Phones','Writing and Printing'];

  constructor(private assetService: AssetService, private authService : AuthServiceService) { }

  ngOnInit(): void {
    this.currentUsername = this.authService.getUserNameFromCookie();
    console.log(this.currentUsername);
    
  }

  addAsset():void{
   this.assetToAdd.addedBy = this.currentUsername;
   this.assetService.addAsset(this.assetToAdd).subscribe(
    (response)=>{
      console.log(response);
    }, 
    (error)=>{
      console.log(error);
    }
   );

  }

  fileChange(event: any){
    const fileList: FileList = event.target.files; 
    if(fileList.length >0)
      {
        const file: File = fileList[0];
        const reader: FileReader = new FileReader(); 
        reader.onload = (e : any) => {
          const arrayBuffer: ArrayBuffer = e.target.result; 
          const byteArray: Uint8Array = new Uint8Array(arrayBuffer);
          const numberArray: number[] = Array.from(byteArray);
          const chunkSize = 0x8000;
      let result = '';
for (let i = 0; i < numberArray.length; i += chunkSize) {
    const subArray = numberArray.slice(i, i + chunkSize);
    result += String.fromCharCode.apply(null, subArray);
}
const base64String: string = btoa(result);

          this.assetToAdd.image=base64String;
        }
        reader.readAsArrayBuffer(file)
      }
  }

}
