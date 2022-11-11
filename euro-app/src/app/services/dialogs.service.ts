import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PromptComponent } from '../components/prompt/prompt.component';

@Injectable({
  providedIn: 'root'
})
export class DialogsService {

  constructor(public dialog: MatDialog) { }

  async prompt(title: string, value: string): Promise<string | null> {
    const dialogRef = this.dialog.open(PromptComponent, {
      width: '250px', 
      data: {
        title, value
      }
    });

    const res = dialogRef.afterClosed().toPromise();
    return res;
  }
}
