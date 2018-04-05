import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Product } from '../models/product';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { RestDataSource } from '../utility/rest.datasource.service';
import { environment } from '../../environments/environment';

@Injectable()
export class ProductService {

  private products = new BehaviorSubject<Product[]>([])

  constructor(private restDataSource: RestDataSource) {
    this.restDataSource.sendRequest('get', environment.urls.GET_PRODUCTS).subscribe(resp => {
      this.products.next(resp)
    })
      //.toPromise()
      //.then(data => <Product[]> data.json())
      //.then(data => this.products.next(data));
  }

  saveProduct(newProduct: Product){
    return this.restDataSource.sendRequest('post', environment.urls.POST_SAVE_PRODUCT, newProduct)
  }

  getProducts(): BehaviorSubject<Product[]>{
    return this.products
  }

}
