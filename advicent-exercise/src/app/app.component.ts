import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http/';

export class college {
  collegeName: string;
  inStateTuition: number;
  outStateTuition: number;
  roomBoard: number;

  constructor(collegeName: string, inStateTuition: number, outStateTuition: number, roomBoard: number){
    this.collegeName = collegeName;
    this.inStateTuition = inStateTuition;
    this.outStateTuition = outStateTuition;
    this.roomBoard = roomBoard;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'advicent-exercise';
}
