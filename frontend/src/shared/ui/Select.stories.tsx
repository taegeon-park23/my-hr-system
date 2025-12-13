import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
    title: 'shared/ui/Select',
    component: Select,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        error: {
            control: 'text',
            description: 'Error message to display',
        },
        label: {
            control: 'text',
            description: 'Label for the select',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Select>;

const sampleOptions = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
];

const categoryOptions = [
    { label: 'LAPTOP', value: 'LAPTOP' },
    { label: 'MONITOR', value: 'MONITOR' },
    { label: 'KEYBOARD', value: 'KEYBOARD' },
    { label: 'MOUSE', value: 'MOUSE' },
];

export const Default: Story = {
    args: {
        options: sampleOptions,
    },
};

export const WithLabel: Story = {
    args: {
        label: 'Select an option',
        options: sampleOptions,
    },
};

export const WithError: Story = {
    args: {
        label: 'Category',
        options: categoryOptions,
        error: '필수 입력 항목입니다.',
    },
};

export const Disabled: Story = {
    args: {
        label: 'Disabled Select',
        options: sampleOptions,
        disabled: true,
    },
};

export const WithDefaultValue: Story = {
    args: {
        label: 'Asset Category',
        options: categoryOptions,
        defaultValue: 'MONITOR',
    },
};
