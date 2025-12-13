import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { useState } from 'react';
import { Button } from './Button';

const meta: Meta<typeof Modal> = {
    title: 'shared/ui/Modal',
    component: Modal,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Modal>;

// Wrapper component to handle modal state
const ModalWithState = ({ children, title, maxWidth }: { children: React.ReactNode, title: string, maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={title} maxWidth={maxWidth}>
                {children}
            </Modal>
        </>
    );
};

export const Default: Story = {
    render: () => (
        <ModalWithState title="Default Modal">
            <p className="text-gray-600">
                This is a default modal with standard content. Click outside or the X button to close.
            </p>
            <div className="mt-4 flex justify-end">
                <Button>Confirm</Button>
            </div>
        </ModalWithState>
    ),
};

export const WithLongContent: Story = {
    render: () => (
        <ModalWithState title="Long Content Modal" maxWidth="lg">
            <div className="space-y-4 text-gray-600">
                <p>This modal contains a lot of content to demonstrate scrolling behavior.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
            <div className="mt-4 flex justify-end gap-2">
                <Button variant="secondary">Cancel</Button>
                <Button>Save</Button>
            </div>
        </ModalWithState>
    ),
};

export const SmallWidth: Story = {
    render: () => (
        <ModalWithState title="Small Modal" maxWidth="sm">
            <p className="text-gray-600">This is a small modal with limited width.</p>
            <div className="mt-4 flex justify-end">
                <Button>OK</Button>
            </div>
        </ModalWithState>
    ),
};

export const LargeWidth: Story = {
    render: () => (
        <ModalWithState title="Large Modal" maxWidth="2xl">
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded">Column 1</div>
                <div className="p-4 bg-gray-50 rounded">Column 2</div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
                <Button variant="secondary">Cancel</Button>
                <Button>Submit</Button>
            </div>
        </ModalWithState>
    ),
};
