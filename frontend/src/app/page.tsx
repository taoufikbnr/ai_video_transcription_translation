'use client';

import { useEffect, useState } from 'react';
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

  const fetchJob = async()=>{
        try {
          const response = await fetch(`http://localhost:8000/${jobId}`);
          const data = await response.json();
            
          if (data.status === 'completed') {
            setStatus('completed');
            setResult({
              transcription: data.transcription,
              translation: data.translation,
            });
          } else if (data.status === 'error') {
            setStatus('error');
            setError(data.error);
          }
        } catch (err) {
          setStatus('error');
          setError('Failed to fetch status');
      }
  }
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (jobId && status === 'processing') {
      intervalId = setInterval(fetchJob, 2000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [jobId, status]);
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
  const Status = ({status}:any) =>{
    let color;
    switch (status) {
      case "processing":
        color = "bg-yellow-500"
        break;
      case "uploading":
        color = "bg-blue-500"
        break;
      case "completed":
        color = "bg-green-500"
        break;
      default:
        color = "bg-gray-500"
        break;
    }
    return <span className={`px-2 rounded-md ${color} text-white`} >{status}</span>
  }
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-black text-4xl font-bold text-center mb-8">Video Transcription & Translation</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          <div className='flex justify-between'>
            <label className="text-black text-sm font-medium">
              Upload MP4 Video
            </label>
          <Status status={status}/>
          </div>
            <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 ">
            <div className="flex justify-center px-6 py-5 border-2 border-gray-300 border-dashed rounded-md">
              <div className="">
                <FaFileUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <span>Upload a file</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept=".mp4"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
              </div>
            </div>
            </label>
            <select
              value={selectedLanguage}
              required
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="text-black w-full mt-1 py-2 border-1  border-gray-300  focus:outline-none rounded-md"
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
            disabled={!file|| !selectedLanguage || status === 'uploading' || status === 'processing'}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-700  disabled:opacity-50"
          >
             Submit
          </button>
        </form>
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
        {result && (
          <div className="flex">
            <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Original Transcription</h2>
              <p className="text-gray-700">{result.transcription}</p>
            </div>
            
            <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Translation in {selectedLanguage}</h2>
              <p className="text-gray-700">{result.translation}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}