import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getTasks } from '../lib/api';
import { Task } from '../types';

interface Props {
  onOpenTask: (task: Task) => void;
}

export const TaskListScreen: React.FC<Props> = ({ onOpenTask }) => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    const res = await getTasks(token);
    setTasks(res);
    setLoading(false);
  };

  useEffect(() => {
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
      data={tasks}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => onOpenTask(item)}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>{item.category}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
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
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    gap: 10,
  },
  name: {
    color: '#e2e8f0',
    fontWeight: '800',
    fontSize: 16,
  },
  meta: {
    color: '#94a3b8',
  },
  description: {
    color: '#cbd5e1',
    marginTop: 6,
  },
  chevron: {
    color: '#38bdf8',
    fontSize: 24,
  },
});
