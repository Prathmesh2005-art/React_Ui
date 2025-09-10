import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import InputField from './InputField';

describe('InputField Component', () => {
  it('renders input with placeholder', () => {
    render(<InputField placeholder="Enter name" />);
    const inputElement = screen.getByPlaceholderText('Enter name');
    expect(inputElement).toBeInTheDocument();
  });

  it('calls onChange when typing', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<InputField placeholder="Enter name" onChange={handleChange} />);
    const inputElement = screen.getByPlaceholderText('Enter name');

    await user.type(inputElement, 'Prathmesh');
    expect(handleChange).toHaveBeenCalled();
  });
});
