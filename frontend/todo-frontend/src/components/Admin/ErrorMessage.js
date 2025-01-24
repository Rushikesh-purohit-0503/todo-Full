import React from "react";

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return <div className="text-center text-red-500 py-2">{message}</div>;
};

export default ErrorMessage;
