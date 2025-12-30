import React, { useRef, useState } from 'react';

const FileUploadZone = ({ onFileSelect, selectedFile }) => {
  // We use a ref to click the hidden file input programmatically
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleZoneClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
        onFileSelect(e.target.files[0]);
    }
  };

  // Drag and drop visual cues
  const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Dynamic border colors based on state using our custom theme colors
  const borderColor = isDragging ? 'border-secondary' : (selectedFile ? 'border-primary' : 'border-base-300');
  const bgColor = isDragging ? 'bg-base-200' : 'bg-base-100';

  return (
    <div className="w-full">
      {/* The actual file input is hidden */}
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange} 
        className="hidden" 
      />

      {/* The visual click/drop zone */}
      <div 
        onClick={handleZoneClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
            relative flex flex-col items-center justify-center p-10 
            border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer
            group hover:bg-base-200 hover:border-primary
            ${borderColor} ${bgColor}
        `}
      >
        {selectedFile ? (
            // State: File Selected
            <div className="text-center animate-fade-in">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-primary mb-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg font-semibold text-neutral-700 break-all">{selectedFile.name}</p>
                <p className="text-sm text-neutral-500">Click to change file</p>
            </div>
        ) : (
            // State: No file selected
            <div className="text-center group-hover:-translate-y-1 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-neutral-400 group-hover:text-primary mb-3 transition-colors">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <p className="text-lg font-medium text-neutral-600">
                    <span className="text-primary font-bold hover:underline">Click to upload</span> or drag and drop
                </p>
                <p className="text-sm text-neutral-500 mt-1">Max file size 1GB</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadZone;