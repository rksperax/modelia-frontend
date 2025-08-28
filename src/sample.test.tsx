import { render, screen } from '@testing-library/react';

function Sample() {
  return (
    <div>
      <h1>Sample testing</h1>
    </div>
  );
}

describe('Sample', () => {
  it('renders the Sample component', async () => {
    render(<Sample />);
    const heading = await screen.findByText('Sample testing');
    expect(heading).toBeInTheDocument();
  });
});