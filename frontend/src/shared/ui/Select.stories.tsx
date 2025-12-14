import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';
import { useState } from 'react';

const meta: Meta<typeof Select> = {
    title: 'Shared/Select',
    component: Select,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        error: { control: 'text' },
        label: { control: 'text' },
        disabled: { control: 'boolean' },
    },
};

export default meta;
type Story = StoryObj<typeof Select>;

const options = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
];

export const Default: Story = {
    render: (args) => {
        const [value, setValue] = useState(args.value || '1');
        return <Select {...args} value={value} onChange={setValue} />;
    },
    args: {
        label: 'Select Option',
        options: options,
    },
};

export const WithError: Story = {
    render: (args) => {
        const [value, setValue] = useState(args.value || '1');
        return <Select {...args} value={value} onChange={setValue} />;
    },
    args: {
        label: 'Select Option',
        options: options,
        error: 'This field is required',
    },
};

export const Disabled: Story = {
    render: (args) => {
        const [value, setValue] = useState(args.value || '1');
        return <Select {...args} value={value} onChange={setValue} />;
    },
    args: {
        label: 'Disabled Select',
        options: options,
        disabled: true,
    },
};
