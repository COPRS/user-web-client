import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'user-web-client';
  selectedFeature: string = '';

  onSelectedFeatureChanged(event: any) {
    this.selectedFeature = event;
    console.log(event);
  }
}
