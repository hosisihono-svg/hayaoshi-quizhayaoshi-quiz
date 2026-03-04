import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import { listenRoom, listenPlayers, listenBuzzes, buzz, updateScore, nextQuestion, endGame } from '../services/roomService';
import { QUESTIONS } from '../data/questions';

export default function GameScreen({ route, navigation }) {
  const { roomCode, playerName, isHost, uid } = route.params;
  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [buzzes, setBuzzes] = useState([]);
  const [hasBuzzed, setHasBuzzed] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const unsubRoom = listenRoom(roomCode, setRoom);
    const unsubPlayers = listenPlayers(roomCode, setPlayers);
    const unsubBuzzes = listenBuzzes(roomCode, setBuzzes);
    return () => { unsubRoom(); unsubPlayers(); unsubBuzzes(); };
  }, [roomCode]);

  // 全員にゲーム終了を反映
  useEffect(() => {
    if (room?.status === 'finished') {
      navigation.replace('Result', { players, roomCode });
    }
  }, [room?.status]);

  const handleBuzz = async () => {
    if (hasBuzzed) return;
    setHasBuzzed(true);
    await buzz(roomCode, uid);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.1, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  const handleJudge = async (correct) => {
    const winnerId = buzzes[0]?.id;
    if (correct && winnerId) {
      await updateScore(roomCode, winnerId, 1);
    }
    const nextIndex = questionIndex + 1;
    if (nextIndex >= QUESTIONS.length) {
      await endGame(roomCode);
    } else {
      setQuestionIndex(nextIndex);
      setHasBuzzed(false);
      await nextQuestion(roomCode, QUESTIONS[nextIndex]);
    }
  };

  const currentQuestion = room?.currentQuestion ?? QUESTIONS[questionIndex];
  const firstBuzzer = buzzes.length > 0
    ? players.find((p) => p.id === buzzes[0].id)?.name ?? '???'
    : null;
  const isBuzzed = buzzes.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.questionNumber}>
          問題 {questionIndex + 1} / {QUESTIONS.length}
        </Text>
        <View style={styles.scores}>
          {players.map((p) => (
            <View key={p.id} style={styles.scoreItem}>
              <Text style={styles.scoreName}>{p.name}</Text>
              <Text style={styles.scoreValue}>{p.score}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{currentQuestion?.text}</Text>
      </View>

      {isBuzzed && (
        <View style={styles.buzzedBanner}>
          <Text style={styles.buzzedText}>⚡ {firstBuzzer} が早押し！</Text>
          {isHost && (
            <View style={styles.judgeButtons}>
              <TouchableOpacity style={styles.correctButton} onPress={() => handleJudge(true)}>
                <Text style={styles.judgeButtonText}>○ 正解</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.wrongButton} onPress={() => handleJudge(false)}>
                <Text style={styles.judgeButtonText}>✕ 不正解</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      <View style={styles.buzzerArea}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[styles.buzzerButton, (hasBuzzed || isBuzzed) && styles.buzzerPressed]}
            onPress={handleBuzz}
            disabled={hasBuzzed || isBuzzed}
            activeOpacity={0.8}
          >
            <Text style={styles.buzzerText}>
              {hasBuzzed ? '押した！' : isBuzzed ? '...' : '早押し！'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#0f3460' },
  questionNumber: { color: '#a8a8b3', fontSize: 14, textAlign: 'center', marginBottom: 8 },
  scores: { flexDirection: 'row', justifyContent: 'center', gap: 12, flexWrap: 'wrap' },
  scoreItem: {
    alignItems: 'center',
    backgroundColor: '#16213e',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  scoreName: { color: '#a8a8b3', fontSize: 12 },
  scoreValue: { color: '#e94560', fontSize: 20, fontWeight: 'bold' },
  questionCard: {
    margin: 24,
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 32,
    minHeight: 160,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  questionText: { color: '#ffffff', fontSize: 24, fontWeight: 'bold', textAlign: 'center', lineHeight: 36 },
  buzzedBanner: {
    marginHorizontal: 24,
    backgroundColor: '#2d1b00',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e94560',
  },
  buzzedText: { color: '#e94560', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  judgeButtons: { flexDirection: 'row', gap: 12 },
  correctButton: { backgroundColor: '#1a4731', borderRadius: 10, paddingHorizontal: 24, paddingVertical: 10 },
  wrongButton: { backgroundColor: '#4a1515', borderRadius: 10, paddingHorizontal: 24, paddingVertical: 10 },
  judgeButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  buzzerArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  buzzerButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#e94560',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  buzzerPressed: { backgroundColor: '#555', shadowOpacity: 0 },
  buzzerText: { color: '#ffffff', fontSize: 28, fontWeight: 'bold' },
});
