import styles from './Modal.module.css';

// Receives props:
// - isOpen: boolean to control visibility
// - onClose: function to call when closing the modal
// - children: the content to display inside the modal
export default function Modal({ isOpen, onClose, children }) {
  // If the modal isn't open, don't render anything
  if (!isOpen) {
    return null;
  }

  // Handle clicks on the backdrop to close the modal
  const handleBackdropClick = (e) => {
    // Only close if the click is directly on the backdrop, not the content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    // The semi-transparent backdrop
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      {/* The actual modal content box */}
      <div className={styles.modalContent}>
        {/* A button to close the modal */}
        <button className={styles.closeButton} onClick={onClose}>
          &times; {/* A simple 'X' character */}
        </button>
        {/* Render whatever content was passed into the modal */}
        {children}
      </div>
    </div>
  );
}