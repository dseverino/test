import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {DataTableModule,SharedModule} from 'primeng/primeng';
//import { CarService } from './service/car.service';
import { Car } from '../models/car';

@Component({
  selector: 'app-persongrid',
  template: `
    <p-dataTable [value]="cars" selectionMode="single" [(selection)]="selectedCar1" dataKey="vin" (onRowSelect)="handleRowSelect($event)">      
      <p-footer>
        <div style="text-align: left">
          Selected Car: {{selectedCar1 ? selectedCar1.vin + ' - ' + selectedCar1.brand + ' - ' + selectedCar1.year + ' - ' + selectedCar1.color: 'none'}}
        </div>
      </p-footer>
      <p-column field="vin" header="Vin"> </p-column>
      <p-column field="year" header="Year"> </p-column>
      <p-column field="brand" header="Brand"> </p-column>
      <p-column field="color" header="Color"> </p-column>
    </p-dataTable>
  `,
  styles: []
})
export class PersongridComponent implements OnInit {

    @Input() cars: Car[];
    @Output() selectedCar = new EventEmitter<Car>();
    car: Car;

    constructor() { }

    ngOnInit() {

    }

    handleRowSelect(event){
      this.car = event.data;      
      this.selectedCar.emit(this.car);
    }

}
