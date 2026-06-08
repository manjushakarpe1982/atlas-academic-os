'use client';

import { Component, ReactNode } from 'react';

interface Props  { children: ReactNode; }
interface State  { hasError: boolean; message: string; }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
          <div className="bg-white border border-red-100 rounded-3xl p-8 max-w-md w-full text-center shadow-xl">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Atlas hit an unexpected error. Your data is safe — this is a display issue only.
            </p>
            {this.state.message && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5 text-left">
                <p className="text-[11px] font-mono text-red-600 break-all">{this.state.message}</p>
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => window.location.reload()}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-md shadow-indigo-500/20">
                Reload page
              </button>
              <a href="/dashboard"
                className="flex-1 border-2 border-gray-200 hover:border-indigo-300 text-gray-600 hover:text-indigo-600 font-bold py-2.5 rounded-xl text-sm transition-all text-center">
                Go to Dashboard
              </a>
            </div>
            <a href="/help" className="text-[11px] text-indigo-500 hover:underline mt-4 block">
              Visit Help Center if this keeps happening
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
