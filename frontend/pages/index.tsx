import { useState } from 'react';

export default function Home() {
  const [backendMessage, setBackendMessage] = useState<string>('');

  const pingBackend = async () => {
    try {
      const res = await fetch('http://localhost:8000/health');
      const data = await res.json();
      setBackendMessage(data.message);
    } catch (error) {
      setBackendMessage('Failed to reach backend');
      console.error('Error pinging backend:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Hub Frontend</h1>
      <button
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        onClick={pingBackend}
      >
        Ping Backend
      </button>
      {backendMessage && <p className="mt-6 text-lg">{backendMessage}</p>}
    </div>
  );
}
