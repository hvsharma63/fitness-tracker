import { Injectable } from '@angular/core';
import { Exercise } from '../models/exercise.model';
import { Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { UIService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromTraining from '../training/training.reducer';
import * as UI from '../shared/ui.actions';
import * as Training from '../training/training.actions';


@Injectable({
    providedIn: 'root'
})
export class TrainingService {

    private fbsubs: Subscription[] = [];
    constructor(
        private db: AngularFirestore,
        private uiService: UIService,
        private store: Store<fromTraining.State>
    ) { }

    fetchAvailableExercises() {
        this.fbsubs.push(
            this.db.collection('availableExercises')
                .snapshotChanges()
                .pipe(
                    map(docArray => {
                        return docArray.map((doc: any) => {
                            return {
                                id: doc.payload.doc.id,
                                name: doc.payload.doc.data().name,
                                duration: doc.payload.doc.data().duration,
                                calories: doc.payload.doc.data().calories,
                            };
                        });
                    })
                )
                .subscribe((excercises: Exercise[]) => {
                    this.store.dispatch(new UI.StopLoading());
                    this.store.dispatch(new Training.SetAvailableTrainings(excercises));
                }, error => {
                    this.store.dispatch(new UI.StopLoading());
                    this.uiService.showSnackbar('Fetching Exercises Failed, Please Try Again later!', null, 3000);
                })
        );
    }

    startExercise(id: string) {
        this.store.dispatch(new Training.StartTraining(id));
    }

    completeExercise() {
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
            this.addDataToDatabase({
                ...ex,
                date: new Date(),
                state: 'completed'
            });
            this.store.dispatch(new Training.StopTraining());
        });
    }

    cancelExercise(progress: number) {
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
            this.addDataToDatabase({
                ...ex,
                duration: ex.duration * (progress / 100),
                calories: ex.calories * (progress / 100),
                date: new Date(),
                state: 'cancelled'
            });
            this.store.dispatch(new Training.StopTraining());
        });
    }

    fetchCompletedOrCancelledExercies() {
        this.fbsubs.push(
            this.db
                .collection('finisedExercises')
                .valueChanges()
                .subscribe((exercises: Exercise[]) => {
                    this.store.dispatch(new Training.SetFinishedTrainings(exercises));
                })
        );
    }

    cancelSubscriptions() {
        this.fbsubs.forEach(subs => subs.unsubscribe());
    }

    private addDataToDatabase(exercise: Exercise) {
        this.db.collection('finisedExercises').add(exercise);
    }
}
