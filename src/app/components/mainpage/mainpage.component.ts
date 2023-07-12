import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
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

  selectValue : string = "";

  data = [
    { name: 'January', value: 0 },
    { name: 'February', value: 0 },
    { name: 'March', value : 0}, 
    { name: 'April', value: 0}, 
    { name: 'May', value: 0}, 
    { name: 'June', value: 0}, 
    { name: 'July', value: 0}, 
    { name: 'August', value: 0}, 
    { name: 'September', value: 0}, 
    { name: 'October', value: 0}, 
    { name: 'November', value: 0}, 
    { name: 'December', value: 0}
  ];

  ChartData = [
    { name: 'January', value: 0 },
    { name: 'February', value: 0 },
    { name: 'March', value: 0 },
    { name: 'April', value: 0 },
    { name: 'May', value: 0 },
    { name: 'June', value: 0 },
    { name: 'July', value: 0 },
    { name: 'August', value: 0 },
    { name: 'September', value: 0 },
    { name: 'October', value: 0 },
    { name: 'November', value: 0 },
    { name: 'December', value: 0 }
  ];
  

  colorScheme = 'natural';

  constructor(private AuthService: AuthServiceService, private statisticsService : StatisticsService, private cdr:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getCounts();
    this.getCategoryCounts();
  }

  ChangeChartData():void{
    this.getCategoryCounts();
  }

  getCategoryCounts(): void {
    this.statisticsService.getCategoryCount(this.selectValue).subscribe(
      (response) => {
        console.log(response);
        this.ChartData[0].value = parseInt(response.jan);
        this.ChartData[1].value = parseInt(response.feb);
        this.ChartData[2].value = parseInt(response.mar);
        this.ChartData[3].value = parseInt(response.apr);
        this.ChartData[4].value = parseInt(response.may);
        this.ChartData[5].value = parseInt(response.june);
        this.ChartData[6].value = parseInt(response.july);
        this.ChartData[7].value = parseInt(response.aug);
        this.ChartData[8].value = parseInt(response.sept);
        this.ChartData[9].value = parseInt(response.oct);
        this.ChartData[10].value = parseInt(response.nov);
        this.ChartData[11].value = parseInt(response.dec);
        this.data = [...this.ChartData];
        this.ChartData = this.ChartData.slice();
        
      },
      (error) => {
        console.log(error);
      }
    );
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
