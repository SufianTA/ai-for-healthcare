'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { AttemptResponse, ErrorType, Task, TaskStandard } from '../../../lib/api';
import { apiGet, apiPost } from '../../../lib/api';
import { useAuth } from '../../../components/auth-context';

type TaskGuide = {
  overview: string;
  steps: string[];
  pitfalls: string[];
  resources: { title: string; url: string }[];
  video?: string;
  instruments?: string[];
};

const defaultGuide: TaskGuide = {
  overview:
    'Focus on economy of motion, neutral wrist, and consistent needle angles. Score favors clean needle handling and minimal tissue trauma.',
  steps: [
    'Check needle angle (70–90°) and lock the driver before entering the model.',
    'Advance with small wrist motions; avoid sweeping arcs that torque tissue.',
    'Seat the needle with the wrist, not the elbow; keep forearm stable.',
  ],
  pitfalls: [
    'Excessive wrist flexion causing needle wobble.',
    'Dragging the needle across the field instead of lifting cleanly.',
    'Regripping more than twice per pass, leading to frayed suture.',
  ],
  resources: [
    { title: 'SAFE-T Needle Handling', url: 'https://www.facs.org/quality-programs/education' },
    { title: 'Economy of motion primer', url: 'https://psnet.ahrq.gov/' },
  ],
  video: '/surgery-bg.mp4',
};

const guides: Record<string, TaskGuide> = {
  'palm-needle-driver': {
    overview:
      'Use a palmed driver for rapid, controlled rotation. The goal is three full clicks with the 5 mm colored segment centered, repeated smoothly for five reps.',
    steps: [
      'Grip: palm the handle, index on fulcrum, thumb free for counterpressure only.',
      'Engage: close until you hear/feel the first click, verifying alignment.',
      'Rotate: pronate/supinate at the wrist to drive the needle through rubber tubing without elbow motion.',
      'Release and re-cock: half-open to reposition, avoiding a full release unless necessary.',
      'Repeat five clean cycles while keeping the driver perpendicular to the tubing.',
    ],
    pitfalls: [
      'Over-tightening the ratchet, crushing the needle and causing fray.',
      'Lifting the elbow, which destabilizes the wrist and adds drift.',
      'Letting the needle slip beyond the colored segment, losing control of bite depth.',
      'Regripping with the tips only (no palm), which slows the cycle and increases tremor.',
    ],
    resources: [
      { title: 'Driver handling mini-drill (video)', url: 'https://www.youtube.com/watch?v=5Oaxm7p1WTk' },
      { title: 'Needle control fundamentals', url: 'https://www.aesculap-academy.com' },
    ],
    video: '/surgery-bg.mp4',
    instruments: ['Palmed needle driver', 'Silicone/rubber tubing', '2-0 silk suture'],
  },
};

type ChatMessage = { from: 'assistant' | 'user'; text: string };

function getToken(token?: string | null) {
  if (typeof window === 'undefined') return token ?? null;
  return token || localStorage.getItem('surgitrack_token');
}

function formatStandard(std: TaskStandard) {
  return `Target ${std.target_time_seconds}s • Minor ≤ ${std.max_minor_errors} • Major ≤ ${std.max_major_errors}`;
}

