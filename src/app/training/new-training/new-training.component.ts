import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingService } from 'src/app/services/training.service';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { Exercise } from 'src/app/models/exercise.model';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  exercises: Exercise[];
  exercisesSubscription: Subscription;
  loadingSubscription: Subscription;
  isLoading = false;
  constructor(
    private trainingService: TrainingService,
    private uiService: UIService,
  ) { }

  ngOnInit() {
    this.loadingSubscription = this.uiService.loadingStateChanged.subscribe(isLoading => this.isLoading = isLoading);
    this.exercisesSubscription = this.trainingService.exercisesChanged.subscribe(
      exercises => (this.exercises = exercises)
    );
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
    this.exercisesSubscription.unsubscribe();
  }

}
