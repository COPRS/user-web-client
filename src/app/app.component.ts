import { Component } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'user-web-client';
  selectedFeature$: BehaviorSubject<String> = new BehaviorSubject<String>(
    '2134567890ß1234567890ß'
  );

  onSelectedFeatureChanged(event: any) {
    this.selectedFeature$.next(event);
  }
}
