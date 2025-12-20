import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

const DialogContext = React.createContext({});

export const Dialog = ({ open, onOpenChange, children }) => (
  <DialogContext.Provider value={{ open, onOpenChange }}>
    {children}
  </DialogContext.Provider>
);

export const DialogTrigger = ({ asChild, children }) => {
  const { onOpenChange } = React.useContext(DialogContext);
  return React.cloneElement(children, { onClick: () => onOpenChange(true) });
};

export const DialogContent = ({ className, children }) => {
  const { open, onOpenChange } = React.useContext(DialogContext);
  const ref = useRef(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        ref={ref}
        className={cn("relative bg-white rounded-lg shadow-lg w-full max-w-lg p-6 animate-in fade-in zoom-in duration-200", className)}
      >
        <button 
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 text-slate-500 hover:text-slate-900"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
};

export const DialogHeader = ({ children }) => <div className="mb-4 text-left">{children}</div>;
export const DialogTitle = ({ children }) => <h2 className="text-lg font-semibold text-slate-900">{children}</h2>;