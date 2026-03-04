import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { signIn, createRoom, joinRoom } from '../services/roomService';

export default function HomeScreen({ navigation }) {
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    signIn().then(setUid).catch(() => Alert.alert('エラー', '接続に失敗しました'));
  }, []);

  const handleCreateRoom = async () => {
    if (!playerName.trim() || !uid) return;
    setLoading(true);
    try {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      await createRoom(code, playerName, uid);
      navigation.navigate('Lobby', { roomCode: code, playerName, isHost: true, uid });
    } catch (e) {
      Alert.alert('エラー', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!playerName.trim() || !roomCode.trim() || !uid) return;
    setLoading(true);
    try {
      await joinRoom(roomCode.toUpperCase(), playerName, uid);
      navigation.navigate('Lobby', { roomCode: roomCode.toUpperCase(), playerName, isHost: false, uid });
    } catch (e) {
      Alert.alert('エラー', e.message);
    } finally {
      setLoading(false);
    }
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
          placeholderTextColor="#555"
          value={playerName}
          onChangeText={setPlayerName}
          maxLength={12}
        />

        <TouchableOpacity
          style={[styles.button, styles.createButton, !playerName.trim() && styles.disabled]}
          onPress={handleCreateRoom}
          disabled={!playerName.trim() || loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>ルームを作る</Text>}
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
          placeholderTextColor="#555"
          value={roomCode}
          onChangeText={setRoomCode}
          autoCapitalize="characters"
          maxLength={6}
        />

        <TouchableOpacity
          style={[styles.button, styles.joinButton, (!playerName.trim() || !roomCode.trim()) && styles.disabled]}
          onPress={handleJoinRoom}
          disabled={!playerName.trim() || !roomCode.trim() || loading}
        >
          <Text style={styles.buttonText}>ルームに参加</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: 40 },
  title: { fontSize: 40, fontWeight: 'bold', color: '#e94560', letterSpacing: 2 },
  subtitle: { fontSize: 14, color: '#a8a8b3', marginTop: 8 },
  form: { paddingHorizontal: 32 },
  label: { fontSize: 14, color: '#a8a8b3', marginBottom: 8, marginTop: 16 },
  input: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  button: { borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 16 },
  createButton: { backgroundColor: '#e94560' },
  joinButton: { backgroundColor: '#0f3460' },
  disabled: { opacity: 0.4 },
  buttonText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#0f3460' },
  dividerText: { color: '#a8a8b3', marginHorizontal: 12, fontSize: 14 },
});
