import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EditThumbnailModal from '../components/EditThumbnailModal';

describe('EditThumbnailModal', () => {
  const mockOnFileChange = vi.fn();
  const mockOnRemoveThumbnail = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the modal with all elements', () => {
    render(
      <EditThumbnailModal
        onFileChange={mockOnFileChange}
        onRemoveThumbnail={mockOnRemoveThumbnail}
        onCancel={mockOnCancel}
      />
    );

    // Check for modal elements
    expect(screen.getByText('Edit Thumbnail')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove Thumbnail' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();

    // Query file input directly
    const fileInput = screen.getByLabelText('Choose file');
    expect(fileInput).toHaveAttribute('type', 'file');
  });

  it('calls onFileChange when a file is selected', () => {
    render(
      <EditThumbnailModal
        onFileChange={mockOnFileChange}
        onRemoveThumbnail={mockOnRemoveThumbnail}
        onCancel={mockOnCancel}
      />
    );

    // Query file input directly
    const fileInput = screen.getByLabelText('Choose file'); // Replace 'Choose file' with the actual accessible label if it differs
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(mockOnFileChange).toHaveBeenCalledTimes(1);
    expect(mockOnFileChange).toHaveBeenCalledWith(expect.any(Object));
  });

  it('calls onRemoveThumbnail when the "Remove Thumbnail" button is clicked', () => {
    render(
      <EditThumbnailModal
        onFileChange={mockOnFileChange}
        onRemoveThumbnail={mockOnRemoveThumbnail}
        onCancel={mockOnCancel}
      />
    );

    const removeButton = screen.getByRole('button', { name: 'Remove Thumbnail' });
    fireEvent.click(removeButton);

    expect(mockOnRemoveThumbnail).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when the "Cancel" button is clicked', () => {
    render(
      <EditThumbnailModal
        onFileChange={mockOnFileChange}
        onRemoveThumbnail={mockOnRemoveThumbnail}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onFileChange when the "Save" button is clicked', () => {
    render(
      <EditThumbnailModal
        onFileChange={mockOnFileChange}
        onRemoveThumbnail={mockOnRemoveThumbnail}
        onCancel={mockOnCancel}
      />
    );

    const saveButton = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(saveButton);

    expect(mockOnFileChange).toHaveBeenCalledTimes(1);
  });
});