function buildAssistantReply(slug: string, prompt: string) {
  const guide = guides[slug] || defaultGuide;
  const lower = prompt.toLowerCase();

  if (lower.includes('time') || lower.includes('faster') || lower.includes('speed')) {
    return 'Trim seconds by pre-positioning the driver before you start, limiting regrips to two, and committing to wrist-only rotation. If you feel drift, pause, reset your forearm on the table, and restart the cycle cleanly.';
  }
  if (lower.includes('error') || lower.includes('bleed') || lower.includes('tissue')) {
    return 'Prioritize tissue respect: lighten your grip until the ratchet just holds, and lift up-and-out instead of dragging. If you see fray, inspect for over-tightened ratchet and regrip closer to the colored segment.';
  }
  if (lower.includes('setup') || lower.includes('position') || lower.includes('ergonomic')) {
    return 'Set up with elbows at 90°, wrists neutral, tubing at midline, and camera or eyes aligned perpendicular. Anchor your ulnar border to the table edge to damp tremor during rotation.';
  }
  return `Focus on: ${guide.steps[0]} Also watch for: ${guide.pitfalls[0]}. Keep the driver palmed and avoid over-gripping—economy of motion beats force.`;
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
  const [now, setNow] = useState<Date | null>(null);
  const [result, setResult] = useState<AttemptResponse | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [chat, setChat] = useState<ChatMessage[]>([
    { from: 'assistant', text: 'Need help with timing, errors, or setup? Ask me anything about this task.' },
  ]);
  const [chatInput, setChatInput] = useState('');

  const guide = guides[params.slug] || defaultGuide;

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
    const startTime = new Date();
    setStatus('Running...');
    setStartedAt(startTime);
    setEndedAt(null);
    setNow(startTime);
    setResult(null);
  }

  async function stop() {
    if (!task || !selectedStandard || !startedAt) return;
    const finish = new Date();
    setEndedAt(finish);
    setNow(finish);
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
      // Use trailing slash to avoid CORS preflight redirect issues on some hosts.
      const res = await apiPost<AttemptResponse>('/attempts/', payload, authToken);
      setResult(res);
      setStatus(`Score: ${res.score}`);
      setErrorMessage(null);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to save attempt');
    }
  }

  useEffect(() => {
    if (!startedAt || endedAt) return;
    const timer = setInterval(() => setNow(new Date()), 250);
    return () => clearInterval(timer);
  }, [startedAt, endedAt]);

  const duration = useMemo(() => {
    if (!startedAt) return null;
    const end = endedAt || now || new Date();
    return Math.max(0, Math.round((end.getTime() - startedAt.getTime()) / 1000));
  }, [startedAt, endedAt, now]);

  const currentStandard = useMemo(
    () => standards.find((std) => std.id === selectedStandard),
    [standards, selectedStandard],
  );

  const severityColor: Record<string, string> = {
    minor: '#0ea5e9',
    major: '#f97316',
    critical: '#ef4444',
  };

  const suggestedPrompts = [
    'How do I shave 2 seconds off my time?',
    'Why am I fraying suture on this task?',
    'What is ideal hand position for the palmed driver?',
  ];

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const text = chatInput.trim();
    setChat((prev) => [...prev, { from: 'user', text }]);
    setChatInput('');
    const reply = buildAssistantReply(params.slug, text);
    setTimeout(() => {
      setChat((prev) => [...prev, { from: 'assistant', text: reply }]);
    }, 250);
  };

  return (
    <div className="grid" style={{ gridTemplateColumns: '1.2fr 1fr' }}>
      <div className="card" style={{ display: 'grid', gap: 16 }}>
        <div className="flex-between">
          <div>
            <div className="badge" style={{ marginBottom: 8, textTransform: 'uppercase' }}>
              Open skills
            </div>
            <h1 style={{ margin: '0 0 4px' }}>{task?.name || 'Task'}</h1>
            {task?.description && <p className="muted" style={{ margin: 0 }}>{task.description}</p>}
          </div>
          {task?.category && <span className="badge">{task.category}</span>}
        </div>

        <div className="small-grid">
          <div>
            <p className="muted" style={{ margin: '0 0 8px' }}>Pick a standard</p>
            <select
              className="select"
              value={selectedStandard ?? ''}
              onChange={(e) => setSelectedStandard(Number(e.target.value))}
            >
              {standards.map((std) => (
                <option key={std.id} value={std.id}>
                  {std.level} — {formatStandard(std)}
                </option>
              ))}
            </select>
            {currentStandard && (
              <p className="muted" style={{ marginTop: 6, fontSize: 13 }}>
                Aim to stay under {currentStandard.target_time_seconds}s with no more than{' '}
                {currentStandard.max_minor_errors} minor and {currentStandard.max_major_errors} major errors.
              </p>
            )}
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
                  <span
                    className="badge"
                    style={{
                      background: `${severityColor[err.severity]}22`,
                      color: severityColor[err.severity],
                    }}
                  >
                    {err.severity}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="pill-row" style={{ gap: 12, flexWrap: 'wrap' }}>
          <button className="button" onClick={start} type="button">
            Start timer
          </button>
          <button className="ghost-button" onClick={stop} type="button" disabled={!startedAt}>
            Stop & submit
          </button>
          {duration !== null && (
            <span className="pill" style={{ minWidth: 120, textAlign: 'center' }}>
              Elapsed: {duration}s
            </span>
          )}
          {status && <span className="pill" style={{ background: '#e0f2fe' }}>{status}</span>}
        </div>

        <div className="grid" style={{ gridTemplateColumns: '1.1fr 1fr' }}>
          <div className="card" style={{ background: 'rgba(14,165,233,0.05)' }}>
            <h3 style={{ marginTop: 0 }}>Procedure guide</h3>
            <p className="muted" style={{ marginTop: 0 }}>{guide.overview}</p>
            <div className="small-grid" style={{ marginTop: 8 }}>
              <div>
                <strong>Steps</strong>
                <ul style={{ paddingLeft: 18, margin: '8px 0', lineHeight: 1.5 }}>
                  {guide.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Watch for</strong>
                <ul style={{ paddingLeft: 18, margin: '8px 0', lineHeight: 1.5 }}>
                  {guide.pitfalls.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                {guide.instruments && (
                  <p className="muted" style={{ marginTop: 6, fontSize: 13 }}>
                    Instruments: {guide.instruments.join(', ')}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Resources</h3>
            <div style={{ display: 'grid', gap: 10 }}>
              {guide.resources.map((res) => (
                <Link key={res.title} href={res.url} target="_blank" className="pill-row" style={{ gap: 10 }}>
                  <span className="badge">Guide</span>
                  <span>{res.title}</span>
                </Link>
              ))}
              {guide.video && (
                <div>
                  <p className="muted" style={{ margin: '0 0 6px' }}>Tutorial clip</p>
                  <video
                    controls
                    src={guide.video}
                    style={{ width: '100%', borderRadius: 12, border: '1px solid var(--border)' }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ display: 'grid', gap: 16, alignSelf: 'start' }}>
        <div>
          <h3 style={{ marginTop: 0 }}>Result</h3>
          {!result && <p className="muted">Start and stop the timer to score an attempt.</p>}
          {result && (
            <div style={{ display: 'grid', gap: 8 }}>
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
          {errorMessage && <p style={{ color: '#f87171' }}>{errorMessage}</p>}
        </div>

        <div className="card" style={{ background: 'rgba(15,23,42,0.04)' }}>
          <div className="flex-between" style={{ marginBottom: 6 }}>
            <div>
              <h3 style={{ margin: '0 0 4px' }}>Assistant</h3>
              <p className="muted" style={{ margin: 0 }}>Ask for coaching, ergonomics, or error triage.</p>
            </div>
            <span className="badge">AI helper</span>
          </div>
          <div
            style={{
              maxHeight: 220,
              overflowY: 'auto',
              display: 'grid',
              gap: 8,
              padding: '8px 10px',
              border: '1px solid var(--border)',
              borderRadius: 12,
              background: '#fff',
            }}
          >
            {chat.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  justifySelf: msg.from === 'assistant' ? 'start' : 'end',
                  maxWidth: '90%',
                  padding: '10px 12px',
                  borderRadius: 12,
                  background: msg.from === 'assistant' ? 'rgba(14,165,233,0.12)' : 'rgba(34,211,238,0.2)',
                  color: '#0f172a',
                  border: '1px solid var(--border)',
                }}
              >
                <strong>{msg.from === 'assistant' ? 'SurgiBot:' : 'You:'}</strong> {msg.text}
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            <input
              className="input"
              placeholder="Ask about speed, errors, or setup..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessage();
              }}
            />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {suggestedPrompts.map((p) => (
                <button
                  key={p}
                  className="ghost-button"
                  style={{ flex: '1 1 160px' }}
                  type="button"
                  onClick={() => {
                    setChatInput(p);
                    setTimeout(sendMessage, 50);
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
