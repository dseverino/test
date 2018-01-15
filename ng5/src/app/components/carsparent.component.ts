import { Component, OnInit } from '@angular/core';
import {ButtonModule} from 'primeng/primeng';
import { CarService } from '../services/car.service';
import { Car } from '../models/car';

@Component({
  selector: 'carsparent',
  template: `
    <div class="parentContainer">
      <div class="childContainer">
        <app-persongrid [cars] = cars (selectedCar)="carWasSelected($event)"></app-persongrid>
      </div>
      <div class="childContainer">
        <app-personform [selectedCar]="selectedCar"></app-personform>
      </div>
    </div>`,
  styleUrls: ['./carsparent.component.scss']
})
export class CarParentComponent implements OnInit {

  cars: Car[];
  selectedCar: Car;

  constructor(private carService: CarService) {  }

  ngOnInit() {
    this.carService.getCarsSmall().subscribe(data => this.cars = data);
  }

  onclick(){
    console.log('you clicked me')
  }

  carWasSelected(car: Car){
    this.selectedCar = car;
  }

}
