import { Injectable } from '@angular/core';
import { Exercise } from '../models/exercise.model';
import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class TrainingService {

    exerciseChanged = new Subject<Exercise>();
    exercisesChanged = new Subject<Exercise[]>();
    finishExercisesChanged = new Subject<Exercise[]>();

    constructor(private db: AngularFirestore) { }


    private fbsubs: Subscription[] = [];
    private availableExercises: Exercise[] = [];
    private runningExercise: Exercise;

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
                    this.availableExercises = excercises;
                    this.exercisesChanged.next([...this.availableExercises]);
                })
        );
    }

    startExercise(id: string) {
        this.runningExercise = this.availableExercises.find(ex => ex.id === id);
        this.exerciseChanged.next({ ...this.runningExercise });
    }

    completeExercise() {
        this.addDataToDatabase({
            ...this.runningExercise,
            date: new Date(),
            state: 'completed'
        });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    cancelExercise(progress: number) {
        this.addDataToDatabase({
            ...this.runningExercise,
            duration: this.runningExercise.duration * (progress / 100),
            calories: this.runningExercise.calories * (progress / 100),
            date: new Date(),
            state: 'cancelled'
        });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
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
                    this.finishExercisesChanged.next(exercises);
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
