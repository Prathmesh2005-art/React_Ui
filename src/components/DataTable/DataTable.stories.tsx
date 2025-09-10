import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import DataTable from './DataTable';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

const sampleData: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active', createdAt: '2024-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active', createdAt: '2024-01-16' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', status: 'inactive', createdAt: '2024-01-17' },
];

const columns = [
  { key: 'id', title: 'ID', dataIndex: 'id' as keyof User, sortable: true, width: '80px' },
  { key: 'name', title: 'Name', dataIndex: 'name' as keyof User, sortable: true },
  { key: 'email', title: 'Email', dataIndex: 'email' as keyof User, sortable: true },
  { key: 'role', title: 'Role', dataIndex: 'role' as keyof User, sortable: true },
  {
    key: 'status',
    title: 'Status',
    dataIndex: 'status' as keyof User,
    sortable: true,
    render: (value: string) => <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{value}</span>,
  },
  { key: 'createdAt', title: 'Created At', dataIndex: 'createdAt' as keyof User, sortable: true },
];

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: { onRowSelect: action('row selected') },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { data: sampleData, columns } };
export const Selectable: Story = { args: { data: sampleData, columns, selectable: true } };
export const Loading: Story = { args: { data: [], columns, loading: true } };
export const Empty: Story = { args: { data: [], columns, emptyMessage: 'No users found' } };
export const LargeDataset: Story = {
  args: {
    data: Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: ['Admin', 'User', 'Editor'][i % 3],
      status: i % 4 === 0 ? 'inactive' : 'active',
      createdAt: `2024-01-${String(i % 30 + 1).padStart(2, '0')}`,
    })),
    columns,
    selectable: true,
    pageSize: 10,
  },
};
