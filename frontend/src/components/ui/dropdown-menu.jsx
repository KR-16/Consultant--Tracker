import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../lib/utils";

export const DropdownMenu = ({ children }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      {React.Children.map(children, child => 
        React.cloneElement(child, { open, setOpen })
      )}
    </div>
  );
};

export const DropdownMenuTrigger = ({ asChild, children, open, setOpen }) => (
  <div onClick={() => setOpen(!open)} className="cursor-pointer">
    {children}
  </div>
);

export const DropdownMenuContent = ({ align = "end", children, open }) => {
  if (!open) return null;
  return (
    <div className={cn(
      "absolute z-50 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
      align === "end" ? "right-0" : "left-0"
    )}>
      <div className="py-1">{children}</div>
    </div>
  );
};

export const DropdownMenuItem = ({ className, children, onClick }) => (
  <div
    className={cn("block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center", className)}
    onClick={onClick}
  >
    {children}
  </div>
);