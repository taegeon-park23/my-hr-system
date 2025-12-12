import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
    title: 'Shared/UI/Input',
    component: Input,
    tags: ['autodocs'],
    argTypes: {
        label: { control: 'text' },
        error: { control: 'text' },
        placeholder: { control: 'text' },
    },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
    args: {
        label: 'Email Address',
        placeholder: 'john@example.com',
    },
};

export const WithError: Story = {
    args: {
        label: 'Password',
        type: 'password',
        error: 'Password is required',
    },
};

export const Disabled: Story = {
    args: {
        label: 'Username',
        value: 'johndoe',
        disabled: true,
    },
};
