import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  id: string;
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
  onClose: () => void;
}

export function Toast({ title, description, variant = 'default', onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const variantStyles = {
    default: 'bg-white border-gray-200',
    destructive: 'bg-red-50 border-red-200',
  };

  const textStyles = {
    default: 'text-gray-900',
    destructive: 'text-red-900',
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
        ${variantStyles[variant]}
        border rounded-lg shadow-lg p-4 max-w-sm w-full
      `}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-1">
          <h3 className={`text-sm font-medium ${textStyles[variant]}`}>
            {title}
          </h3>
          <p className={`mt-1 text-sm ${textStyles[variant]}`}>
            {description}
          </p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className={`
            ml-4 p-1 rounded-full hover:bg-gray-100
            ${variant === 'destructive' ? 'hover:bg-red-100' : ''}
            transition-colors duration-200
          `}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
} 