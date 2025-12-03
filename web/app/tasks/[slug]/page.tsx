'use client';

import { useEffect, useMemo, useState } from 'react';
import type { AttemptResponse, ErrorType, Task, TaskStandard } from '../../../lib/api';
import { apiGet, apiPost } from '../../../lib/api';
import { useAuth } from '../../../components/auth-context';

function getToken(token?: string | null) {
  if (typeof window === 'undefined') return token ?? null;
  return token || localStorage.getItem('surgitrack_token');
}

export default function TaskDetail({ params }: { params: { slug: string } }) {
  const { token } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [standards, setStandards] = useState<TaskStandard[]>([]);
  const [errors, setErrors] = useState<ErrorType[]>([]);
  const [selectedStandard, setSelectedStandard] = useState<number | null>(null);
  const [selectedErrorIds, setSelectedErrorIds] = useState<number[]>([]);
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [endedAt, setEndedAt] = useState<Date | null>(null);
  const [result, setResult] = useState<AttemptResponse | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const taskRes = await apiGet<Task>(`/tasks/${params.slug}`);
        setTask(taskRes);
        const [standardsRes, errorsRes] = await Promise.all([
          apiGet<TaskStandard[]>(`/tasks/${taskRes.id}/standards`),
          apiGet<ErrorType[]>(`/error-types`),
        ]);
        setStandards(standardsRes);
        setErrors(errorsRes);
        setSelectedStandard(standardsRes[0]?.id ?? null);
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : 'Failed to load task');
      }
    }
    load();
  }, [params.slug]);

  function toggleError(id: number) {
    setSelectedErrorIds((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]));
  }

  function start() {
    setStatus('Running…');
    setStartedAt(new Date());
    setEndedAt(null);
    setResult(null);
  }

  async function stop() {
    if (!task || !selectedStandard || !startedAt) return;
    const finish = new Date();
    setEndedAt(finish);
    const authToken = getToken(token);
    if (!authToken) {
      setErrorMessage('You need to log in first.');
      return;
    }
    try {
      const payload = {
        task_id: task.id,
        standard_id: selectedStandard,
        started_at: startedAt.toISOString(),
        ended_at: finish.toISOString(),
        errors: selectedErrorIds.map((id) => ({ error_type_id: id })),
      };
      const res = await apiPost<AttemptResponse>('/attempts', payload, authToken);
      setResult(res);
      setStatus(`Score: ${res.score}`);
      setErrorMessage(null);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to save attempt');
    }
  }

  const duration = useMemo(() => {
    if (!startedAt) return null;
    const end = endedAt || new Date();
    return Math.max(0, Math.round((end.getTime() - startedAt.getTime()) / 1000));
  }, [startedAt, endedAt]);

  return (
    <div className="grid" style={{ gridTemplateColumns: '1.2fr 1fr' }}>
      <div className="card">
        <div className="flex-between" style={{ marginBottom: 8 }}>
          <h1 style={{ margin: 0 }}>{task?.name || 'Task'}</h1>
          {task?.category && <span className="badge">{task.category}</span>}
        </div>
        {task?.description && <p className="muted">{task.description}</p>}

        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <p className="muted" style={{ margin: '0 0 8px' }}>Pick a standard</p>
            <select
              className="select"
              value={selectedStandard ?? ''}
              onChange={(e) => setSelectedStandard(Number(e.target.value))}
            >
              {standards.map((std) => (
                <option key={std.id} value={std.id}>
                  {std.level} — target {std.target_time_seconds}s, minor ≤ {std.max_minor_errors}, major ≤{' '}
                  {std.max_major_errors}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="muted" style={{ margin: '0 0 8px' }}>Errors this run</p>
            <div style={{ display: 'grid', gap: 8 }}>
              {errors.map((err) => (
                <label key={err.id} className="pill-row" style={{ justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      checked={selectedErrorIds.includes(err.id)}
                      onChange={() => toggleError(err.id)}
                    />
                    <span>{err.name}</span>
                  </div>
                  <span className="badge">{err.severity}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="pill-row" style={{ marginTop: 16 }}>
          <button className="button" onClick={start} type="button">
            Start timer
          </button>
          <button className="ghost-button" onClick={stop} type="button" disabled={!startedAt}>
            Stop & submit
          </button>
          {duration !== null && <span className="pill">Elapsed: {duration}s</span>}
        </div>

        {status && <p style={{ color: '#22d3ee' }}>{status}</p>}
        {errorMessage && <p style={{ color: '#f87171' }}>{errorMessage}</p>}
      </div>

      <div className="card" style={{ alignSelf: 'start' }}>
        <h3 style={{ marginTop: 0 }}>Result</h3>
        {!result && <p className="muted">Start and stop the timer to score an attempt.</p>}
        {result && (
          <div style={{ display: 'grid', gap: 6 }}>
            <div className="status">
              <strong>Score:</strong> {result.score}
            </div>
            <div className="status">
              <strong>Proficiency:</strong> {result.proficiency ? 'Yes' : 'No'}
            </div>
            <div className="status">
              <strong>Time:</strong> {result.time_seconds}s
            </div>
            <div className="status">
              <strong>Errors:</strong> {result.errors.map((e) => e.name).join(', ') || 'None'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
