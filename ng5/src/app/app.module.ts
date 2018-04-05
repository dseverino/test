import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http'

//Services
import { DataService } from './services/data.service';
import { CarService } from './services/car.service';
import { ProductService } from './services/product.service';
import { OrderService } from './services/order.service';
import { RestDataSource } from './utility/rest.datasource.service';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { PersongridComponent } from './components/persongrid.component';
import { PersonformComponent } from './components/personform.component';
import { CarParentComponent } from './components/carsparent.component';
import { ProductComponent } from './components/product/product.component';
import { OrderComponent } from './components/order/order.component';

//Primeng
import { ButtonModule, DataTableModule, SharedModule, PanelModule, InputTextModule,
  SpinnerModule, DropdownModule, DialogModule, CheckboxModule } from 'primeng/primeng';

import {TableModule} from 'primeng/table';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    PersongridComponent,
    PersonformComponent,
    CarParentComponent,
    ProductComponent,
    OrderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpModule,
    ButtonModule,
    DataTableModule,
    SharedModule,
    PanelModule,
    BrowserAnimationsModule,
    InputTextModule,
    SpinnerModule,
    DropdownModule,
    DialogModule,
    CheckboxModule,
    TableModule,
    HttpClientModule
  ],
  providers: [DataService, CarService, ProductService, OrderService, RestDataSource],
  bootstrap: [AppComponent]
})
export class AppModule { }
