import { useEffect, useState } from 'react';

interface Job {
  model: string;
  version: string;
  timestamp: string;
  status: string;
  metrics?: {
    accuracy: number;
    loss: number;
    duration: string;
  };
}

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await fetch('https://hub-app-ybxk.onrender.com/fine-tune/jobs');
      const data = await res.json();
      setJobs(data.jobs);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  return (
    <div className="p-8 max-w-3xl mx-auto text-gray-800 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Fine-Tuning Job History</h2>
      <a href="/" className="text-blue-600 underline text-sm mb-4 block">
        ← Back to chatbot
      </a>
      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs submitted yet.</p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job, idx) => (
            <div key={idx} className="p-4 bg-white rounded-md shadow">
              <p><strong>Version:</strong> {job.version}</p>
              <p><strong>Model:</strong> {job.model}</p>
              <p><strong>Status:</strong> {job.status}</p>
              <p><strong>Timestamp:</strong> {new Date(job.timestamp).toLocaleString()}</p>
              {job.status === 'done' && job.metrics && (
                <div className="mt-2 text-sm text-gray-700">
                  <p><strong>Accuracy:</strong> {job.metrics.accuracy}</p>
                  <p><strong>Loss:</strong> {job.metrics.loss}</p>
                  <p><strong>Duration:</strong> {job.metrics.duration}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
