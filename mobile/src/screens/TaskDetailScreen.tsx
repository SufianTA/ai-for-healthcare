import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AttemptForm } from '../components/AttemptForm';
import { useAuth } from '../context/AuthContext';
import { getErrorTypes, getStandards, getTaskBySlug } from '../lib/api';
import { AttemptResponse, ErrorType, Task, TaskStandard } from '../types';

interface Props {
  slug: string;
}

export const TaskDetailScreen: React.FC<Props> = ({ slug }) => {
  const { token } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [standards, setStandards] = useState<TaskStandard[]>([]);
  const [errorTypes, setErrorTypes] = useState<ErrorType[]>([]);
  const [latestAttempt, setLatestAttempt] = useState<AttemptResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      const [taskRes, errors] = await Promise.all([getTaskBySlug(slug, token), getErrorTypes(token)]);
      setTask(taskRes);
      setErrorTypes(errors);
      const standardsRes = await getStandards(taskRes.id, token);
      setStandards(standardsRes);
      setLoading(false);
    };
    load();
  }, [slug, token]);

  if (loading || !task) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color="#38bdf8" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{task.name}</Text>
      <Text style={styles.meta}>{task.category}</Text>
      <Text style={styles.description}>{task.description}</Text>

      {latestAttempt && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Last attempt</Text>
          <Text style={styles.resultValue}>Score {latestAttempt.score}</Text>
          <Text style={styles.resultMeta}>{latestAttempt.proficiency ? 'Proficient' : 'Needs improvement'}</Text>
        </View>
      )}

      <AttemptForm
        taskId={task.id}
        standards={standards}
        errorTypes={errorTypes}
        token={token!}
        onComplete={setLatestAttempt}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1324',
    padding: 16,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0b1324',
  },
  title: {
    color: '#e2e8f0',
    fontSize: 24,
    fontWeight: '800',
  },
  meta: {
    color: '#94a3b8',
  },
  description: {
    color: '#cbd5e1',
    marginVertical: 10,
  },
  resultCard: {
    backgroundColor: '#111827',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  resultTitle: {
    color: '#cbd5e1',
    fontWeight: '700',
  },
  resultValue: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '800',
  },
  resultMeta: {
    color: '#94a3b8',
  },
});
