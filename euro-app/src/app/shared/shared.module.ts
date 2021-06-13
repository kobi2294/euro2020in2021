import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatNativeDateModule } from "@angular/material/core";
import { MatCardModule } from "@angular/material/card";

const exportables = [
    MatIconModule, 
    MatToolbarModule, 
    MatTableModule,
    MatButtonModule, 
    MatFormFieldModule, 
    MatDatepickerModule, 
    MatNativeDateModule,
    MatSelectModule, 
    MatInputModule,
    MatCardModule
];

@NgModule({
    imports: [
        ...exportables, 
        CommonModule
    ], 
    exports: [
        ...exportables
    ]

})
export class SharedModule {
}