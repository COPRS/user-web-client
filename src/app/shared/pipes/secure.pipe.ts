import { HttpClient } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'secure',
})
export class SecurePipe implements PipeTransform {
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  transform(url): Observable<SafeUrl> {
    return this.http.get(url, { responseType: 'blob' }).pipe(
      map((val) => {
        console.log(val);

        console.log(
          this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(val))
        );

        return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(val));
      })
    );
  }
}
