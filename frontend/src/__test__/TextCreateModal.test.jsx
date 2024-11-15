import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TextCreateModal from '../components/TextCreateModal'

describe('TextCreateModal', () => {
  const mockSetTextElem = vi.fn()
  const mockSetTextSubmit = vi.fn()
  const mockSetShowTextCreateModal = vi.fn()

  const renderComponent = () => {
    render(
      <TextCreateModal
        setTextElem={mockSetTextElem}
        setTextSubmit={mockSetTextSubmit}
        setShowTextCreateModal={mockSetShowTextCreateModal}
      />
    )
  }

  it('renders the modal with all input fields', () => {
    renderComponent()

    expect(screen.getByText('Add a text box')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter width (%)')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter height (%)')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter font size (em)')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter HEX code (e.g. #FFFFFF)')).toBeInTheDocument()
  })

  it('displays an error when submitting with empty text', () => {
    renderComponent()

    fireEvent.click(screen.getByText('Submit'))

    expect(screen.getByText('Text cannot be empty')).toBeInTheDocument()
  })

  it('displays an error when submitting with invalid width', () => {
    renderComponent()

    fireEvent.change(screen.getByPlaceholderText('Enter text'), { target: { value: 'Test Text' } })
    fireEvent.change(screen.getByPlaceholderText('Enter width (%)'), { target: { value: '101' } })
    fireEvent.click(screen.getByText('Submit'))

    expect(screen.getByText('Size must be a number between 0 and 100')).toBeInTheDocument()
  })

  it('displays an error when submitting with invalid height', () => {
    renderComponent()

    fireEvent.change(screen.getByPlaceholderText('Enter text'), { target: { value: 'Test Text' } })
    fireEvent.change(screen.getByPlaceholderText('Enter width (%)'), { target: { value: '50' } })
    fireEvent.change(screen.getByPlaceholderText('Enter height (%)'), { target: { value: '-1' } })
    fireEvent.click(screen.getByText('Submit'))

    expect(screen.getByText('Size must be a number between 0 and 100')).toBeInTheDocument()
  })

  it('displays an error when submitting with invalid font size', () => {
    renderComponent()

    fireEvent.change(screen.getByPlaceholderText('Enter text'), { target: { value: 'Test Text' } })
    fireEvent.change(screen.getByPlaceholderText('Enter width (%)'), { target: { value: '50' } })
    fireEvent.change(screen.getByPlaceholderText('Enter height (%)'), { target: { value: '50' } })
    fireEvent.change(screen.getByPlaceholderText('Enter font size (em)'), { target: { value: 'invalid' } })
    fireEvent.click(screen.getByText('Submit'))

    expect(screen.getByText('Font size must be a decimal')).toBeInTheDocument()
  })

  it('displays an error when submitting with invalid HEX code', () => {
    renderComponent()

    fireEvent.change(screen.getByPlaceholderText('Enter text'), { target: { value: 'Test Text' } })
    fireEvent.change(screen.getByPlaceholderText('Enter width (%)'), { target: { value: '50' } })
    fireEvent.change(screen.getByPlaceholderText('Enter height (%)'), { target: { value: '50' } })
    fireEvent.change(screen.getByPlaceholderText('Enter font size (em)'), { target: { value: '1.5' } })
    fireEvent.change(screen.getByPlaceholderText('Enter HEX code (e.g. #FFFFFF)'), { target: { value: 'invalid' } })
    fireEvent.click(screen.getByText('Submit'))

    expect(screen.getByText('Invalid HEX code')).toBeInTheDocument()
  })

  it('submits the form with valid input', () => {
    renderComponent()

    fireEvent.change(screen.getByPlaceholderText('Enter text'), { target: { value: 'Test Text' } })
    fireEvent.change(screen.getByPlaceholderText('Enter width (%)'), { target: { value: '50' } })
    fireEvent.change(screen.getByPlaceholderText('Enter height (%)'), { target: { value: '50' } })
    fireEvent.change(screen.getByPlaceholderText('Enter font size (em)'), { target: { value: '1.5' } })
    fireEvent.change(screen.getByPlaceholderText('Enter HEX code (e.g. #FFFFFF)'), { target: { value: '#FF0000' } })
    fireEvent.click(screen.getByText('Submit'))

    expect(mockSetTextElem).toHaveBeenCalledWith(expect.objectContaining({
      type: 'text',
      text: 'Test Text',
      width: '50',
      height: '50',
      fontSize: '1.5',
      textColour: '#FF0000',
      x: 0,
      y: 0
    }))
    expect(mockSetTextSubmit).toHaveBeenCalledWith(true)
    expect(mockSetShowTextCreateModal).toHaveBeenCalledWith(false)
  })

  it('closes the modal when clicking Cancel', () => {
    renderComponent()

    fireEvent.click(screen.getByText('Cancel'))

    expect(mockSetShowTextCreateModal).toHaveBeenCalledWith(false)
  })

  it('clears error message when input changes', () => {
    renderComponent()

    fireEvent.click(screen.getByText('Submit'))
    expect(screen.getByText('Text cannot be empty')).toBeInTheDocument()

    fireEvent.change(screen.getByPlaceholderText('Enter text'), { target: { value: 'Test Text' } })
    expect(screen.queryByText('Text cannot be empty')).not.toBeInTheDocument()
  })
})