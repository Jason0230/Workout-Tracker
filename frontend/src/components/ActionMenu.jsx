
import { useState, useEffect, useRef } from "react";
import "./ActionMenu.css";

export default function ActionMenu({ onEdit, onDelete }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
            setIsOpen(false);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="actionMenu" ref={menuRef} onClick={(e) => e.stopPropagation()}>
            <button 
                type="button"
                className="menuTrigger"
                onClick={(e) => {
                e.stopPropagation(); // prevents toggling a collapsible header
                setIsOpen((prev) => !prev);
                }}
                >⋮</button>

            {isOpen && (
                <div className="menuDropdown">
                    <button type="button" onClick={onEdit}>
                        Edit
                    </button>

                    <button type="button" onClick={onDelete} className="danger">
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}