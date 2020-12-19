import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http/';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Observable, fromEvent } from 'rxjs';
import {map, startWith, debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';

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
  @ViewChild('input', { static: false }) input: ElementRef;
  filteredOptions: Observable<college[]>;
  collegeForm: FormGroup = this.formBuilder.group({
    collegeSelection: '',
    inTuition: '',
    outTuition: '',
    roomBoard: ''
  });

  constructor(private http: HttpClient, private formBuilder: FormBuilder){
    this.http.get('assets/college_costs.csv', {responseType: 'text'})
    .subscribe(
        data => {
            let csvToRowArray = data.split("\n");
            for (let index = 1; index < csvToRowArray.length - 1; index++) {
              let row = csvToRowArray[index].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
              this.colleges.push(new college(row[0].trim(), parseInt(row[1]), parseInt(row[2]), parseInt(row[3])));
            }
        },
        error => {
            console.log(error);
        }
    );
  }

  ngOnInit() {
    this.filteredOptions = this.collegeForm.get('collegeSelection')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterGroup(value))
      );
  }

  private _filterGroup(value: string): college[] {
    if (value) {
      var test = this.colleges.filter(option => option.collegeName.toLowerCase().includes(value));
      console.log(test.values);
      console.log(test[1]);
      return test;
    }
    return this.colleges;
  }

  getCostValues(value){
    let test = this._filterGroup(value);
    this.collegeForm.get('inTuition').setValue(test[1]);
  }

}
