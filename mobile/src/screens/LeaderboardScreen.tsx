import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getLeaderboard } from '../lib/api';
import { LeaderboardEntry } from '../types';

export const LeaderboardScreen: React.FC = () => {
  const { token } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      setLoading(true);
      const res = await getLeaderboard(token);
      setEntries(res);
      setLoading(false);
    };
    load();
  }, [token]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color="#38bdf8" />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      data={entries}
      keyExtractor={(item, idx) => `${item.user_id}-${item.task_id}-${idx}`}
      renderItem={({ item, index }) => (
        <View style={styles.row}>
          <Text style={styles.rank}>#{index + 1}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.user_email}</Text>
            <Text style={styles.meta}>{item.task_name}</Text>
          </View>
          <View style={styles.scoreBox}>
            <Text style={styles.score}>{item.score}</Text>
            <Text style={styles.time}>{item.time_seconds}s</Text>
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: '#0b1324',
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0b1324',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  rank: {
    color: '#38bdf8',
    fontWeight: '800',
    width: 32,
    textAlign: 'center',
  },
  name: {
    color: '#e2e8f0',
    fontWeight: '700',
  },
  meta: {
    color: '#94a3b8',
  },
  scoreBox: {
    alignItems: 'center',
  },
  score: {
    color: '#f8fafc',
    fontWeight: '800',
    fontSize: 18,
  },
  time: {
    color: '#94a3b8',
  },
});
