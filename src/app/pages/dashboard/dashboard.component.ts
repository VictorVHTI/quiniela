import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../providers/api/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  showArchived: boolean = false;
  loadingDash: boolean = false;
  myQuinielas: Array<any> = [];

  constructor(
    private api: ApiService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadDashboard();
  }

  orderEndDate(a,b){
    if(a.endDate < b.endDate)return 1;
    if(a.endDate > b.endDate)return -1;
    return 0;
  }

  loadDashboard(){
    this.loadingDash = true;
    this.myQuinielas = [];

    this.api.imin(this.showArchived)
    .subscribe((res)=>{
      this.loadingDash = false;
      if(res.success){
        this.myQuinielas = res.imin.concat(res.createdByMe.map(function(q){
          q.quiniela_name = q.name;
          q.quiniela_id = q._id;
          q.q_picture = q.picture;
          q.createdByMe = true;
          return q;
        }));
        this.myQuinielas.sort(this.orderEndDate);
      }
    }, err => {
      this.loadingDash = false;
      console.error(err);
    });
  }

  details(q){
    setTimeout(()=>{
      this.router.navigate(['/quiniela', q.quiniela_id])
    })
  }

}
