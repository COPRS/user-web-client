import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'user-web-client';
  selectedFeature$: BehaviorSubject<string> = new BehaviorSubject<string>(
    '2134567890ß1234567890ß'
  );

  onSelectedFeatureChanged(event: any) {
    this.selectedFeature$.next(event);
  }
}
