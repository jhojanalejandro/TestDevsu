import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankComponent } from './bank.component';
import { AngularmaterialModule } from '../core/angularmaterial.module';
import { IconsModule } from '../core/icons/icons.module';
import { FormProductComponent } from './component/form-product/form-product.component';
import { RouterOutlet } from '@angular/router';
import { ListProductsComponent } from './component/list-products/list-products.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

describe('BankComponent', () => {
  let component: BankComponent;
  let fixture: ComponentFixture<BankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankComponent,ListProductsComponent
        ,RouterOutlet,FormProductComponent,IconsModule,
        AngularmaterialModule,
        HttpClientModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
