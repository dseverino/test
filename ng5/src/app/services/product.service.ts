import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Product } from '../models/product';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class ProductService {

  private products = new BehaviorSubject<Product[]>([])

  constructor(private http : Http) {
    this.http.get('http://localhost:3000/products')
      .toPromise()
      .then(data => <Product[]> data.json())     
      .then(data => this.products.next(data)); 
  }

  saveProduct(newProduct: Product){
    return this.http.post('http://localhost:3000/products', newProduct)        
        .map(resp => <Product[]> resp.json())
        
  }

  getProducts(): BehaviorSubject<Product[]>{
    return this.products
  }

}
