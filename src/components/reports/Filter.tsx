import { Badge } from "@/components/ui/badge";
import { Button as UiButton } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Check, ListFilter } from "lucide-react";
import React from "react";

interface FilterProps {
    values: string;
    title: string;
    options: { label: string; value: string }[];
    onChange: (value: string) => void;
}

export default function Filter({ values, title, options, onChange }: FilterProps) {
    const [selectedValues, setSelectedValues] = React.useState(new Set(values.split(",")));

    React.useEffect(() => {
        if (values.length === 0) setSelectedValues(new Set());
    }, [values]);

    return (
        <Popover>
        <PopoverTrigger asChild>
            <UiButton
            variant="outline"
            size="sm"
            className={cn(
                "h-9 border border-[color:var(--color-primary)] rounded-lg px-3 flex items-center gap-1 truncate",
                "shadow-md hover:shadow-lg transition-all duration-150 bg-[color:var(--color-bg)] hover:bg-[color:var(--color-bg)]/90"
            )}
            >
            <ListFilter className="w-4 h-4 text-[color:var(--color-primary)]" />
            <span className="flex-1 text-[color:var(--color-text)] truncate">{title}</span>
            {selectedValues.size > 0 && (
                <>
                <Separator 
                    orientation="vertical" 
                    className="mx-2 h-4" 
                    style={{
                        borderRightWidth: '1px',       // grosor de la línea
                        borderRightColor: 'var(--color-primary)' // color de la línea
                    }} 
                />
                <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal lg:hidden"
                >
                    {selectedValues.size}
                </Badge>
                <div className="hidden lg:flex space-x-1">
                    {selectedValues.size > 2 ? (
                        <Badge
                        className="rounded-sm px-1 font-normal badge-primary-transparent"
                        >
                        {selectedValues.size} seleccionados
                        </Badge>
                    ) : (
                        options
                        .filter((option) => selectedValues.has(option.value))
                        .map((option) => (
                            <Badge
                            key={option.value}
                            className="rounded-sm px-1 font-normal badge-primary-transparent"
                            >
                            {option.label}
                            </Badge>
                        ))
                    )}
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
            <CommandInput
                placeholder={`Filtrar por ${title}`}
                className="px-3 py-2 border-b border-gray-200 text-[color:var(--color-text)]"
            />
            <CommandList>
                <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                <CommandGroup>
                {options.map((option) => {
                    const isSelected = selectedValues.has(option.value);
                    return (
                    <CommandItem
                        key={option.value}
                        onSelect={() => {
                            const newSet = new Set(selectedValues) // ❌ copia el Set
                            if (isSelected) newSet.delete(option.value)
                            else newSet.add(option.value)
                            setSelectedValues(newSet) // ✅ actualizamos estado correctamente
                            onChange(Array.from(newSet).join(","))
                        }}
                        className="px-3 py-2 hover:bg-[color:var(--color-primary)]/10 cursor-pointer flex items-center gap-2 rounded-md"
                    >
                        <div
                        className={cn(
                            "flex h-4 w-4 items-center justify-center rounded-sm border border-[color:var(--color-primary)]",
                            isSelected
                            ? "bg-[color:var(--color-primary)] text-white"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                        >
                        <Check className="h-3 w-3" />
                        </div>
                        <span className="text-[color:var(--color-text)]">{option.label}</span>
                    </CommandItem>
                    );
                })}
                </CommandGroup>

                {selectedValues.size > 0 && (
                <>
                    <CommandSeparator />
                    <CommandGroup>
                    <CommandItem
                        onSelect={() => {
                        setSelectedValues(new Set());
                        onChange("");
                        }}
                        className="justify-center text-center text-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)]/10 rounded-md"
                    >
                        Limpiar
                    </CommandItem>
                    </CommandGroup>
                </>
                )}
            </CommandList>
            </Command>
        </PopoverContent>
        </Popover>
    );
}
