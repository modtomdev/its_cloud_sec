import React, { useState } from 'react';

function Header() {
  return (
    <header className="w-full max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand flex items-center justify-center text-white font-bold shadow-sm">S</div>
          <h1 className="text-lg font-semibold">S3 Uploader</h1>
        </div>
        <nav className="text-sm text-gray-600">
          <span className="px-3">Docs</span>
          <span className="px-3">About</span>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="w-full max-w-4xl mx-auto px-6 py-6 text-sm text-gray-500">
      <div className="flex justify-between">
        <span>© {new Date().getFullYear()} S3 Uploader</span>
        <span>Made with <span className="text-accent">❤</span></span>
      </div>
    </footer>
  );
}

function UploadCard({ onUpload }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    if (file.size > 1024 * 1024 * 1024) {
      setStatus('File is too large (Max 1GB)');
      return;
    }

    setLoading(true);
    setStatus('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      if (response.ok) {
        const data = await response.json();
        setStatus(`Success! ${data.filename}`);
        if (onUpload) onUpload(data);
      } else {
        setStatus('Upload failed.');
      }
    } catch (err) {
      console.error(err);
      setStatus('Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-md p-6">
      <form onSubmit={handleUpload} className="flex flex-col gap-4">
        <label className="text-sm text-gray-600">Select file (max 1GB)</label>

        <label className="flex items-center justify-between gap-4 p-3 border border-dashed rounded-lg cursor-pointer hover:border-brand transition-colors">
          <input type="file" onChange={handleFileChange} className="hidden" />
          <div className="flex-1">
            <div className="text-sm text-gray-700">{file ? file.name : 'No file chosen'}</div>
            <div className="text-xs text-gray-400">{file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'Click to select'}</div>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-2 bg-brand text-white rounded-md">Choose</div>
        </label>

        <button
          type="submit"
          disabled={!file || loading}
          className={`w-full py-3 rounded-lg font-semibold text-white ${loading ? 'opacity-70' : ''}`.trim()}
          style={{ background: 'linear-gradient(90deg, #0ea5a4 0%, #06b6d4 100%)' }}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>

        {status && (
          <div className={`text-sm mt-2 ${status.toLowerCase().includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {status}
          </div>
        )}
      </form>
    </div>
  );
}

export default function App() {
  const [lastUpload, setLastUpload] = useState(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between">
      <Header />

      <main className="flex-1 w-full flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <section className="max-w-lg">
            <h2 className="text-2xl font-semibold mb-3">Secure uploads, minimal UI</h2>
            <p className="text-gray-600 mb-6">Drag or pick a file and upload it to your configured S3 bucket. Designed to be simple and focused.</p>
            <div className="flex items-center gap-3">
              <div className="px-3 py-2 bg-brand-light rounded-md text-brand-dark text-sm">Teal</div>
              <div className="px-3 py-2 bg-accent-light rounded-md text-accent-dark text-sm">Orange</div>
            </div>
            {lastUpload && (
              <div className="mt-6 p-4 bg-gray-50 border rounded-md text-sm">
                Last uploaded: <strong className="text-gray-800">{lastUpload.filename}</strong>
              </div>
            )}
          </section>

          <section className="flex items-center justify-center">
            <UploadCard onUpload={(d) => setLastUpload(d)} />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}