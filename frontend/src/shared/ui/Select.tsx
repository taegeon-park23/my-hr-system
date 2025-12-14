import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';
import { Icon } from './Icon';

const selectTriggerVariants = cva(
    "relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm",
    {
        variants: {
            hasError: {
                true: "border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500",
                false: "",
            },
            disabled: {
                true: "bg-gray-100 text-gray-400 cursor-not-allowed",
                false: "",
            },
        },
        defaultVariants: {
            hasError: false,
            disabled: false,
        },
    }
);

export interface SelectOption {
    label: string;
    value: string | number;
}

interface SelectProps {
    label?: string;
    options: SelectOption[];
    error?: string;
    value?: string | number;
    onChange?: (value: any) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string; // Class for the outer container or trigger?
}

export function Select({
    label,
    options,
    error,
    value,
    onChange,
    placeholder = 'Select an option',
    disabled,
    className
}: SelectProps) {
    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className={cn("w-full", className)}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <Listbox value={value} onChange={onChange} disabled={disabled}>
                <div className="relative mt-1">
                    <Listbox.Button className={cn(selectTriggerVariants({ hasError: !!error, disabled }))}>
                        <span className={cn("block truncate", !selectedOption && "text-gray-400")}>
                            {selectedOption ? selectedOption.label : placeholder}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <Icon name="ChevronUpDownIcon" className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                    </Listbox.Button>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {options.map((option, optionIdx) => (
                                <Listbox.Option
                                    key={optionIdx}
                                    className={({ active }) =>
                                        cn(
                                            "relative cursor-default select-none py-2 pl-10 pr-4",
                                            active ? "bg-primary-100 text-primary-900" : "text-gray-900"
                                        )
                                    }
                                    value={option.value}
                                >
                                    {({ selected }) => (
                                        <>
                                            <span
                                                className={cn(
                                                    "block truncate",
                                                    selected ? "font-medium" : "font-normal"
                                                )}
                                            >
                                                {option.label}
                                            </span>
                                            {selected ? (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                                                    <Icon name="CheckIcon" className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
