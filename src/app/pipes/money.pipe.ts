import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'money'
})
export class MoneyPipe implements PipeTransform {

  transform(ammount: number): string {
    return ammount.toFixed(2).replace(".", ",") + " €";
  }

}
