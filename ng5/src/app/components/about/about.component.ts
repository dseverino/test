import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  username: string;
  goals: Observable<any>;
    
  constructor(private route: ActivatedRoute, private router: Router, private _data: DataService ) {
    //this.route.params.subscribe(res => console.log(res.id))
  }

  ngOnInit() {
    this.goals = this._data.getGoals();
    //this._data.goals.subscribe(res => console.log(res)/*this.goals = res)*/)
  }


  takeMeBack(){
    this.router.navigate([''])
  }
}
