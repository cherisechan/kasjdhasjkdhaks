import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ImageElement from '../components/ImageElement';

// Variables to hold the event handlers
let onDragStopHandler;
let onResizeStopHandler;

// Mock the react-rnd component to capture handlers and render children
vi.mock('react-rnd', () => ({
  Rnd: ({ children, ...props }) => {
    onDragStopHandler = props.onDragStop;
    onResizeStopHandler = props.onResizeStop;
    return (
      <div
        data-testid="rnd-mock"
        style={{ position: 'relative', ...props.style }}
        {...props}
      >
        {children}
      </div>
    );
  },
}));

describe('ImageElement', () => {
  const mockSetUpdateObj = vi.fn();
  const mockSetUpdateElemId = vi.fn();
  const mockOpenImageEdit = vi.fn();
  const mockSetSelectedElemId = vi.fn();
  const mockParentRef = { current: null };

  const defaultProps = {
    $imageObj: {
      id: 'test-image-1',
      type: 'image',
      src: 'https://example.com/test-image.jpg',
      altText: 'Test Image',
      width: 50,
      height: 50,
      x: 10,
      y: 10,
    },
    id: 'test-image-1',
    openImageEdit: mockOpenImageEdit,
    setUpdateObj: mockSetUpdateObj,
    setUpdateElemId: mockSetUpdateElemId,
    parentRef: mockParentRef,
    setSelectedElemId: mockSetSelectedElemId,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    onDragStopHandler = undefined;
    onResizeStopHandler = undefined;

    // Set parentRef dimensions
    mockParentRef.current = document.createElement('div');
    Object.defineProperty(mockParentRef.current, 'offsetWidth', { value: 1000 });
    Object.defineProperty(mockParentRef.current, 'offsetHeight', { value: 500 });
  });

  it('renders the image with the correct src and alt text', () => {
    render(<ImageElement {...defaultProps} />);
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/test-image.jpg');
    expect(image).toHaveAttribute('alt', 'Test Image');
  });

  it('updates position on drag stop', () => {
    render(<ImageElement {...defaultProps} />);
    const newPosition = { x: 100, y: 150 };
    onDragStopHandler(null, { x: newPosition.x, y: newPosition.y });

    const expectedXPercent = (newPosition.x / 1000) * 100; // 10% of parent width
    const expectedYPercent = (newPosition.y / 500) * 100;  // 30% of parent height

    expect(mockSetUpdateObj).toHaveBeenCalledWith({
      ...defaultProps.$imageObj,
      x: expectedXPercent,
      y: expectedYPercent,
    });
    expect(mockSetUpdateElemId).toHaveBeenCalledWith('test-image-1');
  });

  it('updates size on resize stop', () => {
    render(<ImageElement {...defaultProps} />);
    const ref = { offsetWidth: 200, offsetHeight: 300 };
    const position = { x: 50, y: 75 };
    onResizeStopHandler(null, null, ref, null, position);

    const expectedWidthPercent = (ref.offsetWidth / 1000) * 100; // 20% of parent width
    const expectedHeightPercent = (ref.offsetHeight / 500) * 100; // 60% of parent height
    const expectedXPercent = (position.x / 1000) * 100; // 5% of parent width
    const expectedYPercent = (position.y / 500) * 100; // 15% of parent height

    expect(mockSetUpdateObj).toHaveBeenCalledWith({
      ...defaultProps.$imageObj,
      width: expectedWidthPercent,
      height: expectedHeightPercent,
      x: expectedXPercent,
      y: expectedYPercent,
    });
    expect(mockSetUpdateElemId).toHaveBeenCalledWith('test-image-1');
  });

  it('renders in readonly mode with pointer-events disabled', () => {
    render(<ImageElement {...defaultProps} readOnly={true} />);
    const imageContainer = screen.getByTestId('rnd-mock');
    expect(imageContainer).toHaveStyle('pointer-events: none');
  });
});
