import Link from 'next/link';

const highlights = [
  {
    title: 'Scored attempts',
    body: 'Timers, severity-weighted errors, and proficiency thresholds tuned for skills labs.',
  },
  {
    title: 'Clinical fidelity',
    body: 'Task briefs include positioning, common pitfalls, and short clips to reinforce form.',
  },
  {
    title: 'AI support',
    body: 'Built-in assistant to coach on speed, ergonomics, and error triage mid-session.',
  },
  {
    title: 'Anywhere access',
    body: 'Web and mobile flows mirror each other so residents can log reps on the go.',
  },
];

const roadmap = [
  'Refresh tokens and SSO for lab workstations.',
  'Media uploads to cloud storage with inline playback.',
  'Task-specific micro-rubrics and video checklists.',
  'Offline-friendly mobile logging with sync queue.',
];

export default function Home() {
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        alignItems: 'start',
      }}
    >
      <div className="hero" style={{ gap: 18 }}>
        <div className="badge">Skills lab ready</div>
        <h1 style={{ margin: 0 }}>SurgiTrack makes every rep measurable and coachable.</h1>
        <p style={{ margin: 0 }}>
          Log attempts with timers, severity-tagged errors, and proficiency gates. Each task comes with
          clinical context, setup tips, and a quick-help assistant so learners know how to improve—not just how
          to pass.
        </p>
        <div className="pill-row" style={{ marginTop: 6, flexWrap: 'wrap', gap: 10 }}>
          <Link className="button" href="/tasks">
            Explore tasks
          </Link>
          <Link className="ghost-button" href="/dashboard">
            View dashboard
          </Link>
          <Link className="ghost-button" href="/leaderboard">
            Leaderboard
          </Link>
        </div>
        <div className="small-grid">
          <div className="card" style={{ background: 'rgba(14,165,233,0.08)' }}>
            <div className="badge" style={{ marginBottom: 8 }}>Metrics</div>
            <h3 style={{ margin: 0 }}>Proficiency tracking</h3>
            <p className="muted" style={{ margin: 0 }}>
              Per-task best time, score, error mix, and consecutive pass streaks for each learner.
            </p>
          </div>
          <div className="card" style={{ background: 'rgba(15,23,42,0.06)' }}>
            <div className="badge" style={{ marginBottom: 8 }}>Coaching</div>
            <h3 style={{ margin: 0 }}>Embedded guidance</h3>
            <p className="muted" style={{ margin: 0 }}>
              Task briefs, pitfalls, and resources live beside the timer so feedback is one click away.
            </p>
          </div>
        </div>
      </div>
      <div className="grid">
        {highlights.map((item) => (
          <div key={item.title} className="card" style={{ display: 'grid', gap: 6 }}>
            <div className="badge" style={{ marginBottom: 4 }}>
              {item.title}
            </div>
            <p className="muted" style={{ margin: 0, lineHeight: 1.6 }}>
              {item.body}
            </p>
          </div>
        ))}
        <div className="card" style={{ display: 'grid', gap: 8 }}>
          <div className="badge" style={{ marginBottom: 4 }}>Roadmap</div>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
            {roadmap.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
