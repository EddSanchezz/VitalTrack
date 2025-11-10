import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UsersService } from './user.service';
import { User } from './models/user.model';

describe('UsersService (API)', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UsersService,
        provideHttpClient(withFetch()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should GET /api/usuarios', () => {
    const mock: User[] = [
      { id: 1, nombre: 'Ana', email: 'ana@example.com' }
    ] as any;
    service.getUsers().subscribe(res => {
      expect(res.length).toBe(1);
      expect(res[0].email).toBe('ana@example.com');
    });
    const req = httpMock.expectOne('/api/usuarios');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('should POST /api/usuarios', () => {
    const payload = { nombre: 'Bob', email: 'bob@example.com' } as any;
    const created = { id: 99, ...payload } as any;
    service.create(payload).subscribe(res => {
      expect(res.id).toBe(99);
    });
    const req = httpMock.expectOne('/api/usuarios');
    expect(req.request.method).toBe('POST');
    req.flush(created);
  });
});
