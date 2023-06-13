import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AssignedAssetService } from 'src/app/services/assigned-asset.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assign-asset',
  templateUrl: './assign-asset.component.html',
  styleUrls: ['./assign-asset.component.css']
})
export class AssignAssetComponent implements OnInit {
  UserRoles:string = "";

  assignedAssets : any[] = [];
  selectedAssignedAssets: any[] = [];

  unsortedAssignedAssets : any[] = [];

  page: number = 1; 
  pageSize: number = 5;

  sortOrderId: string = "";
  sortOrderAssetName: string = "";
  sortOrderUsername: string = "";
  sortOrderAssignedDate: string = "";
  sortOrderExpireDate: string = "";

  selectedUsername : string = "";
  usernameList : string[] = [];
  selectedStatus : string = "";
  statusList : string[] = [];

  searchString = "";

  constructor(private assignAssetService : AssignedAssetService, private authService : AuthServiceService) { }

  ngOnInit(): void {
    this.getAll();
    this.UserRoles = this.authService.getRoles();
  }

  getAll(){
   this.assignAssetService.getAll().subscribe(
    (response)=> { 
      this.assignedAssets = response; 
      this.unsortedAssignedAssets = response;
      this.populateFilters();
    }, 
    (error)=>{
      console.log(error);
    }
   );
  }

  async Approve(){
  const{value: formValue} = await Swal.fire({
    title: 'Approve asset assign',
    html:
    '<label for="swal-input3" class="form-label">Expire Date</label>' +
    '<input type="date" id="swal-input3" class="form-control">' +
    '<label for="swal-input4" class="form-label">Status</label>' +
    '<select id="swal-input4" class="form-control">' +
    '<option value="Approved">Approved</option>' +
    '<option value="Rejected">Rejected</option>' +
    '</select>',
      focusConfirm: false,
    preConfirm: () => {
      const dateInput = document.getElementById('swal-input3') as HTMLInputElement;
      const statusInput = document.getElementById('swal-input4') as HTMLInputElement; 

      const date = dateInput.value!;
      const status = statusInput.value!;

      return {date, status};
    }
  });

  if(formValue && 'date' in formValue && 'status' in formValue)
  {
    const date = formValue.date; 
    const status = formValue.status;
    
    this.selectedAssignedAssets[0].expireDate = date; 
    this.selectedAssignedAssets[0].status = status;

    this.assignAssetService.editRequest(this.selectedAssignedAssets[0]).subscribe(
      (response)=>{
       this.selectedAssignedAssets[0].assignedDate = response.assignedDate;
      },(error)=>{
        console.log(error);
      }
    );
  }
  }

