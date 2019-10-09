import { NgModule } from '@angular/core';
import { MatInputModule, MatButtonModule, MatFormFieldModule, MatIconModule } from '@angular/material';

const modules = [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule
];
@NgModule({
    imports: [...modules],
    exports: [...modules]
})
export class MaterialModule { }
