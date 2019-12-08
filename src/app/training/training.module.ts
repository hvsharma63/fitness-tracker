import { NgModule } from '@angular/core';
import { CurrentTrainingComponent } from './current-training/current-training.component';
import { NewTrainingComponent } from './new-training/new-training.component';
import { PastTrainingComponent } from './past-training/past-training.component';
import { StopTrainingComponent } from '../modals/stop-training/stop-training.component';
import { TrainingComponent } from './training.component';
import { SharedModule } from '../shared/shared.module';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { TrainingRoutingModule } from './training-routing.module';


@NgModule({
    imports: [
        SharedModule,
        AngularFirestoreModule,
        TrainingRoutingModule
    ],
    exports: [],
    declarations: [
        TrainingComponent,
        CurrentTrainingComponent,
        NewTrainingComponent,
        PastTrainingComponent,
        StopTrainingComponent
    ],
    providers: [],
    entryComponents: [StopTrainingComponent]
})
export class TrainingModule { }