  DeleteAssigns(){
    Swal.fire({
      title: 'Do you want to delete these assigned assets?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.selectedAssignedAssets.forEach(a => {
          this.assignAssetService.deleteAssignAsset(a.id).subscribe(
            (response)=>{
              this.getAll(); 
              this.page = 1;
            }, 
            (error)=>{
              console.log(error);
            }
          );
         })
        Swal.fire('Deleted!', '', 'success')
        this.selectedAssignedAssets.splice(0, this.selectedAssignedAssets.length);
        this.getAll();
      } else if (result.isDenied) {
        Swal.fire('The assigns were not deleted', '', 'info')
      }
    })

  }

  returnSelectedAssignAssetsCount():number{
    return this.selectedAssignedAssets.length;
  }

  onPageSizeChange()
  {
    this.page = 1;
  }

  getPaginatedData(){
    var startIndex = (this.page - 1) * +this.pageSize;
  var endIndex = startIndex + +this.pageSize;
  var currentPageItems = this.assignedAssets.slice(startIndex, endIndex);

  // If the current page has fewer items than the page size, use its length to calculate the start index
  var firstItemIndex = Math.min(startIndex, this.assignedAssets.length - currentPageItems.length);
  return this.assignedAssets.slice(firstItemIndex, firstItemIndex + +this.pageSize);
  }

  isSelected(assignedAsset : any)
  {
    return this.selectedAssignedAssets.indexOf(assignedAsset) >=0;
  }

  onSelect(assignedAsset:any)
  {
    const index = this.selectedAssignedAssets.indexOf(assignedAsset); 
    if(index >= 0)
    this.selectedAssignedAssets.splice(index,1);
    else 
    this.selectedAssignedAssets.push(assignedAsset);
  }

  get totalPages():number{
    return Math.ceil(this.assignedAssets.length/this.pageSize);
  }

  sortAssetAssignList(field: string):void{
    if(field === "id")
    this.assignedAssets.sort((a,b)=>{
    const fieldA = a[field]; 
    const fieldB = a[field]; 
    if(fieldA < fieldB) return -1; 
    if(fieldA > fieldB) return 1; 
    return 0;
    });
    else 
    this.assignedAssets.sort((a,b)=>{
      const nameA = typeof a[field] === 'string' ? a[field].toUpperCase(): '';
      const nameB = typeof b[field] === 'string' ? b[field].toUpperCase(): '';

      if(nameA < nameB) return -1 
      if(nameA > nameB) return 1; 
      return 0;
    });

    if(field === "id")
        if(this.sortOrderId === "asc"){
          this.sortOrderId = "desc"; 
          this.assignedAssets.reverse();
        }else {
          this.sortOrderId = "asc";
          this.sortOrderAssetName = "";
          this.sortOrderUsername = ""; 
          this.sortOrderAssignedDate ="";
          this.sortOrderExpireDate = "";
        }
       
        if(field === "assetName")
        if(this.sortOrderAssetName === "asc"){
          this.sortOrderAssetName = "desc"; 
          this.assignedAssets.reverse();
        }else {
          this.sortOrderId = "";
          this.sortOrderAssetName = "asc";
          this.sortOrderUsername = ""; 
          this.sortOrderAssignedDate ="";
          this.sortOrderExpireDate = "";
        }   
    
        if(field === "username")
        if(this.sortOrderUsername === "asc"){
          this.sortOrderUsername = "desc"; 
          this.assignedAssets.reverse();
        }else {
          this.sortOrderId = "";
          this.sortOrderAssetName = "";
          this.sortOrderUsername = "asc"; 
          this.sortOrderAssignedDate ="";
          this.sortOrderExpireDate = "";
        }


        if(field === "assignedDate")
        if(this.sortOrderAssignedDate === "asc"){
          this.sortOrderAssignedDate= "desc"; 
          this.assignedAssets.reverse();
        }else {
          this.sortOrderId = "";
          this.sortOrderAssetName = "";
          this.sortOrderUsername = ""; 
          this.sortOrderAssignedDate ="asc";
          this.sortOrderExpireDate = "";
        }

        if(field === "expireDate")
        if(this.sortOrderExpireDate === "asc"){
          this.sortOrderExpireDate = "desc"; 
          this.assignedAssets.reverse();
        }else {
          this.sortOrderId = "";
          this.sortOrderAssetName = "";
          this.sortOrderUsername = ""; 
          this.sortOrderAssignedDate ="";
          this.sortOrderExpireDate = "asc";
        }
    
  }

  //Filters and search
  
  applySearch(){
    let searchValue = this.searchString.toLocaleLowerCase();

    if(searchValue === "")
    {
      this.assignedAssets = this.unsortedAssignedAssets; 
      return;
    }

    this.assignedAssets = this.assignedAssets.filter((assignAsset)=>{
      return(
      assignAsset.id?.toString().includes(searchValue)||
      assignAsset.asset.name?.toString().toLowerCase().includes(searchValue)
      );
    });
  }

  populateFilters(){
    this.assignedAssets.forEach(aa => {
      if(this.usernameList.includes(aa.user.username) == false)
      this.usernameList.push(aa.user.username); 
      if(this.statusList.includes(aa.status) == false)
      this.statusList.push(aa.status);
    });
  }

  applyFilters(){
   if(this.selectedUsername !== "")
   this.assignedAssets = this.assignedAssets.filter((element)=> element.user.username == this.selectedUsername);

   if(this.selectedStatus !== "")
   this.assignedAssets = this.assignedAssets.filter((element)=> element.status == this.selectedStatus);

  }

  clearFilters(){
  this.assignedAssets = this.unsortedAssignedAssets; 
  this.selectedUsername = ""; 
  this.selectedStatus = "";
  }

  //End of filters and search

  

}
