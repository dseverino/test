import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MainService {

  constructor(private http: HttpClient) { }

  public sendRequest(method: string, url: string, body?: any, httpHeaders?: any) : Observable<any> {
    if (method == "post") {
      return this.http[method](url, body, httpHeaders);
    }
    else {
      return this.http[method](url, body);
    }
  }
}
