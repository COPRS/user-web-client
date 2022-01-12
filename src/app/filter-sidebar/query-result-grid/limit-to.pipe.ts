import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'limitTo' })
export class LimitToPipe implements PipeTransform {
  transform(text: string = '', length: number = null): string {
    if (typeof text !== 'string') {
      return '?';
    }

    if (typeof length === 'number' && text.length >= length) {
      return text.substring(0, length) + '...';
    } else {
      return text;
    }
  }
}
