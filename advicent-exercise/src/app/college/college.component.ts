import { Component, OnInit } from '@angular/core';
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
  selector: 'app-college',
  templateUrl: './college.component.html',
  styleUrls: ['./college.component.scss']
})
export class CollegeComponent implements OnInit {
  colleges: college[] = [];

  constructor(private http: HttpClient){
    this.http.get('assets/college_costs.csv', {responseType: 'text'})
    .subscribe(
        data => {
            let csvToRowArray = data.split("\n");
            for (let index = 1; index < csvToRowArray.length - 1; index++) {
              let row = csvToRowArray[index].split(",");
              this.colleges.push(new college(row[0].trim(), parseInt(row[1]), parseInt(row[2]), parseInt(row[3])));
            }
        },
        error => {
            console.log(error);
        }
    );
  }

  ngOnInit(): void {
  }

}
