import React, { useState } from 'react';

interface CancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const CancellationModal: React.FC<CancellationModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError('A reason for cancellation is required.');
      return;
    }
    onSubmit(reason);
    setReason('');
    setError('');
  };

  const handleClose = () => {
    setReason('');
    setError('');
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Cancel Booking</h2>
        <p className="text-sm text-gray-600 mb-4">Please provide a reason for cancelling this booking. This helps with record-keeping.</p>
        
        <div>
          <label htmlFor="cancellationReason" className="block text-sm font-medium text-gray-700">Reason</label>
          <textarea
            id="cancellationReason"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError('');
            }}
            rows={4}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., Event rescheduled, speaker unavailable, etc."
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={handleClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Back</button>
          <button type="button" onClick={handleSubmit} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">Confirm Cancellation</button>
        </div>
      </div>
    </div>
  );
};

export default CancellationModal;
