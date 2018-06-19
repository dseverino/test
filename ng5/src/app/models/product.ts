export class Product {
    _id?;
    name?;    
    price?;

    constructor(name: String, price: String){
        this.name = name;
        this.price = price;
    }
}
