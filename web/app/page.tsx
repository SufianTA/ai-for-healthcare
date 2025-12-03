import Link from 'next/link';

const highlights = [
  {
    title: 'Scored attempts',
    body: 'Log practice sessions with timers, rubric-based penalties, and auto proficiency detection.',
  },
  {
    title: 'Progress dashboards',
    body: 'Track best scores and times per task with a clear proficient-vs-total indicator.',
  },
  {
    title: 'Shareable leaderboards',
    body: 'Surface the fastest, highest-scoring attempts for each task to inspire competition.',
  },
];

export default function Home() {
  return (
    <div className="grid" style={{ gridTemplateColumns: '1.3fr 1fr' }}>
      <div className="hero">
        <div className="badge">Built for labs</div>
        <h1>SurgiTrack keeps every practice run measurable.</h1>
        <p>
          Capture start/stop times, flag errors by severity, score against standards, and instantly show
          progress. Connect the FastAPI backend to Postgres, deploy the Next.js UI, and you have a
          ready-to-demo training loop.
        </p>
        <div className="pill-row" style={{ marginTop: 6 }}>
          <Link className="button" href="/tasks">
            Explore tasks
          </Link>
          <Link className="ghost-button" href="/dashboard">
            View dashboard
          </Link>
        </div>
      </div>
      <div className="grid">
        {highlights.map((item) => (
          <div key={item.title} className="card">
            <div className="badge" style={{ marginBottom: 10 }}>
              {item.title}
            </div>
            <p className="muted" style={{ margin: 0, lineHeight: 1.7 }}>
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
