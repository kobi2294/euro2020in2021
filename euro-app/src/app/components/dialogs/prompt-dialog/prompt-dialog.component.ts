import { InjectFlags } from '@angular/compiler/src/core';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface PromptInput {
  title: string;
  value: string;
}


@Component({
  selector: 'app-prompt-dialog',
  templateUrl: './prompt-dialog.component.html',
  styleUrls: ['./prompt-dialog.component.scss']
})
export class PromptDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<PromptDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: PromptInput
  ) { }

  ngOnInit(): void {
  }

  cancel() {
    this.dialogRef.close();
  }

  ok(value: string) {
    this.dialogRef.close(value);
  }

}
