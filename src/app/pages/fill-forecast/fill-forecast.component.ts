import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from '../../providers/api/api.service';
import {MatDialogRef} from '@angular/material/dialog';


@Component({
  selector: 'app-fill-forecast',
  templateUrl: './fill-forecast.component.html',
  styleUrls: ['./fill-forecast.component.scss']
})
export class FillForecastComponent implements OnInit {

  profile: any = JSON.parse(localStorage.profile);

  member: any;
  quiniela: any;
  jornada: any;

  myForecastSimple: Array<string> = [];
  myForecast: Array<any> = [];

  totalGoals: number = null;

  loading: boolean = false;
  errorMsg: string = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FillForecastComponent>,
    private api: ApiService
  ) {
    this.member = data.member;
    this.quiniela = data.quiniela;
    this.jornada = data.jornada;

    for(let i = 0, len = this.jornada.matches.length; i < len; i++){
      this.myForecastSimple.push("E");
      this.myForecast.push([0,0]);
    }

    console.log(data)
  }

  ngOnInit() {
  }

  private getRandom(){
    var x;
    if(this.quiniela.simple){
      x = Math.floor(Math.random() * 3);
      if (x == 0) return "L";
      if (x == 1) return "E";
      if (x == 2) return "V";
    }
    else{
      x = Math.floor(Math.random() * 100);
      if(x < 25) return 0;
      if(x >= 25 && x < 50) return 1;
      if(x >= 50 && x < 85) return 2;
      if(x >= 85 && x < 97) return 3;
      if(x >= 97 && x < 99) return 4;
      if(x >= 99) return 5;
    }
  }

  getTiebreakerSimple(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  getSum(){
    var x = 0;
    for (let f of this.myForecast){
      x = x + f[0] + f[1];
    }
    return x;
  }

  getLucky(){
    let arr = [];
    let n = this.jornada.matches.length;

    for(var i = 0; i < n;i++){
      if(this.quiniela.simple){
        arr.push(this.getRandom())
      }
      else{
        arr.push([this.getRandom(),this.getRandom()])
      }
    }
    if(this.quiniela.simple){
      this.myForecastSimple = arr;
      if (this.quiniela.tiebreaker) this.totalGoals = this.getTiebreakerSimple(this.myForecastSimple.length, this.myForecastSimple.length * 3);
    }
    else{
      this.myForecast = arr;
      if (this.quiniela.tiebreaker) this.totalGoals = this.getSum();
    }
  }

  saveForecast() {
    this.loading = true;
    if(this.quiniela.simple){ // translate results to marcador
      this.myForecast = [];
      for(let r of this.myForecastSimple){
        switch(r){
          case "L":
            this.myForecast.push([1,0])
            break;
          case "E":
            this.myForecast.push([0,0])
            break;
          case "V":
            this.myForecast.push([0,1])
            break;
        }
      }
    }
    var params = {
      quiniela_id: this.quiniela._id,
      forecast: this.myForecast,
      profile_id: "",
      profile_by_user: this.member._id !== this.profile._id,
      numberGoals: this.totalGoals
    };

    this.api.saveForecast(params)
    .subscribe(res=>{
      this.loading = false;
      if(!res.success){
        if(res.message === "QUINIELA_FULL"){
          this.errorMsg = `Esta Quiniela esta llena,
                contacta a tu administrador (` + this.quiniela.createdBy.first_name +
                  ' ' + this.quiniela.createdBy.last_name + `) para aumentar la capacidad.`;
        } else if (res.message === "JORNADA_IN_PROGRESS"){
          this.errorMsg = "Esta quiniela ya comenzó, no es posible guardar tu pronóstico";
        } else {
          this.errorMsg = 'Ocurrio un error al guardar tu pronostico, por favor, intenta de nuevo';
        }
      }
      else{
        // Forecast saved sucessfully
        this.dialogRef.close();
      }
    })
    // this.QS.saveForecast(params)
    // .subscribe(res => {
    //   this.loading.dismiss();
    //   if(!res.success && res.message === "QUINIELA_FULL"){
    //     let alert = this.alertCtrl.create({
    //       title: 'Oops!',
    //       subTitle: `Esta Quiniela esta llena,
    //       contacta a tu administrador (` + this.quiniela.createdBy.first_name +
    //         ' ' + this.quiniela.createdBy.last_name + `) para aumentar la capacidad.`,
    //       buttons: ['OK'],
    //     });
    //     alert.present();
    //   }
    //   else{
    //     this.scrollToTop();
    //     this.myForecast = null;
    //     this.myForecastSimple = null;
    //     this.loadQuiniela(true);
    //   }
    //})
  }

}
