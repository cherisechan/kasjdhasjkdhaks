import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateModal from '../components/CreateModal';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Mock axios
vi.mock('axios');

// Mock useNavigate from react-router-dom
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: vi.fn(),
}));

describe('CreateModal Component', () => {
  const setShowCreate = vi.fn();
  const navigate = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
    useNavigate.mockReturnValue(navigate);
  });

  it('redirects to /login if token is not in localStorage', () => {
    render(<CreateModal setShowCreate={setShowCreate} />);

    expect(navigate).toHaveBeenCalledWith('/login');
  });

  it('renders correctly when token is present', () => {
    localStorage.setItem('token', 'test-token');
    render(<CreateModal setShowCreate={setShowCreate} />);

    expect(screen.getByText('Create a presentation')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Name of your presentation*')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Description of your presentation')).toBeInTheDocument();
  });

  it('shows error when name is empty', async () => {
    localStorage.setItem('token', 'test-token');
    render(<CreateModal setShowCreate={setShowCreate} />);

    fireEvent.click(screen.getByText('CREATE'));
    expect(await screen.findByText('Requires a name')).toBeInTheDocument();
  });

  it('creates a presentation successfully', async () => {
    localStorage.setItem('token', 'test-token');
    const mockGetResponse = { data: { store: { presentations: [] } } };
    axios.get.mockResolvedValueOnce(mockGetResponse);
    axios.put.mockResolvedValueOnce({});

    render(<CreateModal setShowCreate={setShowCreate} />);

    fireEvent.change(
      screen.getByPlaceholderText('Name of your presentation*'),
      { target: { value: 'My Presentation' } }
    );
    fireEvent.change(
      screen.getByPlaceholderText('Description of your presentation'),
      { target: { value: 'This is a test presentation.' } }
    );

    fireEvent.click(screen.getByText('CREATE'));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:5005/store', expect.any(Object));
      expect(axios.put).toHaveBeenCalled();
      expect(setShowCreate).toHaveBeenCalledWith(false);
    });
  });
});
