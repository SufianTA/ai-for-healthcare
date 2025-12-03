import React, { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getSummary } from '../lib/api';
import { UserSummary } from '../types';

export const DashboardScreen: React.FC = () => {
  const { token, profile } = useAuth();
  const [summary, setSummary] = useState<UserSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    const res = await getSummary(token);
    setSummary(res);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [token]);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor="#38bdf8" />}
    >
      <Text style={styles.header}>Hi {profile?.full_name || profile?.email}</Text>
      {summary ? (
        <View style={styles.card}>
          <Text style={styles.title}>Proficiency</Text>
          <Text style={styles.stat}>{summary.proficient_tasks} / {summary.total_tasks} tasks</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.max(5, (summary.proficient_tasks / summary.total_tasks) * 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.title}>Best Scores</Text>
          {summary.task_details.map((task) => (
            <View key={task.task_id} style={styles.taskRow}>
              <View>
                <Text style={styles.taskName}>{task.task_name}</Text>
                <Text style={styles.taskMeta}>Best time: {task.best_time_seconds ?? '—'}s</Text>
              </View>
              <Text style={styles.scoreBubble}>{task.best_score ?? '—'}</Text>
            </View>
          ))}
        </View>
      ) : (
        <ActivityIndicator color="#38bdf8" style={{ marginTop: 24 }} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1324',
    padding: 16,
  },
  header: {
    color: '#e2e8f0',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 16,
    gap: 14,
  },
  title: {
    color: '#cbd5e1',
    fontWeight: '700',
  },
  stat: {
    color: '#e2e8f0',
    fontSize: 20,
    fontWeight: '800',
  },
  progressBar: {
    backgroundColor: '#111827',
    borderRadius: 10,
    height: 12,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: '#38bdf8',
    height: '100%',
  },
  taskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomColor: '#1f2937',
    borderBottomWidth: 1,
  },
  taskName: {
    color: '#e2e8f0',
    fontWeight: '700',
  },
  taskMeta: {
    color: '#94a3b8',
  },
  scoreBubble: {
    backgroundColor: '#111827',
    color: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontWeight: '700',
  },
});
