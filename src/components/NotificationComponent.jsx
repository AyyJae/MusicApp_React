import React from 'react';

const NotificationComponent = ({ message, type }) => {
  if (!message) return null;

  return (
    <div className={`fixed top-4 right-4 p-4 rounded shadow-md ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
      {message}
    </div>
  );
};

export default NotificationComponent;
