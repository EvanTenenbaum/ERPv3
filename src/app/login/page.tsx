"use client";
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await signIn('credentials', { username, password, redirect: false });
    if (res?.error) {
      setError('Invalid credentials');
    } else {
      router.replace('/');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white p-6 rounded shadow">
        <h1 className="text-xl font-semibold mb-4">Sign in</h1>
        {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
        <label className="block text-sm font-medium">Username</label>
        <input className="w-full border rounded px-3 py-2 mb-3" value={username} onChange={(e)=>setUsername(e.target.value)} required />
        <label className="block text-sm font-medium">Password</label>
        <input type="password" className="w-full border rounded px-3 py-2 mb-4" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Sign in</button>
      </form>
    </div>
  );
}

