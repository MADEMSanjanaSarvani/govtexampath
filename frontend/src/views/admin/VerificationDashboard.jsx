import React, { useState, useEffect, useCallback } from 'react';
import {
  FiShield, FiCheckCircle, FiAlertTriangle, FiClock,
  FiPlay, FiThumbsUp, FiThumbsDown, FiRefreshCw, FiZap, FiCheckSquare,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import SEO from '../../components/common/SEO';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  getVerificationStats,
  getVerificationLogs,
  getManualReviews,
  triggerVerification,
  enrichReviews,
  approveReview,
  rejectReview,
  getPendingReviewsSummary,
  bulkApproveReviews,
} from '../../services/adminService';

// ── Stat card ─────────────────────────────────────────────────────────────────

const StatCard = ({ icon: Icon, label, value, color }) => {
  const colors = {
    green:  'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    amber:  'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    blue:   'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    gray:   'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colors[color] || colors.gray}`}>
          <Icon className="w-5 h-5" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value ?? '—'}</p>
    </div>
  );
};

// ── Action badge ──────────────────────────────────────────────────────────────

const ActionBadge = ({ action }) => {
  const map = {
    auto_fixed:       'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    queued_for_review:'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    no_action:        'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
  };
  const label = { auto_fixed: 'Auto-Fixed', queued_for_review: 'Queued', no_action: 'Clean' };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${map[action] || map.no_action}`}>
      {label[action] || action}
    </span>
  );
};

// ── Status badge ──────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const map = {
    pending:       'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    approved:      'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    rejected:      'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    auto_resolved: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${map[status] || ''}`}>
      {status?.replace('_', ' ')}
    </span>
  );
};

// ── Main dashboard ─────────────────────────────────────────────────────────────

