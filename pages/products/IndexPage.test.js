import { render, screen } from '@testing-library/react';
import HomePage from './index'

test('renders the home page without errors', () => {
    render(<HomePage />);
    const headingElement = screen.getByText(/Welcome to the Home Page/i);
    expect(headingElement).toBeInTheDocument();
  });