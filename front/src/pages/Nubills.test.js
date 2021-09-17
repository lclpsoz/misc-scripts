import { render, screen } from '@testing-library/react';
import Nubills from './Nubills';

test('renders learn react link', () => {
  render(<Nubills />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
