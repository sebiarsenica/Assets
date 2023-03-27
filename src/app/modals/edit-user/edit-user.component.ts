import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
selectedUsers : any[] = [];
  

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.selectedUsers = history.state.user;
    console.log(this.selectedUsers);
  }

}
