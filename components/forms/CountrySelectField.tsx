import countryList from 'react-select-country-list'
import { useMemo, useCallback, useState } from "react";
import { Control, Controller, FieldError, FieldValues, Path } from 'react-hook-form';
import { Check, ChevronsUpDown } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type CountrySelectFieldProps<T extends FieldValues> = {
    name: Path<T>;
    label: string;
    control: Control<T>;
    error?: FieldError;
    required?: boolean;
    placeholder?: string;
    disabled?: boolean;
}

const CountrySelectField = <T extends FieldValues>({
                                                       name,
                                                       label,
                                                       control,
                                                       error,
                                                       required = false,
                                                       placeholder = "Select country",
                                                       disabled = false
                                                   }: CountrySelectFieldProps<T>) => {
    // State to track search input
    const [searchQuery, setSearchQuery] = useState("");

    // Memoize country list để tránh re-compute
    const options = useMemo(() => {
        return countryList().getData();
    }, []);

    // Filter options based on a search query
    const filteredOptions = useMemo(() => {
        if (!searchQuery) return options;

        const lowerCaseQuery = searchQuery.toLowerCase();
        return options.filter(
            (option) => 
                option.label.toLowerCase().includes(lowerCaseQuery) || 
                option.value.toLowerCase().includes(lowerCaseQuery)
        );
    }, [options, searchQuery]);

    // Memoize flag URL generator
    const getCountryFlag = useCallback((code: string) => {
        return `https://flagcdn.com/w20/${code.toLowerCase()}.png`;
    }, []);

    // Memoize country lookup function
    const getCountryByCode = useCallback((code: string) => {
        return options.find((option) => option.value.toLowerCase() === code.toLowerCase());
    }, [options]);

    return (
        <div className="space-y-2">
            <label
                htmlFor={name}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 "
            >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <Controller
                control={control}
                name={name}
                rules={{
                    required: required ? `${label} is required` : false,
                }}
                render={({ field }) => {
                    const selectedCountry = field.value ? getCountryByCode(field.value) : null;

                    return (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    disabled={disabled}
                                    className={cn(
                                        "w-full justify-between",
                                        !field.value && "text-muted-foreground",
                                        error && "border-red-500 focus-visible:ring-red-500"
                                    )}
                                    aria-label={`${label} selector`}
                                    aria-invalid={!!error}
                                    aria-describedby={error ? `${name}-error` : undefined}
                                >
                                    {selectedCountry ? (
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <img
                                                src={getCountryFlag(selectedCountry.value)}
                                                alt=""
                                                className="h-4 w-6 object-cover rounded-sm flex-shrink-0"
                                                onError={(e) => {
                                                    // Fallback to the globe icon if a flag fails to load
                                                    e.currentTarget.style.display = 'none';
                                                    const parent = e.currentTarget.parentElement;
                                                    if (parent && !parent.querySelector('.fallback-icon')) {
                                                        const icon = document.createElement('div');
                                                        icon.className = 'fallback-icon flex-shrink-0';
                                                        icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
                                                        parent.insertBefore(icon, e.currentTarget);
                                                    }
                                                }}
                                            />
                                            <span className="truncate">{selectedCountry.label}</span>
                                        </div>
                                    ) : (
                                        placeholder
                                    )}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 " align="start">
                                <Command shouldFilter={false} className="bg-gray-800 border-gray-600">
                                    <CommandInput
                                        placeholder="Search country..."
                                        className="h-9 "
                                        value={searchQuery}
                                        onValueChange={setSearchQuery}
                                    />
                                    {filteredOptions.length === 0 ? (
                                        <CommandEmpty>No countries match &#34;{searchQuery}&#34;</CommandEmpty>
                                    ) : (
                                        <CommandEmpty>No country found.</CommandEmpty>
                                    )}
                                    <CommandList className="bg-gray-800 border-gray-600">
                                        <CommandGroup>
                                            {filteredOptions.map((option) => {
                                                const isSelected = field.value?.toLowerCase() === option.value.toLowerCase();

                                                return (
                                                    <CommandItem
                                                        key={option.value}
                                                        value={option.label}
                                                        keywords={[option.label, option.value]}
                                                        onSelect={() => {
                                                            field.onChange(option.value.toUpperCase());
                                                        }}
                                                        className="cursor-pointer "
                                                    >
                                                        <div className="flex items-center gap-2 flex-1 overflow-hidden">
                                                            <img
                                                                src={getCountryFlag(option.value)}
                                                                alt=""
                                                                className="w-6 h-4 object-cover rounded-sm flex-shrink-0"
                                                                onError={(e) => {
                                                                    e.currentTarget.style.display = 'none';
                                                                }}
                                                            />
                                                            <span className="truncate">{option.label}</span>
                                                        </div>
                                                        <Check
                                                            className={cn(
                                                                "ml-auto h-4 w-4 flex-shrink-0",
                                                                isSelected ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                    </CommandItem>
                                                );
                                            })}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    );
                }}
            />
            {error && (
                <p
                    id={`${name}-error`}
                    className="text-sm text-red-500 flex items-center gap-1"
                    role="alert"
                >
                    {error.message}
                </p>
            )}
        </div>
    );
};

export default CountrySelectField;
