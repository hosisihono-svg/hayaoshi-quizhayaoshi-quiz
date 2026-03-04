import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';

export default function ResultScreen({ route, navigation }) {
  const { players = [], roomCode } = route.params || {};

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  const rankEmoji = ['🥇', '🥈', '🥉'];

  const renderPlayer = ({ item, index }) => (
    <View style={[styles.playerRow, index === 0 && styles.winnerRow]}>
      <Text style={styles.rank}>{rankEmoji[index] || `${index + 1}位`}</Text>
      <Text style={[styles.playerName, index === 0 && styles.winnerName]}>{item.name}</Text>
      <Text style={[styles.score, index === 0 && styles.winnerScore]}>{item.score}点</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>結果発表！</Text>
        {sortedPlayers.length > 0 && (
          <Text style={styles.winner}>🎉 {sortedPlayers[0].name} の勝利！</Text>
        )}
      </View>

      <FlatList
        data={sortedPlayers}
        renderItem={renderPlayer}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.playAgainButton}
          onPress={() => navigation.navigate('Lobby', { roomCode, playerName: sortedPlayers[0]?.name, isHost: true })}
        >
          <Text style={styles.buttonText}>もう一度遊ぶ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.homeButtonText}>ホームに戻る</Text>
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
    paddingTop: 32,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  winner: {
    fontSize: 20,
    color: '#ffd700',
    marginTop: 8,
    fontWeight: '600',
  },
  list: {
    padding: 24,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  winnerRow: {
    backgroundColor: '#2d2000',
    borderWidth: 1,
    borderColor: '#ffd700',
  },
  rank: {
    fontSize: 24,
    width: 40,
  },
  playerName: {
    flex: 1,
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 8,
  },
  winnerName: {
    color: '#ffd700',
  },
  score: {
    fontSize: 22,
    color: '#a8a8b3',
    fontWeight: 'bold',
  },
  winnerScore: {
    color: '#ffd700',
  },
  footer: {
    padding: 24,
    gap: 12,
  },
  playAgainButton: {
    backgroundColor: '#e94560',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  homeButton: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  homeButtonText: {
    color: '#a8a8b3',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
