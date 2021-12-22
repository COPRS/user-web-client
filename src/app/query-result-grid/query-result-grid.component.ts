import { Component, OnInit } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { DdipService } from '../services/ddip.service';

@Component({
  selector: 'app-query-result-grid',
  templateUrl: './query-result-grid.component.html',
  styleUrls: ['./query-result-grid.component.scss'],
})
export class QueryResultGridComponent implements OnInit {
  products: any[];
  total: number;
  pageSize: number = 9;
  loading: boolean = false;

  constructor(private api: DdipService) {
    this.products = api.getExampleData(0, this.pageSize);
    this.total = api.getExampleData().length;
  }

  ngOnInit(): void {}

  refresh(state: ClrDatagridStateInterface) {
    this.products = this.api.getExampleData(state.page.from, state.page.size);
  }
}
