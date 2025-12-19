import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

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
      // Parametrize port
      const response = await fetch('http://backend:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setStatus(`Success! Uploaded: ${data.filename}`);
      } else {
        setStatus('Upload failed.');
      }
    } catch (error) {
      console.error(error);
      setStatus('Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold mb-8">S3 Uploader</h1>
          
          <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <form onSubmit={handleUpload} className="flex flex-col gap-4">
                
                <div className="form-control w-full max-w-xs">
                  <label className="label">
                    <span className="label-text">Pick a file (Max 1GB)</span>
                  </label>
                  <input 
                    type="file" 
                    onChange={handleFileChange} 
                    className="file-input file-input-bordered file-input-primary w-full max-w-xs" 
                  />
                </div>

                <div className="card-actions justify-end mt-4">
                  <button 
                    type="submit" 
                    className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                    disabled={!file || loading}
                  >
                    {loading ? 'Uploading...' : 'Upload File'}
                  </button>
                </div>
              </form>

              {status && (
                <div className={`alert mt-4 ${status.includes('Success') ? 'alert-success' : 'alert-error'}`}>
                  <span>{status}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;