import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import InputField from './InputField';

const meta = {
  title: 'Components/InputField',
  component: InputField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['filled', 'outlined', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number'],
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof InputField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    helperText: 'We\'ll never share your email.',
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    showPasswordToggle: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    value: 'invalid-user',
    errorMessage: 'Username is already taken',
    invalid: true,
  },
};

export const Loading: Story = {
  args: {
    label: 'Search',
    placeholder: 'Searching...',
    loading: true,
    value: 'search query',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Field',
    placeholder: 'This field is disabled',
    disabled: true,
  },
};

export const WithClearButton: Story = {
  args: {
    label: 'Search',
    placeholder: 'Type to search...',
    showClearButton: true,
    value: 'sample text',
  },
};

export const Filled: Story = {
  args: {
    label: 'Filled Input',
    placeholder: 'Filled variant',
    variant: 'filled',
  },
};

export const Ghost: Story = {
  args: {
    label: 'Ghost Input',
    placeholder: 'Ghost variant',
    variant: 'ghost',
  },
};

export const Small: Story = {
  args: {
    label: 'Small Input',
    placeholder: 'Small size',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    label: 'Large Input',
    placeholder: 'Large size',
    size: 'lg',
  },
};