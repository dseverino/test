import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  private products: Product[] = [];
  qty: Number = 1;
  productName: string;
  selectedProduct: Product;

  constructor(private _productService: ProductService) { }

  ngOnInit() {
    this._productService.getProducts().subscribe(data => {
      this.products = data['products'];
    });
  }

  handleRowSelect(event) {
    this.productName = event.data.name;
  }

  addOrder() {
    console.log(this.selectedProduct);
  }

  onCancel() {

  }

  clicked() {
    console.log('clicked');
  }

  onRefreshClick(event){
    console.log(event)
  }

}
