import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCardModule} from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';





@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatCardModule,
    HttpClientModule
  ],
  exports: [
    CommonModule,
    MatAutocompleteModule,
    MatCardModule,
    HttpClientModule
  ]
})
export class SharedModule { }
