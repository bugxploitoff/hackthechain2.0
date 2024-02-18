import React, { useRef } from 'react';
import Modal from 'react-modal';

// Apply your own styles to make the modal visually appealing
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '80%', // Adjust the width as needed
    maxWidth: '400px', // Set a maximum width if desired
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
  },
};

const Datamodel = ({ isOpen, onClose, data }) => {
    const textAreaRef = useRef(null);

    const handleCopy = () => {
      textAreaRef.current.select();
      document.execCommand('copy');
    };
    return (
        <Modal
          isOpen={isOpen}
          onRequestClose={onClose}
          contentLabel="Payment Modal"
          style={customStyles}
        >
          <h2 style={{ textAlign: 'center' }}>Payment Button Code</h2>
          <textarea
            ref={textAreaRef}
            readOnly
            value={data.token}
            style={{ width: '100%', height: '150px', marginBottom: '10px' }}
          />
          <button style={{ display: 'block', margin: 'auto', marginBottom: '20px' }} onClick={handleCopy}>
            Copy
          </button>
          <button style={{ display: 'block', margin: 'auto' }} onClick={onClose}>
            Close
          </button>
        </Modal>
      );    
};

export default Datamodel;
