import React, { useState } from 'react';
import FileUploadZone from './components/UI/FileUploadZone';
import StatusAlert from './components/UI/StatusAlert';

function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // Logic remains mostly the same, just cleaner implementation
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    if (file.size > 1024 * 1024 * 1024) {
        setStatus("File is too large (Max 1GB)");
        return;
    }

    setLoading(true);
    setStatus('');

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setStatus(`Success! Uploaded: ${data.filename}`);
        // Optional: clear file on success
        // setFile(null); 
      } else {
        const errorData = await response.json().catch(() => ({}));
        setStatus(errorData.detail || 'Upload failed.');
      }
    } catch (error) {
      console.error(error);
      setStatus('Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Using base-200 which is now our light teal tint defined in tailwind.config
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg">
        
        <div className="text-center mb-8">
           {/* Using the secondary color (orange) for a subtle accent icon */}
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-secondary mb-2 opacity-80">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.5 4.5 0 002.25 15z" />
          </svg>
          <h1 className="text-4xl font-extrabold text-neutral-800 tracking-tight">Cloud Upload</h1>
          <p className="text-neutral-500 mt-2">Securely transfer your files to S3 buckets.</p>
        </div>

        {/* Main Card */}
        <div className="card bg-base-100 shadow-xl border border-base-300/50 hover:shadow-2xl transition-shadow duration-300">
          <div className="card-body p-8">
            
            <form onSubmit={handleUpload} className="flex flex-col gap-6">
              
              {/* New Component handles file input visuals */}
              <FileUploadZone 
                onFileSelect={setFile} 
                selectedFile={file} 
              />

              <div className="card-actions">
                {/* Primary color is now our Teal. Added an orange (secondary) glowing effect on hover */}
                <button 
                  type="submit" 
                  className={`btn btn-primary w-full text-white text-lg normal-case tracking-wide hover:shadow-lg hover:shadow-secondary/30 transition-all ${loading ? 'loading' : ''}`}
                  disabled={!file || loading}
                >
                  {loading ? 'Uploading...' : 'Start Upload'}
                </button>
              </div>
            </form>

          </div>
        </div>

        {/* New component handles alerts */}
        <StatusAlert status={status} />

      </div>
    </div>
  );
}

export default App;