import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';

import { DataService } from './services/data.service';
import { CarService } from './services/car.service';
import { ProductService } from './services/product.service';
import { OrderService } from './services/order.service';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { PersongridComponent } from './components/persongrid.component';
import { PersonformComponent } from './components/personform.component';

import {ButtonModule} from 'primeng/primeng';
import {DataTableModule,SharedModule} from 'primeng/primeng';
import {PanelModule} from 'primeng/primeng';
import {InputTextModule} from 'primeng/primeng';
import { CarParentComponent } from './components/carsparent.component';
import { ProductComponent } from './components/product/product.component';
import { OrderComponent } from './components/order/order.component';
import { SpinnerModule } from 'primeng/primeng';
import { DropdownModule } from 'primeng/primeng';


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
    DropdownModule
  ],
  providers: [DataService, CarService, ProductService, OrderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
