import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PromptDialogComponent } from '../components/dialogs/prompt-dialog/prompt-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogsService {

  constructor(public dialog: MatDialog) { }

  async prompt(title: string, value: string): Promise<string | null> {
    const dialogRef = this.dialog.open(PromptDialogComponent, {
      width: '250px', 
      data: {
        title, value
      }
    });

    const res = dialogRef.afterClosed().toPromise();
    return res;
  }
}
