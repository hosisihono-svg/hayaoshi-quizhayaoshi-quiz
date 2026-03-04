import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

export default function HomeScreen({ navigation }) {
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');

  const handleCreateRoom = () => {
    if (!playerName.trim()) return;
    const newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    navigation.navigate('Lobby', { roomCode: newRoomCode, playerName, isHost: true });
  };

  const handleJoinRoom = () => {
    if (!playerName.trim() || !roomCode.trim()) return;
    navigation.navigate('Lobby', { roomCode: roomCode.toUpperCase(), playerName, isHost: false });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>早押しクイズ</Text>
        <Text style={styles.subtitle}>みんなで楽しくクイズ対戦！</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>プレイヤー名</Text>
        <TextInput
          style={styles.input}
          placeholder="名前を入力"
          value={playerName}
          onChangeText={setPlayerName}
          maxLength={12}
        />

        <TouchableOpacity
          style={[styles.button, styles.createButton, !playerName.trim() && styles.disabled]}
          onPress={handleCreateRoom}
          disabled={!playerName.trim()}
        >
          <Text style={styles.buttonText}>ルームを作る</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>または</Text>
          <View style={styles.dividerLine} />
        </View>

        <Text style={styles.label}>ルームコード</Text>
        <TextInput
          style={styles.input}
          placeholder="コードを入力（例: ABC123）"
          value={roomCode}
          onChangeText={setRoomCode}
          autoCapitalize="characters"
          maxLength={6}
        />

        <TouchableOpacity
          style={[styles.button, styles.joinButton, (!playerName.trim() || !roomCode.trim()) && styles.disabled]}
          onPress={handleJoinRoom}
          disabled={!playerName.trim() || !roomCode.trim()}
        >
          <Text style={styles.buttonText}>ルームに参加</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#e94560',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#a8a8b3',
    marginTop: 8,
  },
  form: {
    paddingHorizontal: 32,
  },
  label: {
    fontSize: 14,
    color: '#a8a8b3',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  createButton: {
    backgroundColor: '#e94560',
  },
  joinButton: {
    backgroundColor: '#0f3460',
  },
  disabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#0f3460',
  },
  dividerText: {
    color: '#a8a8b3',
    marginHorizontal: 12,
    fontSize: 14,
  },
});
