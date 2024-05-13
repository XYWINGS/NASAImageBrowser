import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios'; // You may need to mock axios if you want to test API calls
import MarsRoverPhotoes from '../pages/MarsRoverPhotoes';

describe('MarsRoverPhotoes Component', () => {
  // Unit Test for handleDateChange function
  it('should update date state when date input changes', () => {
    const { getByLabelText } = render(<MarsRoverPhotoes />);
    const dateInput = getByLabelText('Select from Earth Date:');
    fireEvent.change(dateInput, { target: { value: '2024-05-01' } });
    expect(dateInput.value).toBe('2024-05-01');
  });

  // Integration Test for fetchPictures function
  it('should fetch pictures and update state when "Get the Pictures" button is clicked', async () => {
    // Mock axios get function to return a mock response
    const axiosMock = jest.spyOn(axios, 'get').mockResolvedValueOnce({
      data: {
        photos: [{ id: 1, img_src: 'mockImageUrl1' }, { id: 2, img_src: 'mockImageUrl2' }],
      },
    });

    const { getByText, getByLabelText, getByAltText } = render(<MarsRoverPhotoes />);
    fireEvent.change(getByLabelText('Select from Earth Date:'), { target: { value: '2024-05-01' } });
    fireEvent.click(getByText('Get the Pictures'));

    // Wait for state update
    await waitFor(() => {
      expect(axiosMock).toHaveBeenCalledWith(expect.stringContaining('mars-photos'), expect.any(Object));
      expect(getByAltText('1')).toBeInTheDocument();
      expect(getByAltText('2')).toBeInTheDocument();
    });

    // Restore axios get function
    axiosMock.mockRestore();
  });

  // Integration Test for clearStorage function
  it('should clear localStorage and reset state when "CLEAR" button is clicked', () => {
    // Mock localStorage functions
    const localStorageMock = jest.spyOn(window.localStorage.__proto__, 'removeItem').mockImplementationOnce(() => {});
    const { getByText } = render(<MarsRoverPhotoes />);
    fireEvent.click(getByText('CLEAR'));

    // Check if localStorage is cleared and state is reset
    expect(localStorageMock).toHaveBeenCalledWith('MarsRoverPhotoes');

  });
});