const VerificationDashboard = () => {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [pendingSummary, setPendingSummary] = useState([]);
  const [reviewTab, setReviewTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const [bulkApprovingRunId, setBulkApprovingRunId] = useState(null); // null = none, 'all' = the all-pending button, or a runId
  const [loadError, setLoadError] = useState(null); // names of the panels whose request failed, so partial data is never mistaken for empty data
  const [waking, setWaking] = useState(false); // every request failed at once — treat as a sleeping backend and retry rather than reporting an error

  const load = useCallback(async () => {
    // allSettled, not all. With Promise.all a single failing request rejected
    // the lot, so every panel stayed at its initial value and the page read as
    // "Total Logs 0 / Pending Review 0 / Last Run Never" — indistinguishable
    // from a genuinely empty database, while pending reviews were in fact
    // waiting. That is the worst way for this page to fail, because the zeros
    // look like an answer.
    //
    // Every request failing together is a different signal from one failing:
    // it is the shape of a backend that is asleep rather than broken. Render's
    // free tier stops the instance when idle, and the keep-alive ping in
    // server.js cannot help because it only runs while the process is alive —
    // once stopped, nothing wakes it until a request arrives, and the request
    // that does the waking is the one that times out. So an all-fail result is
    // retried automatically instead of being handed to the reader as an error
    // they have to act on: the first attempt is what wakes the instance, and a
    // later one lands after it is up.
    const attemptLoad = async (attempt) => {
      const [s, l, r, ps] = await Promise.allSettled([
        getVerificationStats(),
        getVerificationLogs({ limit: 30, action: 'auto_fixed' }),
        getManualReviews({ status: reviewTab }),
        getPendingReviewsSummary(),
      ]);

      if (s.status === 'fulfilled') setStats(s.value);
      if (l.status === 'fulfilled') setLogs(l.value.logs || []);
      if (r.status === 'fulfilled') setReviews(r.value.reviews || []);
      if (ps.status === 'fulfilled') setPendingSummary(ps.value);

      const failed = [
        s.status === 'rejected' && 'stats',
        l.status === 'rejected' && 'auto-fix log',
        r.status === 'rejected' && 'manual reviews',
        ps.status === 'rejected' && 'pending summary',
      ].filter(Boolean);

      const RETRY_DELAYS_MS = [6000, 15000];
      if (failed.length === 4 && attempt < RETRY_DELAYS_MS.length) {
        setWaking(true);
        setLoadError(null);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS_MS[attempt]));
        return attemptLoad(attempt + 1);
      }

      setWaking(false);
      if (failed.length) {
        setLoadError(failed);
        toast.error(`Couldn't load: ${failed.join(', ')}. Try Refresh.`);
      } else {
        setLoadError(null);
      }
    };

    await attemptLoad(0);
    setLoading(false);
  }, [reviewTab]);

  useEffect(() => { load(); }, [load]);

  const handleRun = async () => {
    setRunning(true);
    try {
      const result = await triggerVerification();
      toast.success(`Run complete — ${result.autoFixed} auto-fixed, ${result.queued} queued`);
      await load();
    } catch {
      toast.error('Verification run failed');
    } finally {
      setRunning(false);
    }
  };

  const handleEnrich = async () => {
    setEnriching(true);
    try {
      const result = await enrichReviews();
      toast.success(`AI enriched ${result.enriched}/${result.processed} reviews`);
      await load();
    } catch {
      toast.error('AI enrichment failed');
    } finally {
      setEnriching(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const r = await approveReview(id);
      toast.success(`Applied ${r.changes?.length || 0} change(s) to "${r.exam}"`);
      setReviews(prev => prev.filter(rv => rv._id !== id));
      setStats(s => s ? { ...s, pendingReviews: Math.max(0, (s.pendingReviews || 1) - 1) } : s);
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Approve failed');
    }
  };

  const handleBulkApprove = async (runId, count) => {
    const label = runId ? `this batch (${count} exam${count === 1 ? '' : 's'})` : `ALL pending changes (${count} exams)`;
    if (!window.confirm(`Apply ${label} to the live site? This updates dates, vacancies, and fees directly — double-check you trust this batch before continuing.`)) {
      return;
    }
    setBulkApprovingRunId(runId || 'all');
    try {
      const result = await bulkApproveReviews(runId);
      if (result.failed > 0) {
        toast.error(`Applied ${result.applied}, but ${result.failed} failed — check server logs`);
      } else {
        toast.success(`Applied ${result.applied} exam${result.applied === 1 ? '' : 's'} to the live site`);
      }
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Bulk approve failed');
    } finally {
      setBulkApprovingRunId(null);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectReview(id);
      toast('Review rejected', { icon: '🗑️' });
      setReviews(prev => prev.filter(rv => rv._id !== id));
      setStats(s => s ? { ...s, pendingReviews: Math.max(0, (s.pendingReviews || 1) - 1) } : s);
    } catch {
      toast.error('Reject failed');
    }
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

  const relativeTime = (d) => {
    if (!d) return 'Never';
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 2) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return fmtDate(d);
  };

  return (
    <AdminLayout>
      <SEO title="Verification Dashboard" path="/admin/verification" description="Monitor and manage automated exam data verification." noindex />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">Verification Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Automated exam data integrity monitoring
            {stats?.lastRunAt && ` · Last run: ${fmtDate(stats.lastRunAt)}`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleEnrich}
            disabled={enriching || running}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-all"
          >
            {enriching ? <FiRefreshCw className="w-4 h-4 animate-spin" /> : <FiZap className="w-4 h-4" />}
            AI Enrich
          </button>
          <button
            onClick={handleRun}
            disabled={running || enriching}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold disabled:opacity-50 transition-all shadow-sm"
          >
            {running ? <FiRefreshCw className="w-4 h-4 animate-spin" /> : <FiPlay className="w-4 h-4" />}
            Run Now
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" className="min-h-[40vh]" />
      ) : (
        <>
          {/* A failed request leaves its panel showing zeros, which read as a real
              answer rather than missing data. Say so on the page, not only in a
              toast that has already faded by the time anyone reads the numbers. */}
          {waking && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-300 bg-blue-50 px-4 py-3 dark:border-blue-800/50 dark:bg-blue-900/20">
              <FiClock className="mt-0.5 h-5 w-5 flex-shrink-0 animate-pulse text-blue-600 dark:text-blue-400" />
              <div className="text-sm">
                <p className="font-semibold text-blue-900 dark:text-blue-300">Waking the backend…</p>
                <p className="mt-0.5 text-blue-800 dark:text-blue-400">
                  It sleeps when idle, so the first request has to start it. Retrying — this usually takes under a minute.
                </p>
              </div>
            </div>
          )}

          {loadError && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 dark:border-amber-800/50 dark:bg-amber-900/20">
              <FiAlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
              <div className="text-sm">
                <p className="font-semibold text-amber-900 dark:text-amber-300">
                  Couldn't load: {loadError.join(', ')}
                </p>
                <p className="mt-0.5 text-amber-800 dark:text-amber-400">
                  Any figures below from those sections are not real values. The backend sleeps when idle and can take up to a minute to wake — use Refresh.
                </p>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={FiShield} label="Total Logs" value={stats?.totalLogs ?? 0} color="blue" />
            <StatCard icon={FiCheckCircle} label="Auto-Fixed (7d)" value={stats?.recentAutoFixed ?? 0} color="green" />
            <StatCard icon={FiAlertTriangle} label="Pending Review" value={stats?.pendingReviews ?? 0} color="amber" />
            <StatCard icon={FiClock} label="Last Run" value={relativeTime(stats?.lastRunAt)} color="gray" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Recent auto-fixes */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">Recent Auto-Fixes</h2>
                <span className="text-xs text-gray-400">{logs.length} shown</span>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-gray-700/50 max-h-[480px] overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="text-sm text-gray-400 p-5 text-center">No auto-fixes yet</p>
                ) : logs.map((log) => (
                  <div key={log._id} className="px-5 py-3">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-snug line-clamp-1">
                        {log.examTitle}
                      </p>
                      <ActionBadge action={log.action} />
                    </div>
                    {log.changes?.length > 0 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {log.changes.map(c => `${c.field}: ${c.oldValue} → ${c.newValue}`).join(', ')}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">{fmtDate(log.timestamp)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Manual reviews */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100 mr-auto">Manual Reviews</h2>
                {['pending', 'approved', 'rejected'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setReviewTab(tab)}
                    className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                      reviewTab === tab
                        ? 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              {reviewTab === 'pending' && pendingSummary.length > 0 && (
                <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {pendingSummary.reduce((sum, s) => sum + s.count, 0)} total pending, by verification run
                    </p>
                    <button
                      onClick={() => handleBulkApprove(null, pendingSummary.reduce((sum, s) => sum + s.count, 0))}
                      disabled={bulkApprovingRunId !== null}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold disabled:opacity-50 transition-all"
                    >
                      {bulkApprovingRunId === 'all' ? <FiRefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FiCheckSquare className="w-3.5 h-3.5" />}
                      Approve All Pending
                    </button>
                  </div>
                  <div className="space-y-1">
                    {pendingSummary.map((s) => (
                      <div key={s.runId} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-300 font-mono truncate mr-2">{s.runId}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-gray-400">{s.count} exam{s.count === 1 ? '' : 's'}</span>
                          <button
                            onClick={() => handleBulkApprove(s.runId, s.count)}
                            disabled={bulkApprovingRunId !== null}
                            className="px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 font-medium disabled:opacity-50 transition-all"
                          >
                            {bulkApprovingRunId === s.runId ? '...' : 'Approve batch'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="divide-y divide-gray-50 dark:divide-gray-700/50 max-h-[480px] overflow-y-auto">
                {reviews.length === 0 ? (
                  <p className="text-sm text-gray-400 p-5 text-center">
                    {reviewTab === 'pending' ? 'No items pending review' : `No ${reviewTab} reviews`}
                  </p>
                ) : reviews.map((rv) => (
                  <div key={rv._id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2">
                        {rv.examTitle}
                      </p>
                      <StatusBadge status={rv.status} />
                    </div>

                    <ul className="text-xs text-gray-500 dark:text-gray-400 mb-2 space-y-0.5">
                      {rv.issues?.map((issue, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-500 mt-0.5">⚠</span> {issue}
                        </li>
                      ))}
                    </ul>

                    {rv.suggestions?.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Suggested fixes:</p>
                        {rv.suggestions.map((s, i) => (
                          <div key={i} className="mb-0.5">
                            <p className="text-xs text-green-700 dark:text-green-400">
                              {s.field}: <span className="line-through text-gray-400">{String(s.currentValue ?? '—')}</span>{' '}
                              → <strong>{String(s.suggestedValue)}</strong>
                            </p>
                            {s.reason && (
                              <p className="text-xs text-gray-400 pl-2">{s.reason}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {rv.status === 'pending' && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleApprove(rv._id)}
                          disabled={!rv.suggestions?.length}
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          <FiThumbsUp className="w-3.5 h-3.5" /> Apply
                        </button>
                        <button
                          onClick={() => handleReject(rv._id)}
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-all"
                        >
                          <FiThumbsDown className="w-3.5 h-3.5" /> Dismiss
                        </button>
                      </div>
                    )}

                    {rv.status !== 'pending' && rv.resolvedAt && (
                      <p className="text-xs text-gray-400 mt-1">{rv.status} on {fmtDate(rv.resolvedAt)}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default VerificationDashboard;
