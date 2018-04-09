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

  private products = new BehaviorSubject<Product[]>([])

  constructor(private mainService: MainService) {
    this.mainService.sendRequest('get', environment.urls.GET_PRODUCTS).subscribe(resp => {
      this.products.next(resp)
    })
      //.toPromise()
      //.then(data => <Product[]> data.json())
      //.then(data => this.products.next(data));
  }

  saveProduct(newProduct: Product){
    return this.mainService.sendRequest('post', environment.urls.POST_SAVE_PRODUCT, newProduct)
  }

  getProducts(): BehaviorSubject<Product[]>{
    return this.products
  }

  deleteProduct(product: Product): Observable<any> {
    return this.mainService.sendRequest('post', environment.urls.DELETE_PRODUCT, product)
  }

}
