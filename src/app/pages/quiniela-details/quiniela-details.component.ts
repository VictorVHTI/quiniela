import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { QuinielaCtrlService } from '../../providers/controllers/quiniela-ctrl.service';
import { FillForecastComponent } from '../fill-forecast/fill-forecast.component';

@Component({
  selector: 'app-quiniela-details',
  templateUrl: './quiniela-details.component.html',
  styleUrls: ['./quiniela-details.component.scss']
})
export class QuinielaDetailsComponent implements OnInit {

  quinielaId: string;

  profile = JSON.parse(localStorage.profile);
  quiniela: any = null;
  jornada: any;
  members: any;
  imAdmin: boolean = false;
  forecasts: Array<any>;
  totalGoals: number;
  me: Array<any>;
  mePos: number = 0;
  imIn: boolean = false;
  imActive: boolean = false;

  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  timeOffset: number = new Date().getTimezoneOffset() / 60;
  showCron: boolean = false;

  showProgressBar: boolean = false;

  private refreshTime = 1000 * 20;

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private ctrl: QuinielaCtrlService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((res) => {
      if (res['params'].id) {
        this.quinielaId = res['params'].id;
        this.loadQuiniela();

        setInterval(() => {
          if (this.showProgressBar) return;
          this.loadQuiniela();
        }, this.refreshTime);
      }
    })
  }

  loadQuiniela() {
    this.showProgressBar = true;
    this.ctrl.init(this.quinielaId, this.profile)
      .subscribe((res) => {
        this.quiniela = res.quiniela;
        this.jornada = res.jornada;
        this.members = res.members;
        this.forecasts = res.forecasts;
        this.totalGoals = res.totalGoals;
        this.me = res.me;
        this.imIn = res.imIn;
        this.imActive = res.imActive;
        this.imAdmin = res.imAdmin;

        this.showProgressBar = false;
        this.chronometer();
      });
  }

  setCronometer() {
    let realTime = new Date().getTime();
    let startTime = Date.parse(this.jornada.startDate);
    var clearInterval = false;
    if (startTime > realTime) {
      this.showCron = true;
      this.jornada.inprogress = false;
      var diferencia = (startTime - realTime) / 1000;
      this.days = Math.floor(diferencia / 86400);
      diferencia = diferencia - (86400 * this.days);
      this.hours = Math.floor(diferencia / 3600);
      diferencia = diferencia - (3600 * this.hours);
      this.minutes = Math.floor(diferencia / 60);
      diferencia = diferencia - (60 * this.minutes);
      this.seconds = Math.floor(diferencia);
    }
    else {
      this.jornada.inprogress = true;
      this.showCron = false;
      clearInterval = true;
    }
    if (new Date(Date.parse(this.jornada.endDate)) < new Date()) {
      this.jornada.finished = true;
      clearInterval = true;
    }
    return clearInterval;
  }
  async chronometer() {
    this.setCronometer();
    if (cronInterval) {
      clearInterval(cronInterval);
    }

    var cronInterval = setInterval(() => {
      if (this.setCronometer()) {
        clearInterval(cronInterval);
      }
    }, 1000)
  }


  fillForecastDialog() {
    let dialog = this.dialog.open(FillForecastComponent,
      {
        data: {
          member: this.profile,
          quiniela: this.quiniela,
          jornada: this.jornada
        }
      });

    dialog.afterClosed().subscribe(res => {
      this.loadQuiniela();
    })
  }
}
