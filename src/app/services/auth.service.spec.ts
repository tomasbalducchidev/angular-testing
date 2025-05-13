import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
        AuthService
      ]
    });
    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController)
  });

  afterEach(() => {
    httpTesting.verify(); // verifica que no haya peticiones pendientes.
  })

  it('should be created', () => {
    // given (por ej los mocks)
    // en este caso no hay nada.

    // when (pasa algo)
    // en este caso no hay nada.

    // then (deberia pasar esto)
    expect(service).toBeTruthy();
  });

  it('deberia hacer login correctamente', async () => {
    // given
    const mockResponse = { token: 'fake-jwt-token' }

    // when
    const login$ = service.login('user@example.com', 'password123')
    const loginPromise = firstValueFrom(login$)

    const req = httpTesting.expectOne('/api/login')
    expect(req.request.method).toBe('POST')
    expect(req.request.body).toEqual({
      email: 'user@example.com',
      password: 'password123'
    })
    // En realidad esos dos expect no serian necesarios, ya que no tiene sentido testar que al hacer un post efectivamente se haga un post ya que es algo hecho por angular, yo no testeo eso.
    // Tampoco tendria mucho sentido probar que me venga el token, ya que eso es responsabilidad del backend.
    // Las cosas que uno tiene que testear son las que son responsabilidad aislada de la logica que no creó, ya sea en un servicio o componente.

    req.flush(mockResponse) // Simulamos respuesta exitosa del backend.

    // then
    expect(await loginPromise).toEqual(mockResponse)

  })
});
