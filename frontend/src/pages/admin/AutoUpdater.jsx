import React, { useState, useEffect, useCallback } from 'react';
import { FiRefreshCw, FiPlus, FiTrash2, FiEdit2, FiCheck, FiX, FiActivity, FiClock, FiAlertCircle, FiGlobe } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  getScraperStats,
  getSources,
  addSource,
  updateSource,
  deleteSource,
  reapplyDateCorrections,
  triggerCheck,
  getLogs,
  triggerCurrentAffairsScrape,
  triggerDateVerification,
} from '../../services/scraperService';

const CATEGORIES = [
  'SSC', 'UPSC', 'Banking', 'Railways', 'State PSC', 'Defence',
  'Teaching', 'Police', 'Insurance', 'Regulatory Bodies', 'PSU',
  'Judiciary', 'Agriculture', 'Postal', 'Healthcare', 'Miscellaneous',
];

const AutoUpdater = () => {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [sources, setSources] = useState([]);
  const [logs, setLogs] = useState([]);
  const [logPagination, setLogPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [verifyingDates, setVerifyingDates] = useState(false);
  const [scrapingCA, setScrapingCA] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', conductingBody: '', category: 'UPSC', url: '', selector: 'body', checkIntervalHours: 6,
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, sourcesRes] = await Promise.all([
        getScraperStats(),
        getSources(),
      ]);
      setStats(statsRes);
      setSources(Array.isArray(sourcesRes) ? sourcesRes : []);
    } catch (err) {
      toast.error('Failed to load scraper data');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadLogs = useCallback(async (page = 1, type = '') => {
    try {
      const res = await getLogs({ page, limit: 30, type });
      setLogs(res.logs || []);
      setLogPagination(res.pagination || {});
    } catch (err) {
      toast.error('Failed to load logs');
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (tab === 'logs') loadLogs();
  }, [tab, loadLogs]);

  const handleTriggerAll = async () => {
    setChecking(true);
    try {
      const res = await triggerCheck();
      const changed = res.data.filter(r => r.changed).length;
      toast.success(`Check complete. ${changed} source(s) had updates.`);
      loadData();
    } catch (err) {
      toast.error('Failed to run check');
    } finally {
      setChecking(false);
    }
  };

  const handleVerifyDates = async () => {
    setVerifyingDates(true);
    try {
      const res = await triggerDateVerification();
      toast.success(`Date verification complete. ${res.data.updated} exam(s) updated, ${res.data.verified} confirmed.`);
      loadData();
    } catch (err) {
      toast.error('Failed to verify dates');
    } finally {
      setVerifyingDates(false);
    }
  };

  const handleScrapeCurrentAffairs = async () => {
    setScrapingCA(true);
    try {
      const res = await triggerCurrentAffairsScrape();
      toast.success(`Current affairs scraped. ${res.data.saved} new articles added.`);
    } catch (err) {
      toast.error('Failed to scrape current affairs');
    } finally {
      setScrapingCA(false);
    }
  };

  const handleTriggerOne = async (id) => {
    try {
      const res = await triggerCheck(id);
      toast.success(res.data.changed ? 'Changes detected!' : 'No changes found.');
      loadData();
    } catch (err) {
      toast.error('Check failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateSource(editingId, formData);
        toast.success('Source updated');
      } else {
        await addSource(formData);
        toast.success('Source added');
      }
      setShowAddForm(false);
      setEditingId(null);
      setFormData({ name: '', conductingBody: '', category: 'UPSC', url: '', selector: 'body', checkIntervalHours: 6 });
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this source?')) return;
    try {
      await deleteSource(id);
      toast.success('Source deleted');
      loadData();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleToggleActive = async (source) => {
    try {
      await updateSource(source._id, { isActive: !source.isActive });
      loadData();
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  const startEdit = (source) => {
    setEditingId(source._id);
    setFormData({
      name: source.name,
      conductingBody: source.conductingBody,
      category: source.category,
      url: source.url,
      selector: source.selector || 'body',
      checkIntervalHours: source.checkIntervalHours || 6,
    });
    setShowAddForm(true);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Auto Updater</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Automated exam monitoring &amp; update system
            </p>
          </div>
          <div className="flex gap-2 mt-3 sm:mt-0">
            <button
              onClick={handleScrapeCurrentAffairs}
              disabled={scrapingCA}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors"
            >
              <FiGlobe className={`w-4 h-4 ${scrapingCA ? 'animate-spin' : ''}`} />
              {scrapingCA ? 'Scraping...' : 'Scrape Current Affairs'}
            </button>
            <button
              onClick={handleVerifyDates}
              disabled={verifyingDates}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors"
            >
              <FiCheck className={`w-4 h-4 ${verifyingDates ? 'animate-pulse' : ''}`} />
              {verifyingDates ? 'Verifying...' : 'Verify All Dates'}
            </button>
            <button
              onClick={handleTriggerAll}
              disabled={checking}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              <FiRefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
              {checking ? 'Checking...' : 'Run All Checks Now'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-6">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'sources', label: 'Sources' },
            { id: 'logs', label: 'Activity Logs' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                tab === t.id
                  ? 'bg-white dark:bg-gray-700 text-primary-700 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === 'overview' && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={FiGlobe} label="Active Sources" value={stats.activeSources} total={stats.totalSources} color="blue" />
              <StatCard icon={FiActivity} label="Changes (24h)" value={stats.recentChanges} color="green" />
              <StatCard icon={FiAlertCircle} label="Errors (24h)" value={stats.recentErrors} color="red" />
              <StatCard icon={FiClock} label="Total Logs" value={stats.totalLogs} color="purple" />
            </div>
            {stats.lastCheck && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Last check: <span className="font-medium text-gray-900 dark:text-white">{stats.lastCheck.source}</span>
                  {' '}at{' '}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(stats.lastCheck.at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                  </span>
                </p>
              </div>
            )}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">How it works (AI-Powered)</h3>
              <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
                <li>The system checks 25+ sources (FreeJobAlert, Sarkari Result, and direct govt sites) every 2-6 hours</li>
                <li>Uses reliable aggregator sites to avoid govt website blocks — all 16 exam categories covered</li>
                <li>When content changes are detected, <strong>Gemini AI</strong> intelligently extracts dates and exam details</li>
                <li>AI validates all proposed changes before updating the database — preventing wrong data</li>
                <li>AI correctly matches updates to the right exam using context understanding</li>
                <li>Users receive real-time notifications about verified changes</li>
                <li>Falls back to regex extraction if AI is unavailable</li>
                <li>You can add custom sources or trigger manual checks at any time</li>
              </ul>
            </div>
          </div>
        )}

        {/* Sources Tab */}
        {tab === 'sources' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => { setShowAddForm(!showAddForm); setEditingId(null); setFormData({ name: '', conductingBody: '', category: 'UPSC', url: '', selector: 'body', checkIntervalHours: 6 }); }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                Add Source
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="text" placeholder="Source Name" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} required className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                  <input type="text" placeholder="Conducting Body" value={formData.conductingBody} onChange={e => setFormData(p => ({ ...p, conductingBody: e.target.value }))} required className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                  <select value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input type="number" placeholder="Check interval (hours)" value={formData.checkIntervalHours} onChange={e => setFormData(p => ({ ...p, checkIntervalHours: parseInt(e.target.value) || 6 }))} min="1" max="48" className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                </div>
                <input type="url" placeholder="URL to monitor" value={formData.url} onChange={e => setFormData(p => ({ ...p, url: e.target.value }))} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                <input type="text" placeholder="CSS Selector (default: body)" value={formData.selector} onChange={e => setFormData(p => ({ ...p, selector: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                <div className="flex gap-2">
                  <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm">
                    <FiCheck className="w-4 h-4" /> {editingId ? 'Update' : 'Add'}
                  </button>
                  <button type="button" onClick={() => { setShowAddForm(false); setEditingId(null); }} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm">
                    <FiX className="w-4 h-4" /> Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {sources.map(source => (
                <div key={source._id} className={`bg-white dark:bg-gray-800 rounded-lg border p-4 ${source.isActive ? 'border-gray-200 dark:border-gray-700' : 'border-red-200 dark:border-red-800 opacity-60'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">{source.name}</h3>
                        <span className="px-2 py-0.5 text-xs rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">{source.category}</span>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${source.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {source.isActive ? 'Active' : 'Paused'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{source.url}</p>
                      <div className="flex gap-4 mt-1 text-xs text-gray-400 dark:text-gray-500">
                        <span>Every {source.checkIntervalHours}h</span>
                        {source.lastChecked && <span>Last: {new Date(source.lastChecked).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>}
                        {source.consecutiveFailures > 0 && <span className="text-red-500">{source.consecutiveFailures} failures</span>}
                      </div>
                      {source.lastError && <p className="text-xs text-red-500 mt-1 truncate">{source.lastError}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => handleTriggerOne(source._id)} className="p-2 text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" title="Check now">
                        <FiRefreshCw className="w-4 h-4" />
                      </button>
                      <button onClick={() => startEdit(source)} className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="Edit">
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleToggleActive(source)} className="p-2 text-gray-500 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors" title={source.isActive ? 'Pause' : 'Activate'}>
                        {source.isActive ? <FiX className="w-4 h-4" /> : <FiCheck className="w-4 h-4" />}
                      </button>
                      <button onClick={() => handleDelete(source._id)} className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors" title="Delete">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {sources.length === 0 && (
                <p className="text-center py-8 text-gray-500 dark:text-gray-400">No sources configured. Add one to get started.</p>
              )}
            </div>
          </div>
        )}

        {/* Logs Tab */}
        {tab === 'logs' && (
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {['', 'change_detected', 'exam_updated', 'error'].map(type => (
                <button key={type} onClick={() => loadLogs(1, type)} className="px-3 py-1.5 text-xs rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  {type || 'All'}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {logs.map(log => (
                <div key={log._id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          log.type === 'change_detected' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : log.type === 'exam_updated' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : log.type === 'exam_created' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                          : log.type === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {log.type.replace(/_/g, ' ')}
                        </span>
                        {log.source && <span className="text-xs text-gray-500 dark:text-gray-400">{log.source.name}</span>}
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{log.details}</p>
                      {log.exam && <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">Exam: {log.exam.title}</p>}
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                    </span>
                  </div>
                </div>
              ))}
              {logs.length === 0 && (
                <p className="text-center py-8 text-gray-500 dark:text-gray-400">No logs yet. Run a check to see activity.</p>
              )}
            </div>
            {logPagination.pages > 1 && (
              <div className="flex justify-center gap-2 pt-2">
                {Array.from({ length: Math.min(logPagination.pages, 5) }, (_, i) => (
                  <button key={i} onClick={() => loadLogs(i + 1)} className={`px-3 py-1 text-sm rounded ${logPagination.page === i + 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

const StatCard = ({ icon: Icon, label, value, total, color }) => {
  const colors = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}{total !== undefined && <span className="text-sm font-normal text-gray-400">/{total}</span>}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        </div>
      </div>
    </div>
  );
};

export default AutoUpdater;
