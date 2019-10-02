import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource, MatDialog } from '@angular/material';

import { ApiService } from '../../../providers/api/api.service';
import { AddMemberComponent } from '../add-member/add-member.component';

@Component({
  selector: 'app-quiniela-admin',
  templateUrl: './quiniela-admin.component.html',
  styleUrls: ['./quiniela-admin.component.scss']
})
export class QuinielaAdminComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;

  profile = JSON.parse(localStorage.profile);
  members: Array<any>;

  forecastsLength: number;
  limit: number;
  inProgress: boolean;

  @Input() quiniela: any;
  @Input()
  set _members(members: Array<any>) {
    this.members = members;
    this.dataSource = new MatTableDataSource(this.members);
  }
  @Input()
  set _forecastsLength(length: number) {
    this.forecastsLength = length;
  }
  @Input()
  set _limit(limit: number) {
    this.limit = limit;
  }
  @Input()
  set _inProgress(inProgress: boolean) {
    this.inProgress = inProgress;
  }


  displayedColumns: string[] = ['first_name', 'starred', 'forecasts', 'actions'];
  dataSource: any;

  constructor(private api: ApiService, private dialog: MatDialog) {

  }

  star(member: any) {
    member.starred = !member.starred;
    this.api.starMember(member._id).subscribe();
  }

  addMemberDialog() {
    let dialog = this.dialog.open(AddMemberComponent,
      {
        minWidth: '90%',
        minHeight: '80vh',
        data: {
          quiniela: this.quiniela
        }
      });

    dialog.afterClosed().subscribe(res => {

    });
  }

  memberAction(member, action) {
    let message;
    if (action === 'remove') {
      message = 'Eliminar a ' + member.first_name + ' de tu Quiniela? Esta acción es permanente, el usuario no podrá unirse de nuevo';
    }
    else{
      // action is "disable member"
      // if(member.action)
    }
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.members);
    this.dataSource.sort = this.sort;
  }

}
