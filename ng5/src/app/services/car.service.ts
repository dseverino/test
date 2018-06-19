import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Car } from '../models/car';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { environment } from '../../environments/environment';


@Injectable()
export class CarService {

  private car: Car;
  private carBehaviourSubject: BehaviorSubject<Car[]> = new BehaviorSubject<Car[]>([]);

  constructor(private http: Http) {
    
    this.http.get(environment.urls.GET_CARS)
                    .toPromise()
                    .then(res => <Car[]> res.json())
                    .then(data => this.carBehaviourSubject.next(data));
  }

  /*
  getCarsSmall() {
        return this.http.get('assets/data/cars-small.json')
                    .toPromise()
                    .then(res => <Car[]> res.json().data)
                    .then(data => { return data; });
  }
  */

  getCarsSmall() {
    return this.carBehaviourSubject;
        
  }

}
