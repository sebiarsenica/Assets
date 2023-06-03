import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NavigationExtras, Router } from '@angular/router';
import { asset } from 'src/app/models/asset';
import { assignedAssetDTO } from 'src/app/models/assignedAssetDTO';
import { User } from 'src/app/models/user';
import { AssetService } from 'src/app/services/asset.service';
import { AssignedAssetService } from 'src/app/services/assigned-asset.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.css']
})
export class AssetsComponent implements OnInit {
  currentUser: User = new User();

  assets: any[] = [];
  unsortedAssets: any[] = [];
  selectedAssets: asset[] = [];
  imageDataUrl: SafeUrl | undefined;

  selectedAddedBy: string = "";
  addedByList: string[] = [];
  selectedCategory: string = "";
  categoryList: string[] = [];

  page: number = 1; 
  pageSize: number = 5;

  sortOrderId : string = ""; 
  sortOrderName: string = ""; 
  sortOrderSKU: string = ""; 
  sortOrderCategory: string = ""; 
  sortOrderQuantity: string = "";
  sortOrderAddedby: string = "";

  searchString: string = "";

  isLoaded: boolean = false;

  requestButtonText : string = "Request ";
  requestButtonClass: string = "fa-solid fa-code-pull-request";

  constructor(private assetService : AssetService, public sanitizer: DomSanitizer, private router: Router, private authService: AuthServiceService,
    private assignAssetService : AssignedAssetService) { }

  ngOnInit(): void {
    this.showLoadingAlert();
    this.getAllAssets();
    this.currentUser = this.authService.user;
  }

  onRequestButtonHover()
  {
    this.requestButtonClass = "fa-solid fa-code-pull-request fa-beat";
  }

  onRequestButtonLeave()
  {
    this.requestButtonClass = "fa-solid fa-code-pull-request";
  }

  getAllAssets(): void{
   this.assetService.getAll().subscribe(
    (response)=>{ 
      console.log(response);
      this.assets = response; 
      this.unsortedAssets = response;
      this.populateFilters();
      this.imageDataUrl = this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,' + this.assets[0].image);
      Swal.close();
    },
    (error)=>{
      console.log(error);
    }
   )
  }

  showLoadingAlert() {
    Swal.fire({
      title: 'Loading...',
      html: '',
      customClass: {
        container: 'sweet-container',
        popup: 'sweet-popup',
        title: 'sweet-title',
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      showCancelButton: false,
    });
    
  }

  addAsset():void{
    this.router.navigate(['/addAsset']);
  }

  async editAsset(){
   // let navigationsExtras: NavigationExtras = { 
     // state: { 
       // assets: this.selectedAssets
      //}
    //};
    //this.router.navigate(['/editAsset'], navigationsExtras);
    const quantity = this.selectedAssets[0].quantity; 
    const name = this.selectedAssets[0].name;
    const { value: formValue } = await Swal.fire({
      title: 'Edit Asset',
      html:
        '<label for="swal-input1" class="form-label">Name</label>' +
        '<input id="swal-input1" class="form-control">' +
        '<label for="swal-input2" class="form-label">Quantity</label>' +
        '<input type="number" id="swal-input2" class="form-control">',
      focusConfirm: false,
      didOpen: () => {
        const nameInput = document.getElementById('swal-input1') as HTMLInputElement;
        const quantityInput = document.getElementById('swal-input2') as HTMLInputElement;
  
        nameInput.value = name!;
        quantityInput.value = quantity?.toString()!;
      },
      preConfirm: () => {
        const nameInput = document.getElementById('swal-input1') as HTMLInputElement;
        const quantityInput = document.getElementById('swal-input2') as HTMLInputElement;
  
        const name = nameInput.value!;
        const quantity = quantityInput.value!;
        return { name, quantity };
      }
    });
  
    if (formValue && 'name' in formValue && 'quantity' in formValue) {
      // The formValues object is defined and has 'name' and 'quantity' properties
      const name = formValue.name;
      const quantity = formValue.quantity;
      console.log(`Name: ${name}, Quantity: ${quantity}`);
      this.selectedAssets[0].name = name; 
      this.selectedAssets[0].quantity = parseInt(quantity);
      this.assetService.editAsset(this.selectedAssets[0]).subscribe(
        (response)=>{
          console.log(response);
        },
        (error)=>{
          console.log(error);
        }
      );
    } else {
      // The formValues object is undefined or doesn't have 'name' and 'quantity' properties
    }
  }

  deleteAsset():void{
    Swal.fire({
      title: 'Are you sure you want to delete?',
      showDenyButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.selectedAssets.forEach((as)=>{
          this.assetService.deleteAsset(as.id!).subscribe(
             (response)=>{
               console.log(response);
               this.assets = response;
             },
             (error)=>{
               console.log(error);
             }
          );
         });
         this.selectedAssets.splice(0, this.selectedAssets.length);
         this.onPageSizeChange();
        Swal.fire('Deleted!', '', 'success')
      } else if (result.isDenied) {
        
      }
    })
    
  

  
  }

