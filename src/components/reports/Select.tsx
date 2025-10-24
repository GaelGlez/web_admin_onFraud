import { Badge } from "@/components/ui/badge";
import { Button as UiButton } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ListFilter } from "lucide-react";
import React from "react";

interface SelectProps {
    value: string;
    title: string;
    options: { label: string; value: string }[];
    onChange: (value: string) => void;
    canSearch?: boolean;
}

export default function Select({ value, title, options, onChange, canSearch }: SelectProps) {
    const [selectedValue, setSelectedValue] = React.useState(value);
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        setSelectedValue(value);
    }, [value]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <UiButton
            variant="outline"
            size="sm"
            className={cn(
                "h-9 border border-[color:var(--color-primary)] rounded-lg px-3 flex items-center gap-1 truncate",
                "shadow-md hover:shadow-lg transition-all duration-150 bg-[color:var(--color-bg)] hover:bg-[color:var(--color-bg)]/90"
            )}
            onClick={() => setOpen(!open)}
            >
            <ListFilter className="w-4 h-4 text-[color:var(--color-primary)]" />
            <span className="flex-1 text-[color:var(--color-text)] truncate">{title}</span>
            {selectedValue && (
                <>
                <Separator 
                    orientation="vertical" 
                    className="mx-2 h-4" 
                    style={{
                        borderRightWidth: '1px',
                        borderRightColor: 'var(--color-primary)',
                    }}
                />
                <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal lg:hidden"
                >
                    1
                </Badge>
                <div className="hidden lg:flex">
                    <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal badge-primary-transparent"
                    >
                    {options.find((opt) => opt.value === selectedValue)?.label}
                    </Badge>
                </div>
                </>
            )}
            </UiButton>
        </PopoverTrigger>
        <PopoverContent 
            className="w-[220px] p-0 bg-[color:var(--color-bg)]/90 backdrop-blur-sm rounded-md shadow-lg border border-gray-200"
            align="start"
        >
            <Command>
            {canSearch && <CommandInput placeholder={title} />}
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                {options.map((option) => (
                    <CommandItem
                    key={option.value}
                    onSelect={() => {
                        setSelectedValue(option.value);
                        onChange(option.value);
                        setOpen(false);
                    }}
                    >
                    <span>{option.label}</span>
                    </CommandItem>
                ))}
                </CommandGroup>
            </CommandList>
            </Command>
        </PopoverContent>
        </Popover>
    );
}
