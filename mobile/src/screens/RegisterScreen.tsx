import React, { useState } from 'react';
import { Alert, Button, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

interface Props {
  onLoginNavigate: () => void;
}

export const RegisterScreen: React.FC<Props> = ({ onLoginNavigate }) => {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    try {
      await register(email, password, name);
    } catch (err: any) {
      Alert.alert('Registration failed', err?.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create account</Text>
        <TextInput
          placeholder="Full name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholderTextColor="#94a3b8"
        />
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
        <Button title={loading ? 'Creating...' : 'Register'} onPress={onSubmit} disabled={loading} />
        <TouchableOpacity onPress={onLoginNavigate} style={styles.linkRow}>
          <Text style={styles.linkText}>Have an account? Sign in</Text>
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
  },
  title: {
    color: '#e2e8f0',
    fontSize: 24,
    fontWeight: '800',
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
