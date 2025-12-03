import Link from 'next/link';
import { apiGet, type Task } from '../../lib/api';

export default async function TasksPage() {
  const tasks = await apiGet<Task[]>('/tasks');

  return (
    <div className="grid">
      {tasks.map((task) => (
        <div key={task.id} className="card">
          <div className="flex-between" style={{ marginBottom: 6 }}>
            <h3 style={{ margin: 0 }}>{task.name}</h3>
            {task.category && <span className="badge">{task.category}</span>}
          </div>
          <p className="muted" style={{ minHeight: 60 }}>
            {task.description || 'No description yet.'}
          </p>
          <Link className="button" href={`/tasks/${task.slug}`}>
            Open task
          </Link>
        </div>
      ))}
    </div>
  );
}
