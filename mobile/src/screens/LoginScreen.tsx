import React, { useState } from 'react';
import { Alert, Button, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

interface Props {
  onRegisterNavigate: () => void;
}

export const LoginScreen: React.FC<Props> = ({ onRegisterNavigate }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err: any) {
      Alert.alert('Login failed', err?.message || 'Check credentials and try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Train surgical tasks and track your proficiency.</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          placeholderTextColor="#94a3b8"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#94a3b8"
        />
        <Button title={loading ? 'Signing in...' : 'Sign In'} onPress={onSubmit} disabled={loading} />
        <TouchableOpacity onPress={onRegisterNavigate} style={styles.linkRow}>
          <Text style={styles.linkText}>Need an account? Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1324',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#0f172a',
    padding: 20,
    borderRadius: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
  },
  title: {
    color: '#e2e8f0',
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    color: '#94a3b8',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#111827',
    color: '#f8fafc',
    padding: 12,
    borderRadius: 10,
  },
  linkRow: {
    alignItems: 'center',
  },
  linkText: {
    color: '#38bdf8',
    fontWeight: '600',
  },
});
