import { apiGet, type LeaderboardEntry } from '../../lib/api';

export default async function LeaderboardPage() {
  const data = await apiGet<LeaderboardEntry[]>('/leaderboard/global');

  return (
    <div className="card">
      <div className="flex-between" style={{ marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Global leaderboard</h2>
        <div className="badge">Top 50</div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>User</th>
            <th>Task</th>
            <th>Score</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={`${row.user_id}-${row.task_id}`}>
              <td>{row.user_email}</td>
              <td>{row.task_name}</td>
              <td>{row.score}</td>
              <td>{row.time_seconds}s</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
