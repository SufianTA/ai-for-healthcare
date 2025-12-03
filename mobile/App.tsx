import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { LeaderboardScreen } from './src/screens/LeaderboardScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { TaskDetailScreen } from './src/screens/TaskDetailScreen';
import { TaskListScreen } from './src/screens/TaskListScreen';
import { Task } from './src/types';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AppShell() {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0b1324' }}>
        <ActivityIndicator color="#38bdf8" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {token ? <AuthenticatedTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreenWrapper} />
      <Stack.Screen name="Register" component={RegisterScreenWrapper} />
    </Stack.Navigator>
  );
}

function LoginScreenWrapper({ navigation }: any) {
  return <LoginScreen onRegisterNavigate={() => navigation.navigate('Register')} />;
}

function RegisterScreenWrapper({ navigation }: any) {
  return <RegisterScreen onLoginNavigate={() => navigation.navigate('Login')} />;
}

function AuthenticatedTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#0f172a', borderTopColor: '#1f2937' },
        tabBarActiveTintColor: '#38bdf8',
        tabBarInactiveTintColor: '#94a3b8',
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Tasks" component={TaskStack} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const TaskNav = createNativeStackNavigator();
function TaskStack() {
  return (
    <TaskNav.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0f172a' },
        headerTintColor: '#e2e8f0',
      }}
    >
      <TaskNav.Screen name="TaskList" component={TaskListScreenWrapper} options={{ title: 'Tasks' }} />
      <TaskNav.Screen
        name="TaskDetail"
        component={TaskDetailScreenWrapper}
        options={({ route }: any) => ({ title: route.params?.title || 'Task' })}
      />
    </TaskNav.Navigator>
  );
}

function TaskListScreenWrapper({ navigation }: any) {
  return (
    <TaskListScreen
      onOpenTask={(task: Task) => navigation.navigate('TaskDetail', { slug: task.slug, title: task.name })}
    />
  );
}

function TaskDetailScreenWrapper({ route }: any) {
  return <TaskDetailScreen slug={route.params.slug} />;
}

export default function App() {
  return (
    <AuthProvider>
      <StatusBar barStyle="light-content" />
      <AppShell />
    </AuthProvider>
  );
}
