import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'inr', standalone: true })
export class InrPipe implements PipeTransform {
  transform(value: number | undefined | null, showSymbol: boolean = true): string {
    if (value === null || value === undefined) return showSymbol ? '₹0' : '0';
    const formatted = value.toLocaleString('en-IN');
    return showSymbol ? `₹${formatted}` : formatted;
  }
}
