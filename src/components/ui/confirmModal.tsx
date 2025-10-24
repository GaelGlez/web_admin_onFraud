"use client";

import { Button } from "@nextui-org/react";
import { ReactNode } from "react";
import { createPortal } from "react-dom";

interface ConfirmModalProps {
    open: boolean;
    title?: string;
    message?: string;
    buttonText1?: string;
    buttonText2?: string;
    onConfirm: () => Promise<void> | void;
    onClose: () => void;
    loading?: boolean;
}

export default function ConfirmModal({
    open,
    title = "Confirmar acción",
    message = "¿Estás seguro?",
    buttonText1 = "Confirmar",
    buttonText2 = "Cancelar",
    onConfirm,
    onClose,
    loading = false
}: ConfirmModalProps) {
    if (!open) return null;

    const modalContent: ReactNode = (
        <div className="fixed inset-0 z-[9999] flex justify-center items-center">
            <div 
                className="absolute inset-0 bg-black/50" 
                onClick={onClose} 
            />
            <div className="relative z-[10000] bg-white p-6 rounded-md shadow-lg max-w-sm w-full text-center space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                <p className="text-gray-600">{message}</p>
                <div className="flex justify-center gap-4 mt-2">
                    <Button
                        size="sm"
                        className="bg-[color:var(--color-danger)] text-white font-bold px-3 py-1.5 rounded-md hover:bg-[#a62214] transition-all"
                        onPress={onConfirm}
                        isDisabled={loading}
                    >
                        {buttonText1}
                    </Button>
                    <Button
                        size="sm"
                        className="bg-[color:var(--color-primary)] text-white font-bold px-3 py-1.5 rounded-md hover:bg-[#05442c] transition-all"
                        onPress={onClose}
                        isDisabled={loading}
                    >
                        {buttonText2}
                    </Button>
                </div>
            </div>
        </div>
    );

    // Renderiza el modal en un portal para asegurarse que esté sobre todo
    return typeof window !== "undefined" ? createPortal(modalContent, document.body) : null;
}
