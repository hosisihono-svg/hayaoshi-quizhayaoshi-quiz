import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';

const MOCK_QUESTIONS = [
  { id: 1, text: '日本の首都はどこですか？', answer: '東京' },
  { id: 2, text: '1 + 1 は何ですか？', answer: '2' },
  { id: 3, text: '富士山の高さは何メートル？', answer: '3776' },
];

const MOCK_PLAYERS = [
  { id: '1', name: 'あなた', score: 0 },
  { id: '2', name: 'たろう', score: 0 },
  { id: '3', name: 'はなこ', score: 0 },
];

export default function GameScreen({ route, navigation }) {
  const { roomCode, playerName } = route.params;
  const [questionIndex, setQuestionIndex] = useState(0);
  const [buzzed, setBuzzed] = useState(false);
  const [buzzedPlayer, setBuzzedPlayer] = useState(null);
  const [players, setPlayers] = useState(MOCK_PLAYERS);
  const [phase, setPhase] = useState('question'); // 'question' | 'buzzed' | 'result'
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const currentQuestion = MOCK_QUESTIONS[questionIndex];

  const handleBuzz = () => {
    if (buzzed) return;
    setBuzzed(true);
    setBuzzedPlayer(playerName);
    setPhase('buzzed');

    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.1, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleCorrect = () => {
    setPlayers((prev) =>
      prev.map((p) => (p.name === buzzedPlayer ? { ...p, score: p.score + 1 } : p))
    );
    nextQuestion();
  };

  const handleWrong = () => {
    nextQuestion();
  };

  const nextQuestion = () => {
    if (questionIndex + 1 >= MOCK_QUESTIONS.length) {
      navigation.navigate('Result', { players, roomCode });
    } else {
      setQuestionIndex((i) => i + 1);
      setBuzzed(false);
      setBuzzedPlayer(null);
      setPhase('question');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.questionNumber}>
          問題 {questionIndex + 1} / {MOCK_QUESTIONS.length}
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
        <Text style={styles.questionText}>{currentQuestion.text}</Text>
      </View>

      {phase === 'buzzed' && (
        <View style={styles.buzzedBanner}>
          <Text style={styles.buzzedText}>⚡ {buzzedPlayer} が早押し！</Text>
          <View style={styles.judgeButtons}>
            <TouchableOpacity style={styles.correctButton} onPress={handleCorrect}>
              <Text style={styles.judgeButtonText}>○ 正解</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.wrongButton} onPress={handleWrong}>
              <Text style={styles.judgeButtonText}>✕ 不正解</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.buzzerArea}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[styles.buzzerButton, buzzed && styles.buzzerPressed]}
            onPress={handleBuzz}
            disabled={buzzed}
            activeOpacity={0.8}
          >
            <Text style={styles.buzzerText}>{buzzed ? '押した！' : '早押し！'}</Text>
          </TouchableOpacity>
        </Animated.View>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },
  questionNumber: {
    color: '#a8a8b3',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  scores: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  scoreItem: {
    alignItems: 'center',
    backgroundColor: '#16213e',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  scoreName: {
    color: '#a8a8b3',
    fontSize: 12,
  },
  scoreValue: {
    color: '#e94560',
    fontSize: 20,
    fontWeight: 'bold',
  },
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
  questionText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 36,
  },
  buzzedBanner: {
    marginHorizontal: 24,
    backgroundColor: '#2d1b00',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e94560',
  },
  buzzedText: {
    color: '#e94560',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  judgeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  correctButton: {
    backgroundColor: '#1a4731',
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  wrongButton: {
    backgroundColor: '#4a1515',
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  judgeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buzzerArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  buzzerPressed: {
    backgroundColor: '#555',
    shadowOpacity: 0,
  },
  buzzerText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
  },
});
