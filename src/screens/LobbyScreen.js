import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';

const MOCK_PLAYERS = [
  { id: '1', name: 'あなた', ready: true, isHost: true },
  { id: '2', name: 'たろう', ready: true, isHost: false },
  { id: '3', name: 'はなこ', ready: false, isHost: false },
];

export default function LobbyScreen({ route, navigation }) {
  const { roomCode, playerName, isHost } = route.params;
  const [players, setPlayers] = useState(MOCK_PLAYERS);
  const [isReady, setIsReady] = useState(false);

  const toggleReady = () => {
    setIsReady(!isReady);
  };

  const handleStartGame = () => {
    const allReady = players.every((p) => p.ready);
    if (!allReady) {
      Alert.alert('確認', '準備完了していないプレイヤーがいます。開始しますか？', [
        { text: 'キャンセル' },
        { text: '開始', onPress: () => navigation.navigate('Game', { roomCode, playerName }) },
      ]);
    } else {
      navigation.navigate('Game', { roomCode, playerName });
    }
  };

  const renderPlayer = ({ item }) => (
    <View style={styles.playerRow}>
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>
          {item.name} {item.isHost ? '👑' : ''}
        </Text>
      </View>
      <View style={[styles.statusBadge, item.ready ? styles.readyBadge : styles.waitingBadge]}>
        <Text style={styles.statusText}>{item.ready ? '準備OK' : '待機中'}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ロビー</Text>
        <View style={styles.roomCodeContainer}>
          <Text style={styles.roomCodeLabel}>ルームコード</Text>
          <Text style={styles.roomCode}>{roomCode}</Text>
          <Text style={styles.roomCodeHint}>このコードを友達に教えよう</Text>
        </View>
      </View>

      <View style={styles.playerSection}>
        <Text style={styles.sectionTitle}>参加者 ({players.length}人)</Text>
        <FlatList
          data={players}
          renderItem={renderPlayer}
          keyExtractor={(item) => item.id}
          style={styles.playerList}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.readyButton, isReady && styles.readyActive]}
          onPress={toggleReady}
        >
          <Text style={styles.readyButtonText}>
            {isReady ? '✓ 準備完了' : '準備する'}
          </Text>
        </TouchableOpacity>

        {isHost && (
          <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
            <Text style={styles.startButtonText}>ゲーム開始</Text>
          </TouchableOpacity>
        )}
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
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  roomCodeContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  roomCodeLabel: {
    fontSize: 12,
    color: '#a8a8b3',
  },
  roomCode: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e94560',
    letterSpacing: 6,
    marginVertical: 4,
  },
  roomCodeHint: {
    fontSize: 12,
    color: '#a8a8b3',
  },
  playerSection: {
    flex: 1,
    padding: 24,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#a8a8b3',
    marginBottom: 12,
  },
  playerList: {
    flex: 1,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  readyBadge: {
    backgroundColor: '#1a4731',
  },
  waitingBadge: {
    backgroundColor: '#3d2c1e',
  },
  statusText: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '600',
  },
  footer: {
    padding: 24,
    gap: 12,
  },
  readyButton: {
    backgroundColor: '#0f3460',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0f3460',
  },
  readyActive: {
    backgroundColor: '#1a4731',
    borderColor: '#2ecc71',
  },
  readyButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#e94560',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
