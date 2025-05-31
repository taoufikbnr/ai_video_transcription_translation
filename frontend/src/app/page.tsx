'use client';

import { useState } from 'react';
import { FaFileUpload } from 'react-icons/fa';

const languages = [
  { value: 'spanish', label: 'Spanish' },
  { value: 'french', label: 'French' },
  { value: 'german', label: 'German' },
  { value: 'italian', label: 'Italian' },
  { value: 'portuguese', label: 'Portuguese' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'korean', label: 'Korean' },
  { value: 'chinese', label: 'Chinese' },
];

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<Results | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedLanguage) return;

    setStatus('uploading');
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_language', selectedLanguage);

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setJobId(data.job_id);
      setStatus('processing');
    } catch (err) {
      setStatus('error');
      setError('Failed to upload video');
    }
  };
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-black text-4xl font-bold text-center mb-8">Video Transcription & Translation</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
            <label className="text-black text-sm font-medium">
              Upload MP4 Video
            </label>
            <div className="mt-1 flex justify-center px-6 py-5 border-2 border-gray-300 border-dashed rounded-md">
              <div className="">
                <FaFileUpload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 ">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept=".mp4"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
              </div>
            </div>
            <select
              value={selectedLanguage}
              required
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="text-black w-full py-2 border-1  border-gray-300  focus:outline-none rounded-md"
            >
              <option value="">Select a language</option>
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          <button
            type="submit"
            disabled={!file}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-700  disabled:opacity-50"
          >
             {status === 'uploading' ? 'Uploading...' : 
             status === 'processing' ? 'Processing...' : 
             'Submit'}
          </button>
        </form>


      </div>
    </main>
  );
}