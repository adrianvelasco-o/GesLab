import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.badge}>Aplicación móvil</Text>
        <Text style={styles.title}>GesLab</Text>
        <Text style={styles.subtitle}>
          Gestión del espacio académico para la evaluación de experiencia de usuario
        </Text>

        <View style={styles.statusBox}>
          <Text style={styles.statusText}>🟢 Base React Native Lista</Text>
          <Text style={styles.subtext}>Entorno listo para futura conexión API con GesLab Backend</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8
  },
  badge: {
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#F8FAFC',
    marginBottom: 12,
    letterSpacing: 0.5
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 24
  },
  statusBox: {
    width: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center'
  },
  statusText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 4
  },
  subtext: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center'
  }
});
