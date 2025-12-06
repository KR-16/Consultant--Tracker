import * as React from "react"
import { X } from "lucide-react"
import { cn } from "../../utils/cn"

const Dialog = ({ open, onClose, children }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
                {children}
            </div>
        </div>
    );
};

const DialogHeader = ({ children, className }) => (
    <div className={cn("px-6 py-4 border-b border-slate-200", className)}>
        {children}
    </div>
);

const DialogTitle = ({ children, className }) => (
    <h2 className={cn("text-xl font-semibold text-slate-900", className)}>
        {children}
    </h2>
);

const DialogContent = ({ children, className }) => (
    <div className={cn("px-6 py-4", className)}>
        {children}
    </div>
);

const DialogFooter = ({ children, className }) => (
    <div className={cn("px-6 py-4 border-t border-slate-200 flex justify-end gap-3", className)}>
        {children}
    </div>
);

export { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter }
