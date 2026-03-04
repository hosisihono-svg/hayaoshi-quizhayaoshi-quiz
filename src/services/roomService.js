import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  collection,
  getDocs,
  serverTimestamp,
  deleteDoc,
} from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { db, auth } from '../config/firebase';

// 匿名ログイン
export async function signIn() {
  const { user } = await signInAnonymously(auth);
  return user.uid;
}

// ルーム作成
export async function createRoom(roomCode, playerName, uid) {
  const roomRef = doc(db, 'rooms', roomCode);
  await setDoc(roomRef, {
    status: 'waiting',
    hostId: uid,
    currentQuestion: null,
    createdAt: serverTimestamp(),
  });
  await setDoc(doc(db, 'rooms', roomCode, 'players', uid), {
    name: playerName,
    score: 0,
    ready: false,
    isHost: true,
  });
}

// ルーム参加
export async function joinRoom(roomCode, playerName, uid) {
  const roomRef = doc(db, 'rooms', roomCode);
  const snap = await getDoc(roomRef);
  if (!snap.exists()) throw new Error('ルームが見つかりません');
  await setDoc(doc(db, 'rooms', roomCode, 'players', uid), {
    name: playerName,
    score: 0,
    ready: false,
    isHost: false,
  });
}

// 準備完了トグル
export async function setReady(roomCode, uid, ready) {
  await updateDoc(doc(db, 'rooms', roomCode, 'players', uid), { ready });
}

// ゲーム開始（ホストのみ）
export async function startGame(roomCode, question) {
  await updateDoc(doc(db, 'rooms', roomCode), {
    status: 'question',
    currentQuestion: question,
  });
}

// 早押し（buzz）
export async function buzz(roomCode, uid) {
  const buzzRef = doc(db, 'rooms', roomCode, 'buzzes', uid);
  const snap = await getDoc(buzzRef);
  if (snap.exists()) return; // すでに押している
  await setDoc(buzzRef, { timestamp: serverTimestamp() });
}

// スコア更新
export async function updateScore(roomCode, uid, delta) {
  const playerRef = doc(db, 'rooms', roomCode, 'players', uid);
  const snap = await getDoc(playerRef);
  const current = snap.data()?.score ?? 0;
  await updateDoc(playerRef, { score: current + delta });
}

// buzzesを全削除
export async function clearBuzzes(roomCode) {
  const snap = await getDocs(collection(db, 'rooms', roomCode, 'buzzes'));
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
}

// 次の問題へリセット
export async function nextQuestion(roomCode, question) {
  await clearBuzzes(roomCode);
  await updateDoc(doc(db, 'rooms', roomCode), {
    status: 'question',
    currentQuestion: question,
  });
}

// ゲーム終了
export async function endGame(roomCode) {
  await updateDoc(doc(db, 'rooms', roomCode), { status: 'finished' });
}

// ルームのリアルタイム監視
export function listenRoom(roomCode, callback) {
  return onSnapshot(doc(db, 'rooms', roomCode), (snap) => {
    callback(snap.data());
  });
}

// プレイヤー一覧のリアルタイム監視
export function listenPlayers(roomCode, callback) {
  return onSnapshot(collection(db, 'rooms', roomCode, 'players'), (snap) => {
    const players = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(players);
  });
}

// 早押し一覧のリアルタイム監視
export function listenBuzzes(roomCode, callback) {
  return onSnapshot(collection(db, 'rooms', roomCode, 'buzzes'), (snap) => {
    const buzzes = snap.docs
      .filter((d) => d.data().timestamp)
      .map((d) => ({ id: d.id, timestamp: d.data().timestamp }))
      .sort((a, b) => a.timestamp?.seconds - b.timestamp?.seconds);
    callback(buzzes);
  });
}
