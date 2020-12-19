import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'handleZero'
})
export class HandleZeroPipe implements PipeTransform  {
  
  transform(value: any) {
    if(value == 0){
      return "N/A";
    }
    return value;
  }

}
