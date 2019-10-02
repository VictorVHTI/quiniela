import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-quiniela-table',
  templateUrl: './quiniela-table.component.html',
  styleUrls: ['./quiniela-table.component.scss']
})
export class QuinielaTableComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  profile = JSON.parse(localStorage.profile);
  forecasts: Array<any>;

  pageSize: number = 20;

  @Input() jornada: any;
  @Input() totalGoals: number;
  @Input() quiniela: any;
  @Input()
  set _forecasts(forecasts: Array<any>) {
    this.forecasts = forecasts;
    this.dataSource = new MatTableDataSource(this.forecasts);
    setTimeout(() => { this.dataSource.paginator = this.paginator; });
  }

  displayedColumns: string[] = ['points', 'first_name', 'matches'];
  dataSource: any;



  constructor() {

  }

  ngOnInit() {
    if (this.quiniela.tiebreaker) {
      this.displayedColumns.push('difference');
    }
    this.dataSource = new MatTableDataSource(this.forecasts);
    this.dataSource.sort = this.sort;
  }

  getMatchResult(x: number, y: number) {
    if (x > y) return "L";
    if (x === y) return "E";
    if (x < y) return "V";
  }

  pdf() {
    let _jornadaTable = {
      headerRows: 1,
      widths: ['auto', '*'],
      body: [
        [{ text: "Jornada: " + this.jornada.name, alignment: 'left', noWrap: true }, ''],
        ['', 'Local'],
        ['', 'Visita']
      ]
    };
    this.jornada.matches.forEach((m, i) => {
      _jornadaTable.widths.push('auto');
      _jornadaTable.body[0].push({ text: (i + 1).toString(), alignment: 'center', noWrap: false });
      _jornadaTable.body[1].push((m.done ? ('(' + m.result[0] + ')') : '') + m.team_local.label);
      _jornadaTable.body[2].push((m.done ? ('(' + m.result[1] + ')') : '') + m.team_foreign.label);
    });

    let nColumns =
      this.forecasts.length > 200 ? this.quiniela.simple ? 5 : 4 :
        this.forecasts.length > 100 ? this.quiniela.simple ? 4 : 3 :
          this.forecasts.length > 30 ? 2 : 1;
    let columns = [];
    for (let i = 0; i < nColumns; i++) {
      columns.push({
        fontSize: this.forecasts.length > 100 ? 6 : this.forecasts.length > 30 ? 9 : 12,
        layout: {
          hLineWidth: function (i, node) {
            if (i === 1) return 2;
            return (i === 0 || i === node.table.body.length) ? 0 : 1;
          },
          vLineWidth: function (i, node) {
            return 0;
            // return (i === 0 || i === node.table.widths.length) ? 2 : 1;
          },
          // hLineColor: function (i, node) {
          //   return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
          // },
          // vLineColor: function (i, node) {
          //   return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
          // },
          // hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
          // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
          paddingLeft: function (i, node) { return .5; },
          paddingRight: function (i, node) { return .5; },
          paddingTop: function (i, node) { return .5; },
          paddingBottom: function (i, node) { return .5; },
          // fillColor: function (rowIndex, node, columnIndex) { return null; }
        },
        table: {
          headerRows: 1,
          widths: ['auto', 'auto', 'auto'],
          body: [
            ['#', 'Pts', 'Participantes']
          ]
        },
        margin: [2, 2, 2, 2]
      })

      this.jornada.matches.forEach((m, jindex) => {
        columns[i].table.widths.push('*');
        columns[i].table.body[0].push({ text: jindex + 1, alignment: 'center' });
      });

      let set = this.forecasts.slice(i * Math.ceil(this.forecasts.length / nColumns), (i + 1) * Math.ceil(this.forecasts.length / nColumns));
      set.forEach((f, ii) => {
        let memberRow = [];
        memberRow.push((i * Math.ceil(this.forecasts.length / nColumns)) + (ii + 1));
        memberRow.push({ text: f.points, alignment: 'center' });
        memberRow.push((f.first_name + ' ' + f.last_name).slice(0, 10));
        if (this.quiniela.simple) {
          this.jornada.matches.forEach((m, i) => {
            memberRow.push({ text: f.LEV[i], color: f.colors[i], alignment: 'center' });
          });
        }
        else {
          this.jornada.matches.forEach((m, i) => {
            memberRow.push({ text: f.results[i][0] + '-' + f.results[i][1], color: f.colors[i], alignment: 'center' });
          })
        }
        columns[i].table.body.push(memberRow);
      });
    }

    let perfectResult = [];
    this.jornada.matches.forEach(m => {
      if (m.finish) {
        perfectResult.push(this.getMatchResult(m.result[0], m.result[1]));
      }
    })
    let title = this.quiniela.name + " | " + this.quiniela.createdBy.first_name + " " + this.quiniela.createdBy.last_name;

    if (this.quiniela.simple && perfectResult.length === this.jornada.matches.length) {
      title = title + "     Combinación ganadora: " + perfectResult.join(" ");
    }

    var docDefinition = {
      pageOrientation: 'portrait', pageMargins: [5, 5, 5, 5],
      pageSize: 'LEGAL',
      content: [
        title,
        {
          fontSize: 7,
          layout: 'lightHorizontalLines',
          table: _jornadaTable
        },
        {
          columns: columns
        }
      ],
    };

    docDefinition.content.push('www.quinielapro.com');
    let fileName = this.quiniela.name + "_" + this.quiniela.createdBy.first_name + "_" + this.quiniela.createdBy.last_name;
    pdfMake.createPdf(docDefinition).download(fileName);
  }

}
