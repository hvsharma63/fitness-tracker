import { NgModule } from '@angular/core';
import {
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
} from '@angular/material';

const modules = [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
];
@NgModule({
    imports: [...modules],
    exports: [...modules]
})
export class MaterialModule { }
