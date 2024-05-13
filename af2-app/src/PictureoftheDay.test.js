import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios'; // You may need to mock axios if you want to test API calls
import PictureOftheDay from '../pages/PictureOftheDay';

describe('PictureOftheDay Component', () => {
  // Unit Test for handleDateChange function
  it('should update date state when date input changes', () => {
    const { getByLabelText } = render(<PictureOftheDay />);
    const dateInput = getByLabelText('Pick a Date:');
    fireEvent.change(dateInput, { target: { value: '2024-05-01' } });
    expect(dateInput.value).toBe('2024-05-01');
  });

  // Integration Test for fetchPictureOfTheDay function
  it('should fetch picture of the day and update state when "Get the Picture from the Archive" button is clicked', async () => {
    // Mock axios get function to return a mock response
    const axiosMock = jest.spyOn(axios, 'get').mockResolvedValueOnce({
      data: {
        title: 'Mock Picture',
        explanation: 'Mock Explanation',
        url: 'https://mockurl.com/mockimage.jpg',
      },
    });

    const { getByText, getByLabelText } = render(<PictureOftheDay />);
    fireEvent.change(getByLabelText('Pick a Date:'), { target: { value: '2024-05-01' } });
    fireEvent.click(getByText('Get the Picture from the Archive'));

    // Wait for state update
    await waitFor(() => {
      expect(axiosMock).toHaveBeenCalledWith(expect.stringContaining('apod'), expect.any(Object));
      expect(getByText('Mock Picture')).toBeInTheDocument();
      expect(getByText('Mock Explanation')).toBeInTheDocument();
    });

    // Restore axios get function
    axiosMock.mockRestore();
  });

  // Integration Test for clearStorage function
  it('should clear localStorage and reset state when "CLEAR" button is clicked', () => {
    // Mock localStorage functions
    const localStorageMock = jest.spyOn(window.localStorage.__proto__, 'removeItem').mockImplementationOnce(() => {});
    const { getByText } = render(<PictureOftheDay />);
    fireEvent.click(getByText('CLEAR'));

    // Check if localStorage is cleared and state is reset
    expect(localStorageMock).toHaveBeenCalledWith('pictureOfTheDay');

  });
});