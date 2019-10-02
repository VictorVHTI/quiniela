import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ApiService } from '../../../providers/api/api.service';
import { MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConfirmDialog } from '../../confirm-dialog/confirm-dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss']
})
export class AddMemberComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;

  view = 'profiles';

  quiniela: any;
  myProfiles: Array<any>;
  dataSource: any;
  displayedColumns: string[] = ['select', 'first_name', 'actions'];

  addingMembers: boolean = false;
  creatingProfile: boolean = false;

  avatars: Array<string> = [];
  newProfile: any = {
    picture: { data: { url: 'http://res.cloudinary.com/moskalti-tech/image/upload/v1512320250/user.png' } }
  }
  displayAvatars: boolean = false;

  profileForm = new FormGroup({
    'first_name': new FormControl('', [
      Validators.required,
    ]),

    'last_name': new FormControl('', [
      Validators.required
    ])

  });

  selection = new SelectionModel<QuinielaMember>(true, []);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api: ApiService,
    private dialog: MatDialog) {
    this.quiniela = data.quiniela;
  }

  ngOnInit() {
    this.loadMyMembers();
  }

  loadMyMembers() {
    this.api.myProfiles()
      .subscribe(res => {
        if (res.success) {
          this.myProfiles = res.profiles;

          this.initDataSource();
        }
      })
  }

  initDataSource() {
    this.dataSource = new MatTableDataSource(this.myProfiles);
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  addMembers() {
    var data = {
      members: this.selection.selected,
      quiniela_id: this.quiniela._id,
      createdByUser: true
    }
    data.members.forEach(m => {
      m.member_id = m._id;
    });
    this.addingMembers = true;
    this.api.addMembersToQuiniela(data)
      .subscribe(res => {
        this.addingMembers = false;
        if (res.success) {
          this.dialog.closeAll();
        }
      }, err => {
        this.addingMembers = false;
      })
  }

  deleteProfile(profile) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '250px',
      data: {
        text: 'Seguro que desea eliminar el perfil: ' + profile.first_name + ' ' + profile.last_name
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.deleteProfile(profile._id)
          .subscribe(res => {
            if (res.success) {
              this.loadMyMembers();
            }
          });
      }
    });
  }

  createProfile() {
    this.api.settings('avatars').subscribe(res => {
      if (res.success) {
        this.avatars = res.data[0].avatars;
      }
    });
    this.profileForm.reset();
    this.newProfile = {
      picture: { data: { url: 'http://res.cloudinary.com/moskalti-tech/image/upload/v1512320250/user.png' } }
    }
    this.view = 'createProfile';
  }
  invalidProfile(){
    return this.profileForm.invalid;
  }
  saveProfile(){
    this.newProfile.first_name = this.profileForm.value.first_name;
    this.newProfile.last_name = this.profileForm.value.last_name;
    this.creatingProfile = true;
    this.api.createProfile(this.newProfile).subscribe(res=>{
      this.creatingProfile = false;
      if(res.success){
        this.view = 'profiles';
        this.loadMyMembers();
      }
    })
  }
}

export interface QuinielaMember {
  _id: string,
  quiniela_id: string,
  jornada_id: string,
  league: string, // need to be removed
  q_picture: string,
  endDate: string,
  quiniela_name: string,
  member_id: string,
  first_name: string,
  last_name: string,
  picture: {
    data: {
      url: string
    }
  },
  active: boolean,
  removed: boolean,
  starred: boolean,
  results: Array<any>,
  numberGoals: Array<any>
  points: number,
  createdByUser: Boolean
}