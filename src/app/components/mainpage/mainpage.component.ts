import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';
import { StatisticsService } from 'src/app/services/statistics.service';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent implements OnInit {

  userCount : number = 0;
  assetsCount : number = 0; 
  assignedAssetCount : number = 0; 
  pendingAssignedAssetCount : number = 0;

  data = [
    { month: 'January', count: 10 },
    { month: 'February', count: 20 },
    { month: 'March', count : 0}, 
    { month: 'April', count: 0}, 
    { month: 'May', count: 0}, 
    { month: 'June', count: 0}, 
    { month: 'July', count: 0}, 
    { month: 'August', count: 0}, 
    { month: 'September', count: 0}, 
    { month: 'October', count: 0}, 
    { month: 'November', count: 0}, 
    { month: 'December', count: 0}
  ];

  constructor(private AuthService: AuthServiceService, private statisticsService : StatisticsService) { }

  ngOnInit(): void {
    this.getCounts();
    this.getMonthCounts();
  }

  getMonthCounts(): void{ 
    this.statisticsService.getMonthsCount().subscribe(
      (response) => {
        console.log(response);
      }, 
      (error) => {
        console.log(error);
      }
    )
  }

  getCounts()
  {
    this.statisticsService.getCounts().subscribe(
      (response)=>{
        this.userCount = response.userCount; 
        this.assetsCount = response.assetCount; 
        this.assignedAssetCount = response.assignedAssetCount; 
        this.pendingAssignedAssetCount = response.pendingAssignedAssetCount;
      }, 
      (error)=>{
        console.log(error);
      }
    );
  }

  getPercentage(count: number): number {
    var value =  0; 
    if(count * 10 > 500) 
    value = 500; 
    else 
    value = count * 10; 
    return value ;
  }

}
