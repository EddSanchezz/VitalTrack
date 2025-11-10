import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { HealthService } from './health.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('HealthService', () => {
  let service: HealthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HealthService,
        provideHttpClient(withFetch()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(HealthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should set state to up when /health returns ok', async () => {
    const promise = service.checkOnce();
    const req = httpMock.expectOne('http://localhost:4000/health');
    expect(req.request.method).toBe('GET');
    req.flush({ status: 'ok', db: 'connected' });
    const result = await promise;
    expect(result).toBe('up');
    expect(service.state()).toBe('up');
  });

  it('should set state down on error', async () => {
    const promise = service.checkOnce();
    const req = httpMock.expectOne('http://localhost:4000/health');
    req.error(new ProgressEvent('error'), { status: 500, statusText: 'Server Error' });
    const result = await promise;
    expect(result).toBe('down');
    expect(service.state()).toBe('down');
  });
});
