import { Injectable } from '@angular/core';
import { Exercise } from '../models/exercise.model';
import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { UIService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import * as fromTraining from '../training/training.reducer';
import * as UI from '../shared/ui.actions';
import * as Training from '../training/training.actions';


@Injectable({
    providedIn: 'root'
})
export class TrainingService {

    exerciseChanged = new Subject<Exercise>();
    exercisesChanged = new Subject<Exercise[]>();
    finishExercisesChanged = new Subject<Exercise[]>();

    constructor(
        private db: AngularFirestore,
        private uiService: UIService,
        private store: Store<fromTraining.State>
    ) { }


    private fbsubs: Subscription[] = [];
    private availableExercises: Exercise[] = [];
    private runningExercise: Exercise;

    fetchAvailableExercises() {
        this.uiService.loadingStateChanged.next(true);
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
                    // this.availableExercises = excercises;
                    // this.exercisesChanged.next([...this.availableExercises]);
                    // this.uiService.loadingStateChanged.next(false);

                }, error => {
                    // this.uiService.loadingStateChanged.next(false);
                    this.store.dispatch(new UI.StopLoading());
                    this.uiService.showSnackbar('Fetching Exercises Failed, Please Try Again later!', null, 3000);
                    this.exercisesChanged.next(null);
                })
        );
    }

    startExercise(id: string) {
        // this.runningExercise = this.availableExercises.find(ex => ex.id === id);
        // this.exerciseChanged.next({ ...this.runningExercise });
        this.store.dispatch(new Training.StartTraining(id));
    }

    completeExercise() {
        this.addDataToDatabase({
            ...this.runningExercise,
            date: new Date(),
            state: 'completed'
        });
        // this.runningExercise = null;
        // this.exerciseChanged.next(null);
        this.store.dispatch(new Training.StopTraining());
    }

    cancelExercise(progress: number) {
        this.addDataToDatabase({
            ...this.runningExercise,
            duration: this.runningExercise.duration * (progress / 100),
            calories: this.runningExercise.calories * (progress / 100),
            date: new Date(),
            state: 'cancelled'
        });
        // this.runningExercise = null;
        // this.exerciseChanged.next(null);
        this.store.dispatch(new Training.StopTraining());
    }

    getRunningExercise() {
        return { ...this.runningExercise };
    }

    fetchCompletedOrCancelledExercies() {
        this.fbsubs.push(
            this.db
                .collection('finisedExercises')
                .valueChanges()
                .subscribe((exercises: Exercise[]) => {
                    // this.finishExercisesChanged.next(exercises);
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
