import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http/';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith } from 'rxjs/operators';

// Create college class to hold data from csv as an object
export class college {
  collegeName: string;
  inStateTuition: number;
  outStateTuition: any;
  roomBoard: number;

  // initialize class
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
  // Observable so changes can be emmited to front end
  filteredOptions: Observable<college[]>;
  
  // Form to hold college data once selected, easily show changes in the UI
  collegeForm: FormGroup = this.formBuilder.group({
    collegeSelection: '',
    inTuition: '',
    outTuition: '',
    roomBoard: ''
  });
  
  cost: 0;
  // in state tuition is shown as the default, so will be true unless out of state is selected
  includeIn = true;
  includeOut = false;
  includeRoom = false;

  constructor(private http: HttpClient, private formBuilder: FormBuilder){
    this.http.get('assets/college_costs.csv', {responseType: 'text'})
    .subscribe(
        data => {
            // Each new line is a new college, add to an array
            let csvToRowArray = data.split("\n");
            // Iterate through array of colleges from CSV
            for (let index = 1; index < csvToRowArray.length - 1; index++) {
              // Split at a comma while still allowing college names to include commas in the official title
              let row = csvToRowArray[index].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
              //row[index].replace(/"/g, '');

              // Add to array of college objects
              this.colleges.push(new college(row[0].trim().replace(/"/g, ''), parseInt(row[1]), parseInt(row[2]), parseInt(row[3])));
            }
        },
        error => {
            console.log(error);
        }
    );
  }

  ngOnInit() {
    // Get value changes from input on autocomplete as an observable
    this.filteredOptions = this.collegeForm.get('collegeSelection')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterGroup(value))
      );
  }

  private _filterGroup(value: string): college[] {
    // filters college array based on what is entered in the autocomplete
    if (value) {
      return this.colleges.filter(option => option.collegeName.toLowerCase().includes(value));
    }
    return this.colleges;
  }

  getValues(collegeName){
    // Grabs the selected value from user input, 
    var selected = this.colleges.filter(option => option.collegeName.includes(collegeName));
    // sets form values based off of the properties for the college selected by user
    this.collegeForm.get('inTuition').setValue(selected[0]['inStateTuition']);
    this.collegeForm.get('roomBoard').setValue(selected[0]['roomBoard']);

    // if the value is null, set it to 0 to help with the addition costs
    isNaN(selected[0]['outStateTuition']) 
    ? this.collegeForm.get('outTuition').setValue(0) 
    : this.collegeForm.get('outTuition').setValue(selected[0]['outStateTuition']);

    isNaN(selected[0]['roomBoard']) 
    ? this.collegeForm.get('roomBoard').setValue(0) 
    : this.collegeForm.get('roomBoard').setValue(selected[0]['roomBoard']);
    
    this.totalCostCalc();
  }

  // Checks if boxes are checked, calculates based off of selection
  includeRoomCost(isChecked: boolean){
    this.includeRoom = isChecked ? true : false;
    this.totalCostCalc();
  }

  includeOutCost(isChecked: boolean){
    this.includeOut = isChecked ? true : false;
    this.includeIn = isChecked ? false : true;
    this.totalCostCalc();
  }

  // If zero, pipe as a currency. If not, show as a string that uses a custom pipe
  checkIfZero(value){
    switch(value){
      case 0:
        return false;
      default:
        return value;
    }
  }


  totalCostCalc(){
    // Calculates cost based on user input
    if(this.includeIn && this.includeRoom){
      this.cost = this.collegeForm.get('roomBoard').value + this.collegeForm.get('inTuition').value;
    }
    else if(this.includeOut && this.includeRoom){
      if(this.collegeForm.get('outTuition').value == 0){
        // If the out state cost is zero, need to include in state tution as a default
        this.cost = this.collegeForm.get('roomBoard').value + this.collegeForm.get('inTuition').value;
      }
      else {
        this.cost = this.collegeForm.get('roomBoard').value + this.collegeForm.get('outTuition').value;
      }
    }
    else if(this.includeOut && !this.includeRoom){
      // If the out state cost is zero, need to include in state tution as a default
      if(this.collegeForm.get('outTuition').value == 0){
        this.cost = this.collegeForm.get('inTuition').value;
      }
      else {
        this.cost = this.collegeForm.get('outTuition').value;
      }
    }
    // in state tuition is always default
    else{
      this.cost = this.collegeForm.get('inTuition').value;
    }
  }
}
