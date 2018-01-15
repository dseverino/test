import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate, keyframes, query, stagger} from '@angular/animations';
import { DataService } from '../../services/data.service';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('goals', [
      transition('* => *', [
        query(':enter', style({opacity: 0}), {optional: true}),

        query(':enter', stagger('300ms', [
          animate('.6s ease-in', keyframes([
            style({opacity: 0, transform: 'translateY(-75%)', offset: 0}),
            style({opacity: .5, transform: 'translateY(35px)', offset: .3}),
            style({opacity: 1, transform: 'translateY(0)', offset: 1})
          ]))
        ]), {optional: true}),

        query(':leave', stagger('300ms', [
          animate('.6s ease-in', keyframes([
            style({opacity: 1, transform: 'translateY(0)', offset: 0}),
            style({opacity: .5, transform: 'translateY(35px)', offset: .3}),
            style({opacity: 0, transform: 'translateY(-75%)', offset: 1})
          ]))
        ]), {optional: true})
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {

  itemCount: number;
  btnText: string = "Add an item";
  goalText: string = "My First Goal";
  goals = [];

  constructor(private _data: DataService) { }

  ngOnInit() {
    this._data.getGoals().subscribe(res => this.goals = res)
  }

  addItem(){
    this._data.saveGoal(this.goalText).subscribe(resp => {
      this.goals.push(resp.goal);
      this.goalText = '';
      this.itemCount = this.goals.length;
    })
  }

  removeItem(index: number){
    this._data.removeGoal(index).subscribe(result => {
      this.goals.splice(index, 1)
      this.itemCount = this.goals.length;
    })
  }

  trackById(index, item){
    return index;
  }
}
