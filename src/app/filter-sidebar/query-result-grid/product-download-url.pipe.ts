import { Pipe, PipeTransform } from '@angular/core';
import { DdipService } from 'src/app/services/ddip/ddip.service';
import { DdipProduct } from 'src/app/services/models/DdipProductResponse';

@Pipe({ name: 'productDownloadUrl' })
export class ProductDownloadUrlPipe implements PipeTransform {
  constructor(private ddipService: DdipService) {}

  transform(product?: DdipProduct): string {
    if (product?.Id) {
      return this.ddipService.constructDownloadUrl(product.Id);
    } else {
      return '';
    }
  }
}
