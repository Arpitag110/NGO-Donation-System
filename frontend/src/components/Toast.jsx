import { useState, useEffect } from "react";

function Toast({ message, type = "success", duration = 3000, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const bgColor = {
        success: "bg-green-600",
        error: "bg-red-600",
        info: "bg-blue-600",
        warning: "bg-yellow-500",
    }[type] || "bg-green-600";

    return (
        <div
            className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg animate-pulse`}
            role="alert"
        >
            {message}
        </div>
    );
}

export default Toast;
