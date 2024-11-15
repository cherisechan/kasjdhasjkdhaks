import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import SlideRearrange from '../components/SlideRearrange'

vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children, onDragEnd }) => {
    const mockHandleDragEnd = () => {
      onDragEnd({
        active: { id: 'slide1' },
        over: { id: 'slide3' },
      });
    };
    return (
      <div data-testid="dnd-context" onDragEnd={mockHandleDragEnd}>
        {children}
      </div>
    );
  },
  closestCenter: vi.fn(),
}))

vi.mock('@dnd-kit/sortable', () => ({
  arrayMove: vi.fn((arr, from, to) => {
    const result = Array.from(arr)
    const [removed] = result.splice(from, 1)
    result.splice(to, 0, removed)
    return result
  }),
  SortableContext: ({ children }) => <div data-testid="sortable-context">{children}</div>,
}))

vi.mock('../components/Sortable', () => ({
  default: ({ id, index }) => <div data-testid={`sortable-${id}`}>{index}</div>
}))

describe('SlideRearrange', () => {
  const mockPresentation = {
    slides: [
      { id: 'slide1', content: 'Slide 1' },
      { id: 'slide2', content: 'Slide 2' },
      { id: 'slide3', content: 'Slide 3' },
    ],
    fontFamily: 'Arial'
  }

  const mockSavePresentation = vi.fn()
  const mockSetRearrange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all slides', () => {
    render(
      <SlideRearrange
        presentation={mockPresentation}
        savePresentation={mockSavePresentation}
        setRearrange={mockSetRearrange}
      />
    )

    mockPresentation.slides.forEach((slide) => {
      expect(screen.getByTestId(`sortable-${slide.id}`)).toBeInTheDocument()
    })
  })

  it('calls setRearrange when back button is clicked', () => {
    render(
      <SlideRearrange
        presentation={mockPresentation}
        savePresentation={mockSavePresentation}
        setRearrange={mockSetRearrange}
      />
    )

    const backButton = screen.getByText('Back')
    fireEvent.click(backButton)

    expect(mockSetRearrange).toHaveBeenCalledWith(false)
  })

  it('updates slide order on drag end', async () => {
    render(
      <SlideRearrange
        presentation={mockPresentation}
        savePresentation={mockSavePresentation}
        setRearrange={mockSetRearrange}
      />
    );

    // simulate drag end
    const dndContext = screen.getByTestId('dnd-context');
    fireEvent.dragEnd(dndContext);

    await waitFor(() => {
      expect(mockSavePresentation).toHaveBeenCalledTimes(1);
    });

    // verify the updated order
    const updatedPresentation = mockSavePresentation.mock.calls[0][0];
    expect(updatedPresentation.slides).toEqual([
      { id: 'slide2', content: 'Slide 2' },
      { id: 'slide3', content: 'Slide 3' },
      { id: 'slide1', content: 'Slide 1' },
    ]);
  });
});
