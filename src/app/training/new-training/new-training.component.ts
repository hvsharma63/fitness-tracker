import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {

  @Output() trainingStart = new EventEmitter<void>();
  trainingTypes = [];
  constructor() { }

  ngOnInit() {
    this.trainingTypes = ['Crunches', 'Touch Toes', 'Side Lunges', 'Burpees'];
  }

  onStartTraining() {
    this.trainingStart.emit();
  }

}
