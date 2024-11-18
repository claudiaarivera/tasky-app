import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentageFromTotal',
  standalone: true
})
export class PercentageFromTotalPipe implements PipeTransform {

  transform(value: number, total: number): string | null{
    if (total === 0 || value > total) return null;
    const percent = value/total * 100;
    return percent.toFixed(0);
  }

}
