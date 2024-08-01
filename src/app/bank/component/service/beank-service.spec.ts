import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BankService } from './bank.service';
import { HttpClientModule } from '@angular/common/http';
import { Product } from '../../model/bank-model';
import Swal from 'sweetalert2';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ListProductsComponent', () => {
  let bankService : BankService;
  beforeEach(async () => {
    TestBed.configureTestingModule({imports: [HttpClientModule]})
    bankService = TestBed.inject(BankService)
  });

  it('should create', () => {
    expect(bankService).toBeTruthy();
  });
});

describe('BankService', () => {
  let service: BankService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:3002/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BankService]
    });

    service = TestBed.inject(BankService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all products', () => {
    const dummyProducts: Product[] = [
      {
        id: 'uno',
        name: 'Cuenta de Ahorros',
        description: 'Cuenta de ahorro con beneficios de intereses competitivos.',
        logo: 'https://example.com/logos/cuenta_ahorros.png',
        date_release: new Date('2023-01-01'),
        date_revision: new Date('2024-01-01'),
      },
      {
        id: 'dos',
        name: 'Tarjeta de Crédito',
        description: 'Tarjeta de crédito con recompensas por cada compra.',
        logo: 'https://example.com/logos/tarjeta_credito.png',
        date_release: new Date('2023-02-01'),
        date_revision: new Date('2024-02-01'),
      },
      {
        id: 'tres',
        name: 'Préstamo Personal',
        description: 'Préstamo personal con tasas de interés bajas.',
        logo: 'https://www.bbva.com/wp-content/uploads/2022/05/tarjetas_bbva.jpg',
        date_release: new Date('2023-03-01'),
        date_revision: new Date('2024-03-01'),
      },
      {
        id: 'cuatro',
        name: 'Hipoteca',
        description: 'Hipoteca con plazos flexibles y tasas de interés competitivas.',
        logo: 'https://example.com/logos/hipoteca.png',
        date_release: new Date('2023-04-01'),
        date_revision: new Date('2024-04-01'),
      },
      {
        id: 'cinco',
        name: 'Cuenta Corriente',
        description: 'Cuenta corriente con servicios de banca en línea y móvil.',
        logo: 'https://example.com/logos/cuenta_corriente.png',
        date_release: new Date('2023-05-01'),
        date_revision: new Date('2024-05-01'),
      }
    ];

    service.getProducts().subscribe(products => {
      expect(products.length).toBe(5);
      expect(products).toEqual(dummyProducts);
    });

    const req = httpMock.expectOne(apiUrl+'bp/products');
    expect(req.request.method).toBe('GET');
    req.flush(dummyProducts);
  });


  it('should add a new product', () => {
    const newProduct: Product ={
      id: 'tres',
      name: 'Préstamo Personal',
      description: 'Préstamo personal con tasas de interés bajas.',
      logo: 'https://www.bbva.com/wp-content/uploads/2022/05/tarjetas_bbva.jpg',
      date_release: new Date('2023-03-01'),
      date_revision: new Date('2024-03-01'),
    };

    service.saveProduct(newProduct).subscribe(product => {
      expect(product).toEqual(newProduct);
    });

    const req = httpMock.expectOne(apiUrl+'bp/products');
    expect(req.request.method).toBe('POST');
    req.flush(newProduct);
  });

  it('should update a product', () => {
    const updatedProduct: Product = { id: '1', name: 'Updated Product', description: 'Updated Description', logo: '',date_release: new Date(),date_revision: new Date() };

    service.updateProduct(updatedProduct).subscribe(product => {
      expect(product).toEqual(updatedProduct);
    });

    const req = httpMock.expectOne(`${apiUrl }bp/products/${updatedProduct.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedProduct);
  });

  it('should delete a product', () => {
    const productId = 'tres';

    service.deleteProduct(productId).subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${apiUrl}bp/products/${productId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should verify a product', () => {
    const productId = '1';
    const verificationResponse = { status: 'verified' };

    service.verifyProduct(productId).subscribe(response => {
      expect(response).toEqual(verificationResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}bp/products/verification/${productId}`);
    expect(req.request.method).toBe('GET');
    req.flush(verificationResponse);
  });
});
