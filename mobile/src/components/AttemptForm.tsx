import { Picker } from '@react-native-picker/picker';
import React, { useMemo, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTimer } from '../hooks/useTimer';
import { createAttempt } from '../lib/api';
import { AttemptResponse, ErrorType, TaskStandard } from '../types';

interface Props {
  taskId: number;
  standards: TaskStandard[];
  errorTypes: ErrorType[];
  token: string;
  onComplete: (attempt: AttemptResponse) => void;
}

export const AttemptForm: React.FC<Props> = ({ taskId, standards, errorTypes, token, onComplete }) => {
  const [standardId, setStandardId] = useState<number | null>(standards[0]?.id ?? null);
  const [selectedErrors, setSelectedErrors] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const timer = useTimer();

  const standard = useMemo(() => standards.find((s) => s.id === standardId), [standardId, standards]);

  const toggleError = (id: number) => {
    setSelectedErrors((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]));
  };

  const startTimer = () => {
    timer.start();
  };

  const stopAndSubmit = async () => {
    if (!standardId) {
      Alert.alert('Select a standard first');
      return;
    }
    const startedAt = timer.startedAt || timer.start();
    const endedAt = timer.stop();
    setSubmitting(true);
    try {
      const payload = {
        task_id: taskId,
        standard_id: standardId,
        started_at: startedAt.toISOString(),
        ended_at: endedAt.toISOString(),
        errors: selectedErrors.map((id) => ({ error_type_id: id })),
      };
      const res = await createAttempt(payload, token);
      onComplete(res);
      Alert.alert('Attempt submitted', `Score: ${res.score} | Proficiency: ${res.proficiency ? 'Yes' : 'No'}`);
      setSelectedErrors([]);
      timer.reset();
    } catch (err: any) {
      Alert.alert('Submission failed', err?.message || 'Please try again');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Log Attempt</Text>
      {standard && (
        <View style={styles.standardCard}>
          <Text style={styles.standardTitle}>{standard.level}</Text>
          <Text style={styles.standardMeta}>Target time: {standard.target_time_seconds}s</Text>
          <Text style={styles.standardMeta}>
            Errors allowed: minor ≤ {standard.max_minor_errors}, major ≤ {standard.max_major_errors}
          </Text>
        </View>
      )}
      <Picker
        selectedValue={standardId ?? undefined}
        onValueChange={(val) => setStandardId(Number(val))}
        style={styles.picker}
      >
        {standards.map((s) => (
          <Picker.Item label={`${s.level} (≤${s.target_time_seconds}s)`} value={s.id} key={s.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Errors</Text>
      <View style={styles.errorGrid}>
        {errorTypes.map((err) => {
          const active = selectedErrors.includes(err.id);
          return (
            <TouchableOpacity
              key={err.id}
              style={[styles.errorChip, active && styles.errorChipActive]}
              onPress={() => toggleError(err.id)}
            >
              <Text style={styles.errorName}>{err.name}</Text>
              <Text style={styles.errorSeverity}>{err.severity.toUpperCase()}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.timerRow}>
        <View>
          <Text style={styles.timerLabel}>Elapsed</Text>
          <Text style={styles.timerValue}>{timer.elapsed}s</Text>
        </View>
        <View style={styles.timerButtons}>
          <Button title={timer.running ? 'Running...' : 'Start'} onPress={startTimer} disabled={timer.running} />
          <Button title="Stop & Submit" onPress={stopAndSubmit} disabled={submitting || !standardId} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  heading: {
    color: '#e2e8f0',
    fontSize: 18,
    fontWeight: '700',
  },
  standardCard: {
    padding: 12,
    backgroundColor: '#111827',
    borderRadius: 10,
  },
  standardTitle: {
    color: '#f8fafc',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 4,
  },
  standardMeta: {
    color: '#cbd5e1',
  },
  picker: {
    backgroundColor: '#111827',
    color: '#f8fafc',
    borderRadius: 8,
  },
  label: {
    color: '#cbd5e1',
    fontWeight: '600',
  },
  errorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  errorChip: {
    backgroundColor: '#1f2937',
    padding: 10,
    borderRadius: 10,
    width: '48%',
  },
  errorChipActive: {
    borderColor: '#38bdf8',
    borderWidth: 1,
    backgroundColor: '#0ea5e9',
  },
  errorName: {
    color: '#f8fafc',
    fontWeight: '700',
  },
  errorSeverity: {
    color: '#cbd5e1',
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timerLabel: {
    color: '#94a3b8',
  },
  timerValue: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: '800',
  },
  timerButtons: {
    gap: 8,
  },
});
