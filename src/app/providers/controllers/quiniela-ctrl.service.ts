import { Injectable } from "@angular/core";
import { ApiService } from "src/app/providers/api/api.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class QuinielaCtrlService {

  private _refreshTime = 5000;

  private _profile: any = null;
  private _imAdmin: boolean = false;
  private _id: string;
  private _jornada: any;
  private _quiniela: any;
  private _members: Array<any>;
  private _forecasts: Array<any>;

  constructor(private _api: ApiService) {}

  set refreshTime(seconds: number){
    if(!seconds || seconds < 0)return;
    this._refreshTime = seconds * 1000;
  }

  init(id: string, profile) {
    return new Observable<any>(observer => {

      this._id = id;
      this._profile = profile;
      if(!this._id){
        observer.error("INVALID_ID");
        return observer.complete();
      }
      if(!this._profile || !this._profile._id){
        observer.error("PROFILE_MUST_BE_SET");
        return observer.complete();
      }


      this.loadQuiniela()
      .then(res => {

          if (!res.success) {
            observer.error("FAILED_TO_LOAD_QUINIELA");
            return observer.complete();
          }

          observer.next(this.format());

        },
        () => {
          observer.error("QUINIELA_ERROR");
        }
      );
    });
  }

  loadQuiniela() {
    return new Promise<any>((resolve, reject)=>{
      this._api.quinielaDetails(this._id)
      .subscribe((response)=>{

        if(!response.success){
          return reject({success: false});
        }

        this._quiniela = response.quiniela;
        this._jornada = response.jornada;
        this._members = response.members;
        this._imAdmin = this._profile._id === this._quiniela.createdBy.id;
        resolve({success: true});
      })
    });
  }

  private _getMatchResult(x, y) {
    if (x > y) return "L";
    if (x == y) return "E";
    if (x < y) return "V";
  }

  private _translateToLEV() {
    for (let m of this._forecasts) {
      m.LEV = [];
      for (let r of m.results) {
        m.LEV.push(this._getMatchResult(r[0], r[1]));
      }
    }
  }

  private _sortForecasts() {
    // function to order member by number of points by descending
    function compare(a, b) {
      if (a.points < b.points) return 1;
      if (a.points > b.points) return -1;
      if (a.difference > b.difference) return 1;
      if (a.difference < b.difference) return -1;
      if (a.first_name < b.first_name) return -1;
      if (a.first_name > b.first_name) return 1;
      return 0;
    }
    // order member by number of points by descending
    this._forecasts.sort(compare);
  }

  format() {

    this._forecasts = [];

    let me = [];
    let imIn = false;
    let imActive;

    this._members.forEach(m => {

      if (m.member_id === this._profile._id) {
        imIn = true;
        imActive = m.active;
      }

      if (m.removed || !m.active) return;

      // fill forecasts
      m.results.forEach((r, i) => {
        var newM = JSON.parse(JSON.stringify(m));
        newM.results = r;
        if (this._quiniela.tiebreaker){
          newM.numberGoals = m.numberGoals && m.numberGoals.length ? m.numberGoals[i] : 0;
        }

        this._forecasts.push(newM);
      });

    });

    if (this._quiniela.simple) {
      this._translateToLEV();
    }

    let tableComp = [];
    let goalsCounter = 0;

    // fill comparative table
    this._jornada.matches.forEach(match => {
      if (!match.done) {
        // match has not started
        tableComp.push(null);
      } else {
        tableComp.push(this._getMatchResult(match.result[0], match.result[1]));
        goalsCounter += match.result[0] + match.result[1];
      }
    });

    // Set points and result colors
    for (let m of this._forecasts) {
      m.points = 0;
      m.colors = [];

      if (!m.results.length) {
        continue;
      }

      for (var j = 0; j < this._jornada.matches.length; j++) {
        m.colors.push(null);
        var p = 0;
        // if match does not happen yet, ignore result
        if (!this._jornada.matches[j].done) continue;

        var result = this._getMatchResult(m.results[j][0], m.results[j][1]);

        if (result === tableComp[j]) {
          p++; // If member guess the result (L or E or V) add a point

          if (!this._quiniela.simple) {
            // Quiniela is Marcador type
            // if member guess the result score add a point
            if (
              this._jornada.matches[j].result[0] == m.results[j][0] &&
              this._jornada.matches[j].result[1] == m.results[j][1]
            ) {
              if (!this._quiniela.scoreNumber) p++;
              else p = p + this._quiniela.scoreNumber - 1;
              m.colors[j] = "green";
            } else {
              m.colors[j] = "orange";
            }
          } else {
            m.colors[j] = "green";
          }
        } else {
          m.colors[j] = "red";
        }
        m.points += p;
      }

      m.difference = Math.abs(m.numberGoals - goalsCounter);

      if (m.member_id === this._profile._id) {
        me.push(m);
      }
    }
    this._sortForecasts();

    return {
      quiniela: this._quiniela,
      jornada: this._jornada,
      members: this._members,
      forecasts: this._forecasts,
      totalGoals: goalsCounter,
      me: me,
      imIn: imIn,
      imActive: imActive,
      imAdmin: this._imAdmin
    };
  }
}
