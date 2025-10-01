import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import { authService } from '../services/api';

// Mock the auth service
jest.mock('../services/api', () => ({
  authService: {
    login: jest.fn()
  }
}));

// Mock setIsAuthenticated function
const mockSetIsAuthenticated = jest.fn();

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form', () => {
    render(
      <BrowserRouter>
        <Login setIsAuthenticated={mockSetIsAuthenticated} />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Sign in/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  test('handles form submission', async () => {
    // Mock successful login
    (authService.login as jest.Mock).mockResolvedValueOnce({ token: 'test-token' });
    
    render(
      <BrowserRouter>
        <Login setIsAuthenticated={mockSetIsAuthenticated} />
      </BrowserRouter>
    );
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    
    // Check if login was called with correct parameters
    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  test('displays error message on login failure', async () => {
    // Mock failed login
    (authService.login as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } }
    });
    
    render(
      <BrowserRouter>
        <Login setIsAuthenticated={mockSetIsAuthenticated} />
      </BrowserRouter>
    );
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'wrongpassword' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });
});