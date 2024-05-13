import React from 'react'; 
import { render, fireEvent, waitFor } from '@testing-library/react';
import HomePage from '../pages/HomePage';
import axios from 'axios';

describe('HomePage Component', () => {
  // Unit Test for handleDateChange function
  it('should update date state when date input changes', () => {
    const { getByLabelText } = render(<HomePage />);
    const dateInput = getByLabelText('Pick a Date:');
    fireEvent.change(dateInput, { target: { value: '2024-05-01' } });
    expect(dateInput.value).toBe('2024-05-01');
  });

  // Integration Test for fetchPictures function
  it('should fetch pictures and update state when "Get the Pictures from Archive" button is clicked', async () => {
    // Mock axios get function to return a mock response
    const axiosMock = jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: [{ imageUrl: 'mockImageUrl', latitude: 'mockLatitude', longitude: 'mockLongitude', identifier: 'mockIdentifier' }] });

    const { getByText } = render(<HomePage />);
    fireEvent.click(getByText('Get the Pictures from Archive'));

    // Wait for state update
    await waitFor(() => expect(axiosMock).toHaveBeenCalledWith(`https://epic.gsfc.nasa.gov/api/enhanced/date/`, { params: { date: '' } }));

    // Check if the component renders images after fetching
    expect(getByAltText('mockLatitude mockLongitude')).toBeInTheDocument();

    // Restore axios get function
    axiosMock.mockRestore();
  });

  // Integration Test for clearStorage function
  // it('should clear localStorage and reset state when "CLEAR" button is clicked', () => {
  //   // Mock localStorage functions
  //   const localStorageMock = jest.spyOn(window.localStorage.__proto__, 'removeItem').mockImplementationOnce(() => {});
  //   const { getByText } = render(<HomePage />);
  //   fireEvent.click(getByText('CLEAR'));

  //   // Check if localStorage is cleared and state is reset
  //   expect(localStorageMock).toHaveBeenCalledWith('EPICPhotoes');
  //   expect(getByText('Pick a Date:').value).toBe('');
  // });


});