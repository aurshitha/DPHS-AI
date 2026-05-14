import React, { useRef, useState } from 'react';

interface UploadProps {
  onUpload: (file: File) => Promise<void>;
}

const Upload: React.FC<UploadProps> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
      const selectedFile = files[0];
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && files[0].type === 'application/pdf') {
      const selectedFile = files[0];
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      await onUpload(file);
    } catch (error) {
      console.error('Upload failed', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur">
      <div className="space-y-4">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          className={`cursor-pointer rounded-3xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
            isDragOver
              ? 'border-[#0066CC] bg-[#0066CC]/10 scale-105'
              : 'border-slate-300 hover:border-[#0066CC] hover:bg-[#0066CC]/5'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            className="hidden"
          />
          {file ? (
            <p className="text-lg font-medium text-slate-900">{file.name}</p>
          ) : (
            <p className="text-slate-500">Drag & drop PDF here, or click to select a file.</p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Accepted format: PDF</p>
            <p className="text-sm text-slate-500">Upload the clinical report to generate a structured summary.</p>
          </div>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="inline-flex items-center justify-center rounded-2xl bg-[#0066CC] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0052A3] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {uploading ? 'Uploading...' : 'Execute File'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Upload;