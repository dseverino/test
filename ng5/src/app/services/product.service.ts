import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Product } from '../models/product';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { MainService } from '../utility/main.service';
import { environment } from '../../environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class ProductService {  

  constructor(private mainService: MainService) { }

  saveProduct(newProduct: Product){
    return this.mainService.sendRequest('post', environment.urls.POST_SAVE_PRODUCT, newProduct)
  }

  getProducts(): Observable<any>{
    return this.mainService.sendRequest('get', environment.urls.GET_PRODUCTS)
  }

  deleteProduct(product: Product): Observable<any> {
    return this.mainService.sendRequest('post', environment.urls.DELETE_PRODUCT, product)
  }

}
