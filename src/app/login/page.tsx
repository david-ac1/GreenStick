'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const [apiKey, setApiKey] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const success = await login(apiKey);

        if (success) {
            router.push('/');
        } else {
            setError('Invalid API key. Please try again.');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="size-12 bg-white/10 rounded flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-2xl">terminal</span>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">GREENSTICK</h1>
                    <p className="text-slate-500 text-sm mt-1 font-mono">Incident Response Agent</p>
                </div>

                {/* Login Form */}
                <div className="bg-white/5 border border-white/10 rounded-sm p-6">
                    <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                        Enter Access Key
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="sk_greenstick_..."
                                className="w-full px-4 py-3 bg-black border border-white/20 rounded-sm text-white font-mono text-sm focus:outline-none focus:border-white/50 placeholder:text-slate-600"
                                disabled={loading}
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-sm">
                                <p className="text-rose-400 text-xs font-medium">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !apiKey}
                            className="w-full px-4 py-3 bg-white text-black font-bold text-sm uppercase tracking-widest rounded-sm hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-sm">lock_open</span>
                                    Authenticate
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-4 border-t border-white/10">
                        <p className="text-slate-500 text-[10px] text-center font-mono">
                            Request access key from your system administrator
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-slate-600 text-[10px] font-mono">
                        SECURE CONNECTION • END-TO-END ENCRYPTED
                    </p>
                </div>
            </div>
        </div>
    );
}
