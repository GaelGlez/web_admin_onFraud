import { Input } from "@nextui-org/react";
import { Search } from "lucide-react";

interface SearchBarProps {
    searchTerm?: string;
    placeholder?: string;
    onSearch: (term: string) => void;
}

export default function SearchBar({ searchTerm, placeholder, onSearch }: SearchBarProps) {
    return (
        <div className="search-bar-container">
        <Input
            radius="lg"
            placeholder={placeholder || "Buscar por titulo o descripción..."}
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            startContent={
            <div className="flex items-center justify-center pl-3 pr-2">
                <Search className="w-5 h-5 text-[color:var(--color-primary)] pointer-events-none" />
            </div>
            }
            classNames={{
            inputWrapper: [
                "shadow-xl", // sombra 
                "bg-[color:var(--color-bg)]/70", // fondo ligeramente transparente
                "backdrop-blur-sm backdrop-saturate-200", // efecto blur suave
                "hover:bg-[color:var(--color-bg)]/90", // hover
                "focus-within:bg-[color:var(--color-bg)]/100", // focus
                "border border-[color:var(--color-primary)]",
                "focus-within:border-[color:var(--color-primary)]",
                "rounded-lg h-10 px-1",
                "!cursor-text",
            ],
            input: [
                "bg-transparent",
                "text-[color:var(--color-text)]",
                "placeholder:text-gray-400",
                "pl-2", // separación del icono
                "h-full flex items-center",
            ],
            }}
            className="w-[350px] lg:w-[400px]"
        />
        </div>
    );
}
