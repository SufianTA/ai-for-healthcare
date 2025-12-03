'use client';

import { useEffect, useMemo, useState } from 'react';
import type { UserSummary } from '../../lib/api';
import { apiGet } from '../../lib/api';
import { useAuth } from '../../components/auth-context';

export default function DashboardPage() {
  const { token, loading, user } = useAuth();
  const [summary, setSummary] = useState<UserSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fastestTime = useMemo(() => {
    if (!summary) return null;
    const fastest = Math.min(
      ...summary.task_details.map((t) => (t.best_time_seconds === null ? Number.MAX_SAFE_INTEGER : t.best_time_seconds))
    );
    return fastest === Number.MAX_SAFE_INTEGER ? null : fastest;
  }, [summary]);

  useEffect(() => {
    if (!token) return;
    apiGet<UserSummary>('/attempts/me/summary', token)
      .then(setSummary)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load dashboard'));
  }, [token]);

  const progress = useMemo(() => {
    if (!summary) return 0;
    return summary.total_tasks === 0 ? 0 : Math.round((summary.proficient_tasks / summary.total_tasks) * 100);
  }, [summary]);

  if (loading) {
    return <div className="card">Loading profile…</div>;
  }

  if (!token) {
    return <div className="card">Log in or create an account to see your attempts.</div>;
  }

  if (error) {
    return <div className="card">{error}</div>;
  }

  if (!summary) {
    return <div className="card">No attempt data yet. Run your first task to populate metrics.</div>;
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
      <div className="card">
        <div className="flex-between">
          <div>
            <p className="muted" style={{ margin: 0 }}>
              Welcome
            </p>
            <h2 style={{ margin: '2px 0 6px' }}>{user?.full_name || user?.email}</h2>
          </div>
          <div className="badge">Dashboard</div>
        </div>
        <p className="muted">Track how many tasks you have reached proficiency on.</p>
        <div className="progress" style={{ marginTop: 12 }}>
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        <p style={{ marginTop: 8, fontWeight: 600 }}>
          {summary.proficient_tasks} / {summary.total_tasks} tasks proficient
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Highlights</h3>
        <div className="small-grid">
          <div className="status">
            <p className="muted" style={{ margin: '0 0 4px' }}>Best score</p>
            <strong>{Math.max(...summary.task_details.map((t) => t.best_score || 0)) || '—'}</strong>
          </div>
          <div className="status">
            <p className="muted" style={{ margin: '0 0 4px' }}>Fastest time</p>
            <strong>{fastestTime ? `${fastestTime}s` : '—'}</strong>
          </div>
        </div>
      </div>

      <div className="card" style={{ gridColumn: '1 / span 2' }}>
        <div className="flex-between" style={{ marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>Per-task metrics</h3>
          <div className="badge">Attempts</div>
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {summary.task_details.map((task) => (
            <div key={task.task_id} className="card" style={{ padding: 14 }}>
              <div className="flex-between">
                <strong>{task.task_name}</strong>
                <span className="muted">#{task.task_id}</span>
              </div>
              <p style={{ marginBottom: 6 }}>
                Best time: <strong>{task.best_time_seconds ? `${task.best_time_seconds}s` : '—'}</strong>
              </p>
              <p style={{ margin: 0 }}>
                Best score: <strong>{task.best_score ?? '—'}</strong>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
