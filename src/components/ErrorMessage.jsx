const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
      <div className="flex justify-between items-center">
        <p>{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-4 px-3 py-1 bg-red-100 hover:bg-red-200 rounded text-sm"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;