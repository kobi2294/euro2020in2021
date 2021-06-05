import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";


const exportables = [
    MatIconModule, 
    MatToolbarModule
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