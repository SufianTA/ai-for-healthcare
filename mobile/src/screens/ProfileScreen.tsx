import React from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export const ProfileScreen: React.FC = () => {
  const { profile, signOut } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{profile?.email}</Text>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{profile?.full_name || '—'}</Text>
        <Button title="Sign out" onPress={signOut} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1324',
    padding: 16,
  },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  title: {
    color: '#e2e8f0',
    fontSize: 22,
    fontWeight: '800',
  },
  label: {
    color: '#94a3b8',
    marginTop: 8,
  },
  value: {
    color: '#f8fafc',
    fontWeight: '700',
  },
});
