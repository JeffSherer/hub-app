import { useState } from 'react';
import Link from 'next/link';

export default function Train() {
  const [model, setModel] = useState('openai');
  const [version, setVersion] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState('');

  const submitJob = async () => {
    if (!file || !version.trim()) return alert('All fields required');
    const formData = new FormData();
    formData.append('model', model);
    formData.append('version', version);
    formData.append('dataset', file);

    const res = await fetch('https://hub-app-ybxk.onrender.com/fine-tune/submit', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setResponse(JSON.stringify(data, null, 2));
  };

  return (
    <div className="p-8 max-w-xl mx-auto bg-gray-100 text-gray-800 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Fine-Tuning Job Submission</h2>
      <Link href="/" className="text-blue-600 underline text-sm mb-4 block">
        ← Back to chatbot
      </Link>
      <div className="space-y-4">
        <select value={model} onChange={(e) => setModel(e.target.value)} className="w-full p-2 border rounded">
          <option value="openai">OpenAI</option>
          <option value="claude">Claude</option>
        </select>
        <input
          type="text"
          placeholder="Model version name (e.g., v2-batch1)"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full" />
        <button onClick={submitJob} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Submit Job
        </button>
        {response && (
          <pre className="bg-white text-gray-800 p-4 mt-4 rounded whitespace-pre-wrap">{response}</pre>
        )}
      </div>
    </div>
  );
}
