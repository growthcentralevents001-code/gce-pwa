"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Eye, Database, Trash2, Download, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

export default function PrivacySettingsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExportData = async () => {
    setLoading(true);
    setMessage(null);
    try {
      // Simulate data export
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessage({ type: 'success', text: 'Data export started! You will receive an email shortly.' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to export data. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
    setLoading(true);
    setMessage(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessage({ type: 'success', text: 'Account deletion request submitted. You will receive a confirmation email.' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete account. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Orange Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/settings" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition mb-4">
            <ArrowLeft size={18} /> Back to Settings
          </Link>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Shield className="text-white/90" size={32} />
            Privacy Settings
          </h1>
          <p className="text-orange-100 mt-1 text-sm">Manage your data and privacy preferences</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {message && (
            <div className={`p-4 rounded-xl flex items-start gap-3 ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Data Export */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <Download size={20} className="text-orange-500" />
                Export Your Data
              </h2>
              <p className="text-sm text-slate-500 mt-1">Get a copy of all your data in machine-readable format</p>
            </div>
            <div className="p-6">
              <button
                onClick={handleExportData}
                disabled={loading}
                className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition flex items-center gap-2 disabled:opacity-50"
              >
                <Download size={18} /> {loading ? 'Processing...' : 'Export Data'}
              </button>
            </div>
          </div>

          {/* Account Deletion */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <Trash2 size={20} className="text-red-500" />
                Delete Account
              </h2>
              <p className="text-sm text-slate-500 mt-1">Permanently delete your account and all associated data</p>
            </div>
            <div className="p-6">
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition flex items-center gap-2 disabled:opacity-50"
              >
                <Trash2 size={18} /> {loading ? 'Processing...' : 'Delete Account'}
              </button>
              <p className="text-xs text-slate-400 mt-2">This action is irreversible. All your data will be permanently removed.</p>
            </div>
          </div>

          {/* Data Usage */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <Database size={20} className="text-orange-500" />
                Data Usage
              </h2>
              <p className="text-sm text-slate-500 mt-1">How we use your data</p>
            </div>
            <div className="p-6 space-y-3 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <Eye size={16} className="text-orange-500" />
                We collect data to improve your experience
              </p>
              <p className="flex items-center gap-2">
                <Shield size={16} className="text-orange-500" />
                We never share your data with third parties
              </p>
              <p className="flex items-center gap-2">
                <Database size={16} className="text-orange-500" />
                Your data is stored securely in India
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
