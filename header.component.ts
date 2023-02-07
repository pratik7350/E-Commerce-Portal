import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { product } from '../data-type';
import { ProductService } from '../services/product.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  menuType: String = 'default';
  sellerName:string ='';
  searchResult:undefined | product[];
  userName:string="";
  cartItems=0;
  constructor(private route: Router,private product:ProductService) { }

  ngOnInit(): void {

    this.route.events.subscribe((val: any) => {

      if (val.url) {

        if (localStorage.getItem('seller') && val.url.includes('seller')) {
          let sellerstore=localStorage.getItem('seller');
          let sellerData = sellerstore && JSON.parse(sellerstore)[0];
          this.sellerName = sellerData.name;
          this.menuType = 'seller';

        }
       
        // show seller name
        // if(localStorage.getItem('seller'))
        // {
        //   let sellerstore=localStorage.getItem('seller');
        //   let sellerData = sellerstore && JSON.parse(sellerstore)[0];
        //   this.sellerName = sellerData.name;
        // }
        else if(localStorage.getItem('user')){
          let userStore = localStorage.getItem('user')
          let userData = userStore && JSON.parse(userStore);
          this.userName = userData.name;
          this.menuType = 'user';
        }

        else {
          console.warn("Outside seller");
          this.menuType = 'default';
        }
      }
    });

    let cartData = localStorage.getItem('localCart') ;
    if(cartData){
      this.cartItems = JSON.parse(cartData).length
    }
    this.product.cartData.subscribe((items)=>{
      this.cartItems = items.length
    })


  }
  logout() {
    localStorage.removeItem('seller');
    this.route.navigate(['/']);
    this.product.cartData.emit([]);
  }
  userLogout()
  {
    localStorage.removeItem('user');
    this.route.navigate(['/user-auth']);
    this.product.cartData.emit([])
  }

  searchProduct(query:KeyboardEvent)
  {
    if(query)
    {
      const element = query.target as HTMLInputElement;
      console.warn(element);
      this.product.searchProducts(element.value).subscribe((result)=>{
        if(result.length>5)
        {
          result.length=5;
        }
        
        this.searchResult=result;
        

      })
    }
  }
  hideSearch()
  {
    this.searchResult=undefined;
  }
  redirectToDetails(id:number){
    this.route.navigate(['/details/'+id]);

  }

  submitsearch(val:string)
  {
    this.route.navigate([`search/${val}`])
  }

}
