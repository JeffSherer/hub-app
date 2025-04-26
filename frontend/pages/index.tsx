import { useState, useRef } from 'react';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

export default function Home() {
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState<string>('');
  const [chatbot, setChatbot] = useState<string>('openai');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const sendPrompt = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Add user message to chat history first
      setChatHistory(prev => [...prev, { role: 'user', content: prompt }]);
      
      const res = await fetch(`http://localhost:8000/chatbot/${chatbot}?prompt=${encodeURIComponent(prompt)}`, {
        method: 'POST',
      });
      if (!res.ok) {
        throw new Error('Failed to reach backend.');
      }
      const data = await res.json();
      
      // Add bot response to chat history
      setChatHistory(prev => [...prev, { role: 'bot', content: data.response }]);
      
      setPrompt(''); // Clear input after sending

      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error('Error:', err);
      setError('Error talking to backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-6">Hub Chat</h1>

      <div className="flex flex-col items-center gap-4 mb-4">
        <select
          value={chatbot}
          onChange={(e) => setChatbot(e.target.value)}
          className="p-2 rounded-md border border-gray-300"
        >
          <option value="openai">ChatGPT (OpenAI)</option>
          <option value="claude">Claude (Anthropic)</option>
        </select>

        <div className="bg-white w-full max-w-md p-4 rounded-md shadow-md h-[60vh] overflow-y-auto flex flex-col">
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 my-2 rounded-2xl max-w-xs ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white self-end rounded-br-none'
                  : 'bg-gray-300 text-gray-800 self-start rounded-bl-none'
              }`}
            >
              {msg.content}
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>

        <div className="flex w-full max-w-md gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt..."
            className="p-2 flex-1 rounded-md border border-gray-300"
          />
          <button
            onClick={sendPrompt}
            className={`px-4 py-2 rounded-md text-white ${
              loading || !prompt.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={loading || !prompt.trim()}
          >
            {loading ? '...' : 'Send'}
          </button>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>
    </div>
  );
}
