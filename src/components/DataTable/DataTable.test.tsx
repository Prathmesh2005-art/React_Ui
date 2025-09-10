import { render, screen } from '@testing-library/react';
import DataTable, { Column } from './DataTable';

interface User {
  name: string;
  age: number;
}

const testColumns: Column<User>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name' },
  { key: 'age', title: 'Age', dataIndex: 'age' },
];

const testData: User[] = [
  { name: 'Prathmesh', age: 20 },
  { name: 'Rahul', age: 22 },
];

describe('DataTable Component', () => {
  it('renders table with columns and data', () => {
    render(<DataTable columns={testColumns} data={testData} />);

    // Check headers
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();

    // Check data
    expect(screen.getByText('Prathmesh')).toBeInTheDocument();
    expect(screen.getByText('Rahul')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('22')).toBeInTheDocument();
  });
});
