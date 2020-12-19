import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http/';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Observable, fromEvent } from 'rxjs';
import {map, startWith, debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';

export class college {
  collegeName: string;
  inStateTuition: number;
  outStateTuition: any;
  roomBoard: number;

  constructor(collegeName: string, inStateTuition: number, outStateTuition: any, roomBoard: number){
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
  filteredOptions: Observable<college[]>;
  collegeForm: FormGroup = this.formBuilder.group({
    collegeSelection: '',
    inTuition: '',
    outTuition: '',
    roomBoard: ''
  });
  cost: 0;
  includeIn = true;
  includeOut = false;
  includeRoom = false;

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
      return this.colleges.filter(option => option.collegeName.toLowerCase().includes(value));
    }
    return this.colleges;
  }

  getValues(collegeName){
    var selected = this.colleges.filter(option => option.collegeName.includes(collegeName));
    this.collegeForm.get('inTuition').setValue(selected[0]['inStateTuition']);
    this.collegeForm.get('roomBoard').setValue(selected[0]['roomBoard']);
    if(isNaN(selected[0]['outStateTuition'])){
      this.collegeForm.get('outTuition').setValue(0);
    }
    else {
      this.collegeForm.get('outTuition').setValue(selected[0]['outStateTuition']);
    }
    if(isNaN(selected[0]['roomBoard'])){
      this.collegeForm.get('roomBoard').setValue(0);
    }
    else {
      this.collegeForm.get('roomBoard').setValue(selected[0]['roomBoard']);
    }
    this.totalCostCalc();
  }

  includeRoomCost(isChecked:boolean ){
    if(isChecked){
      this.cost = this.collegeForm.get('roomBoard').value + this.collegeForm.get('inTuition').value;
      console.log(this.cost);
    }
    if(!isChecked) {
      this.cost = this.collegeForm.get('inTuition').value;
    }
  }

  includeOutCost(isChecked:boolean ){
    if(isChecked){
      this.cost = this.collegeForm.get('roomBoard').value + this.collegeForm.get('outTuition').value;
      console.log(this.cost);
    }
    if(!isChecked) {
      this.cost = this.collegeForm.get('inTuition').value;
    }
  }


  totalCostCalc(){
    if(this.includeIn == true && this.includeRoom == true){
      this.cost = this.collegeForm.get('roomBoard').value + this.collegeForm.get('inTuition').value;
      console.log(this.cost);
    }
    else if(this.includeOut == true && this.includeRoom == true){
      this.cost = this.collegeForm.get('roomBoard').value + this.collegeForm.get('outTuition').value;
    }
    else if(this.includeOut == true && this.includeRoom == false){
      this.cost = this.collegeForm.get('outTuition').value;
    }
    else{
      this.cost = this.collegeForm.get('inTuition').value;
    }
    console.log(this.cost);
  }
}
