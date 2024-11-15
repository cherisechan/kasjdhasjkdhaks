import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../components/Navbar';
import { useNavigate, useLocation } from 'react-router-dom';
import { vi } from 'vitest';

// Mock react-router-dom hooks
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useLocation: vi.fn(),
}));

describe('Navbar', () => {
  let mockNavigate;
  let mockLocation;

  beforeEach(() => {
    mockNavigate = vi.fn();
    mockLocation = { pathname: '/' };
    useNavigate.mockReturnValue(mockNavigate);
    useLocation.mockReturnValue(mockLocation);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when on preview page', () => {
    mockLocation.pathname = '/preview/123';
    render(<Navbar isLoggedIn={false} onLogout={vi.fn()} />);
    expect(screen.queryByText('Presto')).not.toBeInTheDocument();
  });

  it('does not show buttons on login page', () => {
    mockLocation.pathname = '/login';
    render(<Navbar isLoggedIn={false} onLogout={vi.fn()} />);
    expect(screen.getByText('Presto')).toBeInTheDocument();
    expect(screen.queryByText('Log In')).not.toBeInTheDocument();
    expect(screen.queryByText('Register')).not.toBeInTheDocument();
  });

  it('does not show buttons on register page', () => {
    mockLocation.pathname = '/register';
    render(<Navbar isLoggedIn={false} onLogout={vi.fn()} />);
    expect(screen.getByText('Presto')).toBeInTheDocument();
    expect(screen.queryByText('Log In')).not.toBeInTheDocument();
    expect(screen.queryByText('Register')).not.toBeInTheDocument();
  });

  it('shows Log In and Register buttons when not logged in', () => {
    mockLocation.pathname = '/somepage';
    render(<Navbar isLoggedIn={false} onLogout={vi.fn()} />);
    expect(screen.getByText('Log In')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('shows Logout button when logged in', () => {
    mockLocation.pathname = '/dashboard';
    render(<Navbar isLoggedIn={true} onLogout={vi.fn()} />);
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('calls onLogout and navigates to "/" when Logout button is clicked', () => {
    const mockOnLogout = vi.fn();
    mockLocation.pathname = '/dashboard';
    render(<Navbar isLoggedIn={true} onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByText('Logout'));
    expect(mockOnLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates to "/" when clicking the "Presto" button', () => {
    mockLocation.pathname = '/dashboard';
    render(<Navbar isLoggedIn={false} onLogout={vi.fn()} />);
    fireEvent.click(screen.getByText('Presto'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates to "/login" when clicking the "Log In" button', () => {
    mockLocation.pathname = '/somepage';
    render(<Navbar isLoggedIn={false} onLogout={vi.fn()} />);
    fireEvent.click(screen.getByText('Log In'));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('navigates to "/register" when clicking the "Register" button', () => {
    mockLocation.pathname = '/somepage';
    render(<Navbar isLoggedIn={false} onLogout={vi.fn()} />);
    fireEvent.click(screen.getByText('Register'));
    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });
});