  requestAsset(){
    Swal.fire({
      title: 'Request this asset to be assigned to you ?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Requested!', '', 'success')
      } else if (result.isDenied) {
        return;
      }
    })
    
    var assignAsset = new assignedAssetDTO();
    assignAsset.AssetId = this.selectedAssets[0].id; 
    assignAsset.UserId = this.currentUser.id;
    this.assignAssetService.addRequest(assignAsset).subscribe(
      (response)=>{
        console.log(response);
      }, 
      (error)=>{
        console.log(error);
      }
    )
  }

  onSelect(asset: any) {
    const index = this.selectedAssets.indexOf(asset);
    if (index >= 0) {
        this.selectedAssets.splice(index, 1);
    } else {
        this.selectedAssets.push(asset);
    }
  }

isSelected(asset: any){
      return this.selectedAssets.indexOf(asset) >= 0;
}

returnSelectedAssetsCount():number{
return this.selectedAssets.length;
}

//Pagination
getPaginatedData() {
  var startIndex = (this.page - 1) * +this.pageSize;
  var endIndex = startIndex + +this.pageSize;
  var currentPageItems = this.assets.slice(startIndex, endIndex);

  // If the current page has fewer items than the page size, use its length to calculate the start index
  var firstItemIndex = Math.min(startIndex, this.assets.length - currentPageItems.length);
  return this.assets.slice(firstItemIndex, firstItemIndex + +this.pageSize);
}

get totalPages(): number {
  return Math.ceil(this.assets.length / this.pageSize);
}

onPageSizeChange(){
  this.page = 1;
}

//End of pagination

//Sort, search and filter methods 
sortAssetList(field: string):void{
  if(field === "quantity" || field ==="id")
  this.assets.sort((a,b)=>{
    const fieldA = a[field]; 
    const fieldB = b[field]; 
    if(fieldA < fieldB) return -1; 
    if(fieldA > fieldB) return 1; 
    return 0;
  });
  else
  this.assets.sort((a, b) => {
    const nameA = typeof a[field] === 'string' ? a[field].toUpperCase() : '';
    const nameB = typeof b[field] === 'string' ? b[field].toUpperCase() : '';
  
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
  
  
  if(field === "id")
  if(this.sortOrderId === "asc"){ 
    this.sortOrderId = "desc"; 
    this.assets.reverse();
  }else {
    this.sortOrderId = "asc";
    this.sortOrderName = "";
    this.sortOrderSKU = ""; 
    this.sortOrderCategory = ""; 
    this.sortOrderQuantity = ""; 
    this.sortOrderAddedby = "";
  }

  if(field === "name")
  if(this.sortOrderName === "asc"){ 
    this.sortOrderName = "desc"; 
    this.assets.reverse();
  }else {
    this.sortOrderId = "";
    this.sortOrderName = "asc";
    this.sortOrderSKU = ""; 
    this.sortOrderCategory = ""; 
    this.sortOrderQuantity = ""; 
    this.sortOrderAddedby = "";
  }

  if(field === "sku")
  if(this.sortOrderSKU === "asc"){ 
    this.sortOrderSKU = "desc"; 
    this.assets.reverse();
  }else {
    this.sortOrderId = "";
    this.sortOrderName = "";
    this.sortOrderSKU = "asc"; 
    this.sortOrderCategory = ""; 
    this.sortOrderQuantity = ""; 
    this.sortOrderAddedby = "";
  }

  if(field === "category")
  if(this.sortOrderCategory === "asc"){ 
    this.sortOrderCategory = "desc"; 
    this.assets.reverse();
  }else {
    this.sortOrderId = "";
    this.sortOrderName = "";
    this.sortOrderSKU = ""; 
    this.sortOrderCategory = "asc"; 
    this.sortOrderQuantity = ""; 
    this.sortOrderAddedby = "";
  }

  if(field === "quantity")
  if(this.sortOrderQuantity === "asc"){ 
    this.sortOrderQuantity = "desc"; 
    this.assets.reverse();
  }else {
    this.sortOrderId = "";
    this.sortOrderName = "";
    this.sortOrderSKU = ""; 
    this.sortOrderCategory = ""; 
    this.sortOrderQuantity = "asc"; 
    this.sortOrderAddedby = "";
  }

  if(field === "addedBy")
  if(this.sortOrderAddedby === "asc"){ 
    this.sortOrderAddedby = "desc"; 
    this.assets.reverse();
  }else {
    this.sortOrderId = "";
    this.sortOrderName = "";
    this.sortOrderSKU = ""; 
    this.sortOrderCategory = ""; 
    this.sortOrderQuantity = ""; 
    this.sortOrderAddedby = "asc";
  }
}

clearFilters():void{
  this.assets = this.unsortedAssets;
  this.selectedAddedBy = "";
  this.selectedCategory = "";
}

populateFilters():void{
  this.assets.forEach(element => {
    if(this.addedByList.includes(element.addedBy)== false)
    this.addedByList.push(element.addedBy);
    if(this.categoryList.includes(element.category)==false)
    this.categoryList.push(element.category);
  });
}

applyFilters():void{
  if(this.selectedAddedBy !== "")
  this.assets = this.assets.filter((element) => element.addedBy == this.selectedAddedBy);
  
  if(this.selectedCategory !== "")
  this.assets = this.assets.filter((element)=> element.category == this.selectedCategory);
}

applySearch():void{
  let searchValue = this.searchString.toLocaleLowerCase(); 

  if(searchValue === "") 
  {
    this.assets = this.unsortedAssets;
    return;
  }

  this.assets = this.assets.filter((asset)=>{
    return(
    asset.id?.toString().includes(searchValue)||
    asset.name?.toString().toLowerCase().includes(searchValue)
    );
  });
}

//End of filter methods 



}
