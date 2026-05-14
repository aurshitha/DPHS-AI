interface ProcessingStatusProps {
  status: string;
  errorMessage?: string;
}

const statusStyles: Record<string, string> = {
  idle: 'text-slate-500 bg-slate-100 tracking-wide',
  uploading: 'text-blue-600 bg-blue-50 tracking-wide',
  processing: 'text-blue-600 bg-blue-50 tracking-wide',
  ready: 'text-green-600 bg-green-50 tracking-wide',
  error: 'text-red-600 bg-red-50 tracking-wide',
};

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ status, errorMessage }) => {
  const getStatusText = () => {
    switch (status) {
      case 'idle': return 'Waiting for upload';
      case 'ready': return 'Report ready';
      case 'uploading': return 'Uploading PDF';
      case 'processing': return 'Processing...';
      case 'error': return errorMessage || 'Error occurred';
      default: return status;
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${statusStyles[status] ?? statusStyles.idle}`}>
      <span className="h-2.5 w-2.5 rounded-full bg-current" />
      <span>{getStatusText()}</span>
    </div>
  );
};

export default ProcessingStatus;