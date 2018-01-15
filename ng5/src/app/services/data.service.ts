import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Goal } from '../models/goal';


@Injectable()
export class DataService {

  private goals = new BehaviorSubject<Goal[]>([])

  constructor(private http : Http) {
    this.http.get('http://localhost:3000/goals')
      .toPromise()
      .then(data => <Goal[]> data.json())
      .then(data => this.goals.next(data));
  }

  getGoals(): BehaviorSubject<Goal[]>{
    return this.goals;
  }

  saveGoal(goal: string): Observable<Goal>{
    let newGoal = new Goal(goal);
    return this.http.post('http://localhost:3000/goals', newGoal).map(res => res.json());
  }

  removeGoal(index: number){
    const id = this.goals.getValue()[index]._id
    return this.http.delete('http://localhost:3000/goals/' + id ).map(res => res.json());
  }
}
