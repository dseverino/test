import { Component, OnInit, Input } from '@angular/core';
import { CarService } from '../services/car.service';
import { Car } from '../models/car';

@Component({
  selector: 'app-personform',
  template: `
  <p-panel >

    <input type="text" pInputText placeholder="Vin" style="width: 90%; margin: 10px;" [(ngModel)]="selectedCar ? selectedCar.vin : Vin">
    <input id="year" type="text" size="30" pInputText placeholder="Year" [(ngModel)]="selectedCar ? selectedCar.year : Year" style="width: 90%; margin: 10px;">
    <input id="brand" type="text" size="30" pInputText placeholder="Brand" [(ngModel)]="selectedCar ? selectedCar.brand : Brand" style="width: 90%; margin: 10px;">
    <input id="color" type="text" size="30" pInputText placeholder="Color" [(ngModel)]="selectedCar ? selectedCar.color : Color" style="width: 90%; margin: 10px;">

    <button id="disabled-btn" type="button" (click)="toggleDisabled()" pButton label="Toggle"></button>
    <p-header>
      Header content here
    </p-header>
    Body Content
    <p-footer>
      Footer content here
    </p-footer>
  </p-panel>
  `,
  styles: []
})
export class PersonformComponent implements OnInit {

  @Input() selectedCar: Car;
  test: string;

  constructor(private carService: CarService) { }

  ngOnInit() {

    //this.carService.getCarsSmall().then(cars => this.cars = cars);
  }

  toggleDisabled(){
    
  }

}
