import { Routes } from '@angular/router';
import { BankComponent } from './bank/bank.component';

export const routes: Routes = [
  {path: '', pathMatch : 'full', redirectTo: 'bancos'},
  {
    path: '',
    component: BankComponent,
    children: [
      {
        path: 'bancos',
        loadChildren: () => import('../app/bank/bank-routing.module').then(r => r.BankRoutingModule)
      },
    ]
  },
];
