import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankComponent } from './bank.component';
import { FormProductComponent } from './component/form-product/form-product.component';
import { ListProductsComponent } from './component/list-products/list-products.component';

const routes: Routes = [
  {
    path: '',
    component: ListProductsComponent,
  },
  {
    path: 'form/:id',
    component: FormProductComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankRoutingModule { }
