export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${currentSize} border-gray-200 border-t-gray-800 rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
