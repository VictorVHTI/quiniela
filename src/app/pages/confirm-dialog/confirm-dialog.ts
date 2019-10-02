import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
    selector: 'confirm-dialog',
    template: `
    <div mat-dialog-content>
        {{text}}
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">No</button>
      <button mat-button [mat-dialog-close]="true" cdkFocusInitial>Si</button>
    </div>
    `
})
export class ConfirmDialog {

    text: string;

    constructor(
        public dialogRef: MatDialogRef<ConfirmDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.text = data.text;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}