import { useEffect } from "react";

export default function Modal({ open, onClose, title, children }: any) {
  if (!open) return null;

  // Close when clicking outside
  function handleOverlayClick(e: any) {
    if (e.target === e.currentTarget) {
      onClose(false);
    }
  }

  // Close on ESC key
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose(false);
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
      onClick={handleOverlayClick}
    >
      <div
        className="
          bg-white 
          p-6 
          rounded-2xl 
          shadow-2xl 
          w-[95%] 
          max-w-3xl 
          max-h-[90vh] 
          overflow-y-auto
          relative
          animate-scaleIn
        "
      >
        {/* Close button (X) */}
        <button
          onClick={() => onClose(false)}
          className="
            absolute top-4 right-4 
            text-gray-500 hover:text-gray-800 
            transition
          "
        >
          ✕
        </button>

        {/* Title */}
        {title && (
          <h2 className="text-2xl font-semibold mb-5 text-center">{title}</h2>
        )}

        {/* Modal content */}
        <div className="flex justify-center">{children}</div>
      </div>
    </div>
  );
}
