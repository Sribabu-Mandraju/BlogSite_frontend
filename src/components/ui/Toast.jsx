import { useState, useEffect } from "react";
import { CheckCircle, XCircle, X, AlertCircle, Info } from "lucide-react";

const Toast = ({ message, type = "info", duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} className="text-green-400" />;
      case "error":
        return <XCircle size={20} className="text-red-400" />;
      case "warning":
        return <AlertCircle size={20} className="text-yellow-400" />;
      default:
        return <Info size={20} className="text-blue-400" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-900/90 border-green-700";
      case "error":
        return "bg-red-900/90 border-red-700";
      case "warning":
        return "bg-yellow-900/90 border-yellow-700";
      default:
        return "bg-blue-900/90 border-blue-700";
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div
        className={`flex items-center gap-3 p-4 rounded-lg border ${getBgColor()} backdrop-blur-sm shadow-lg max-w-sm`}
      >
        {getIcon()}
        <p className="text-sm text-dark-100 flex-1">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose(), 300);
          }}
          className="text-dark-300 hover:text-dark-100 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
