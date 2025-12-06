import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "../../utils/cn"

const DropdownMenu = ({ children }) => {
    return <div className="relative inline-block text-left">{children}</div>
}

const DropdownMenuTrigger = React.forwardRef(({ children, className, ...props }, ref) => (
    <button
        ref={ref}
        className={cn(
            "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            className
        )}
        {...props}
    >
        {children}
    </button>
))
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

const DropdownMenuContent = ({ children, open, onClose, className }) => {
    if (!open) return null

    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose} />
            <div
                className={cn(
                    "absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
                    className
                )}
            >
                <div className="py-1">{children}</div>
            </div>
        </>
    )
}

const DropdownMenuItem = ({ children, onClick, className }) => (
    <button
        onClick={onClick}
        className={cn(
            "block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors",
            className
        )}
    >
        {children}
    </button>
)

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem }
