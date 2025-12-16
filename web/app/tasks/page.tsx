import Link from 'next/link';
import { apiGet, type Task } from '../../lib/api';

const taskHints: Record<string, { focus: string; tip: string }> = {
  'palm-needle-driver': {
    focus: 'Palmed driver speed and needle control.',
    tip: 'Keep wrist neutral, limit regrips, and use the colored segment as depth guide.',
  },
  'rope-tying': {
    focus: 'Square knots with consistent tension.',
    tip: 'Anchor elbows, use minimal wrist flexion to avoid sawing motion.',
  },
};

export default async function TasksPage() {
  const tasks = await apiGet<Task[]>('/tasks');

  return (
    <div className="grid" style={{ gap: 18 }}>
      {tasks.map((task) => {
        const hint = taskHints[task.slug] || {
          focus: 'Practice run',
          tip: 'Open the task to see standards, guidance, and resources.',
        };
        return (
          <div key={task.id} className="card" style={{ display: 'grid', gap: 10 }}>
            <div className="flex-between" style={{ marginBottom: 4 }}>
              <h3 style={{ margin: 0 }}>{task.name}</h3>
              {task.category && <span className="badge">{task.category}</span>}
            </div>
            <p className="muted" style={{ minHeight: 48, margin: 0 }}>
              {task.description || hint.focus}
            </p>
            <div className="pill-row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <span className="pill" style={{ background: 'rgba(14,165,233,0.08)' }}>{hint.focus}</span>
              <span className="muted" style={{ fontSize: 13 }}>{hint.tip}</span>
            </div>
            <Link className="button" href={`/tasks/${task.slug}`}>
              Open task
            </Link>
          </div>
        );
      })}
    </div>
  );
}
