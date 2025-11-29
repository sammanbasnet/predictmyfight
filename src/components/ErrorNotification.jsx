import '../styles/components/ErrorNotification.css'

/**
 * ErrorNotification Component
 * Displays user-friendly error messages instead of browser alerts
 * 
 * @param {Object} props - Component props
 * @param {string} props.message - Error message to display
 * @param {Function} props.onClose - Callback function to close the notification
 * @returns {JSX.Element} Error notification component
 */
function ErrorNotification({ message, onClose }) {
  if (!message) return null

  return (
    <div className="error-notification" role="alert">
      <div className="error-content">
        <span className="error-icon">⚠️</span>
        <span className="error-message">{message}</span>
      </div>
      <button 
        className="error-close" 
        onClick={onClose}
        aria-label="Close error notification"
      >
        ×
      </button>
    </div>
  )
}

export default ErrorNotification

