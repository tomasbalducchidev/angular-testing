import { LoginComponent } from './login.component';
import { AuthService } from '../services/auth.service';
import { of, throwError } from 'rxjs';
import { render, screen } from "@testing-library/angular";
import { userEvent } from "@testing-library/user-event"

describe('LoginComponent', () => {
  let authServiceMock: jest.Mocked<AuthService>

  beforeEach(async () => {
    authServiceMock = {
      login: jest.fn()
    } as unknown as jest.Mocked<AuthService>

    delete (window as any).location
    window.location = { href: '' } as any
  });

  it('deberia redirigir al dashboard en login exitoso', async () => {
    // given
    authServiceMock.login.mockReturnValueOnce(of({ token: 'fake-jwt-token' }))

    await render(LoginComponent, {
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ]
    })

    // when
    await userEvent.type(screen.getByPlaceholderText('Email'), 'user@example.com')
    await userEvent.type(screen.getByPlaceholderText('Password'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /login/i }))

    // O usando fireEvent:
    // fireEvent.input(screen.getByPlaceholderText('Email'), { target: { value: 'user@example.com'}})
    // fireEvent.input(screen.getByPlaceholderText('Password'), { target: { value: 'password123'}})
    // fireEvent.click(screen.getByRole('button', { name: /login/i }))

    // then
    expect(authServiceMock.login).toHaveBeenCalledWith('user@example.com', 'password123')
    expect(window.location.href).toBe('/dashboard')
  });

  it('deberia dar un error en login fallido', async () => {
    // given
    authServiceMock.login.mockReturnValueOnce(throwError(() => ({ error: { message: 'Invalid email or password'}})))

    await render(LoginComponent, {
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ]
    })

    // when
    await userEvent.type(screen.getByPlaceholderText('Email'), 'user@example.com')
    await userEvent.type(screen.getByPlaceholderText('Password'), 'wrongPassword')
    await userEvent.click(screen.getByRole('button', { name: /login/i }))

    // O usando fireEvent:
    // fireEvent.input(screen.getByPlaceholderText('Email'), { target: { value: 'user@example.com'}})
    // fireEvent.input(screen.getByPlaceholderText('Password'), { target: { value: 'wrongPassword'}})
    // fireEvent.click(screen.getByRole('button', { name: /login/i }))

    // then
    expect(authServiceMock.login).toHaveBeenCalledWith('user@example.com', 'wrongPassword')
    const errorMessage = await screen.findByText('Invalid email or password')
    expect(errorMessage).toBeTruthy()
  });
});
