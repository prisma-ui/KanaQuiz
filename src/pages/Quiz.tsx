import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import toast from 'react-hot-toast';
import { api, QuizSession, AnswerResult, FinishResult } from '../api';
import './Quiz.css';

interface Props {
  config: { type?: string; category?: string; count: number };
  onBack: () => void;
}

type Phase = 'loading' | 'active' | 'result';

export default function Quiz({ config, onBack }: Props) {
  const [phase, setPhase] = useState<Phase>('loading');
  const [session, setSession] = useState<QuizSession | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [lastResult, setLastResult] = useState<AnswerResult | null>(null);
  const [pendingFlip, setPendingFlip] = useState(false);
  const [finalResult, setFinalResult] = useState<FinishResult | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const inputRef = useRef<HTMLInputElement>(null);
  const answers = useRef<Map<number, AnswerResult>>(new Map());

  useEffect(() => {
    const h = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  useEffect(() => {
    api.startQuiz(config.type, config.category, config.count)
      .then(s => {
        setSession(s);
        setPhase('active');
        setTimeout(() => inputRef.current?.focus(), 300);
      })
      .catch(() => {
        toast.error('Gagal memulai quiz. Cek koneksi ke API.');
        onBack();
      });
  }, [config.type, config.category, config.count, onBack]);

  const submitAnswer = useCallback(async (skip = false) => {
    if (!session) return;
    const card = session.cards[currentIdx];
    const userAnswer = skip ? '' : answer.trim().toLowerCase();
    if (!skip && !userAnswer) return;

    setPendingFlip(true);
    try {
      const res = await api.answer(session.session_id, card.index, userAnswer);
      answers.current.set(card.index, res);
      setLastResult(res);
      setAnswer('');
    } catch {
      toast.error('Gagal mengirim jawaban.');
      setPendingFlip(false);
    }
  }, [session, currentIdx, answer]);

  const finishQuiz = useCallback(async () => {
    if (!session) return;
    setPhase('loading');
    try {
      const res = await api.finish(session.session_id);
      setFinalResult(res);
      setPhase('result');
      if (res.summary.score_percent >= 70) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    } catch {
      toast.error('Gagal mengambil hasil quiz.');
      setPhase('active');
    }
  }, [session]);

  const nextCard = useCallback(() => {
    if (!session) return;
    setPendingFlip(false);
    setLastResult(null);
    if (currentIdx + 1 >= session.total_cards) {
      finishQuiz();
    } else {
      setCurrentIdx(i => i + 1);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [session, currentIdx, finishQuiz]);

  const handleKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (lastResult) nextCard();
      else submitAnswer();
    }
  }, [lastResult, nextCard, submitAnswer]);

  if (phase === 'loading') return <LoadingScreen />;
  if (phase === 'result' && finalResult) return (
    <ResultScreen
      result={finalResult}
      onBack={onBack}
      onRetry={() => {
        setPhase('loading');
        setCurrentIdx(0);
        setLastResult(null);
        answers.current.clear();
        api.startQuiz(config.type, config.category, config.count)
          .then(s => { setSession(s); setPhase('active'); });
      }}
      showConfetti={showConfetti}
      windowSize={windowSize}
    />
  );
  if (!session) return null;

  const card = session.cards[currentIdx];
  const progress = (currentIdx / session.total_cards) * 100;
  const answeredCount = answers.current.size;
  const correctCount = Array.from(answers.current.values()).filter(a => a.correct).length;

  return (
    <div className="quiz-page">
      {/* Header */}
      <div className="quiz-header">
        <button className="quiz-back-btn" onClick={onBack}>← Kembali</button>
        <div className="quiz-score-live">
          <span className="score-correct">{correctCount}</span>
          <span className="score-sep">/</span>
          <span className="score-total">{answeredCount}</span>
        </div>
        <div className="quiz-card-count">{currentIdx + 1} / {session.total_cards}</div>
      </div>

      {/* Progress bar */}
      <div className="quiz-progress-track">
        <motion.div
          className="quiz-progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <div className="quiz-content">
        {/* Kana type badge */}
        <div className="quiz-meta">
          <span className={`type-badge type-badge-${card.type}`}>{card.type}</span>
          <span className="category-badge">{card.category}</span>
          <span className="row-badge japanese-char">{card.row}</span>
        </div>

        {/* The card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx + (lastResult ? '-flipped' : '')}
            className={`kana-card ${lastResult ? (lastResult.correct ? 'card-correct' : 'card-wrong') : ''}`}
            initial={{ rotateY: pendingFlip ? 90 : 0, opacity: pendingFlip ? 0 : 1, scale: 0.95 }}
            animate={{ rotateY: 0, opacity: 1, scale: 1 }}
            exit={{ rotateY: -90, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            <div className="kana-char japanese-char">{card.kana}</div>
            {lastResult && (
              <div className="card-reveal">
                <div className="correct-romaji">{lastResult.correct_romaji}</div>
                <div className={`verdict ${lastResult.correct ? 'verdict-correct' : 'verdict-wrong'}`}>
                  {lastResult.correct ? '✓ Benar!' : `✗ Jawabanmu: "${lastResult.your_answer || '(skip)'}"`}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Input area */}
        {!lastResult ? (
          <div className="input-area">
            <div className="input-hint">Ketik romaji, tekan Enter</div>
            <div className="input-row">
              <input
                ref={inputRef}
                className="romaji-input"
                type="text"
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                onKeyDown={handleKey}
                placeholder="romaji..."
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
              />
              <button className="btn-submit" onClick={() => submitAnswer()} disabled={!answer.trim()}>
                →
              </button>
            </div>
            <button className="btn-skip" onClick={() => submitAnswer(true)}>
              Lewati
            </button>
          </div>
        ) : (
          <div className="next-area">
            <button className="btn-next" onClick={nextCard} autoFocus>
              {currentIdx + 1 >= session.total_cards ? 'Lihat Hasil →' : 'Lanjut →'}
            </button>
          </div>
        )}

        {/* Mini progress dots */}
        <div className="progress-dots">
          {session.cards.map((_, i) => {
            const ans = answers.current.get(session.cards[i].index);
            const isCurrent = i === currentIdx;
            return (
              <div
                key={i}
                className={`dot ${isCurrent ? 'dot-current' : ''} ${ans ? (ans.correct ? 'dot-correct' : 'dot-wrong') : ''}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LoadingScreen() {
  const LOADING_KANA = ['あ','い','う','え','お'];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % LOADING_KANA.length), 400);
    return () => clearInterval(t);
  }, [LOADING_KANA.length]);
  return (
    <div className="loading-screen">
      <div className="loading-kana japanese-char">{LOADING_KANA[idx]}</div>
      <p>Mempersiapkan soal...</p>
    </div>
  );
}

interface ResultProps {
  result: FinishResult;
  onBack: () => void;
  onRetry: () => void;
  showConfetti: boolean;
  windowSize: { w: number; h: number };
}

function ResultScreen({ result, onBack, onRetry, showConfetti, windowSize }: ResultProps) {
  const { summary, results } = result;
  const pct = Math.round(summary.score_percent);
  const grade = pct >= 90 ? { label: '完璧!', sub: 'Sempurna!', color: '#d4a017' }
    : pct >= 70 ? { label: '良い!', sub: 'Bagus!', color: '#1a7a4a' }
    : pct >= 50 ? { label: 'まあまあ', sub: 'Lumayan', color: '#1a3a5c' }
    : { label: 'がんばれ!', sub: 'Terus Berlatih!', color: '#c0392b' };

  return (
    <div className="result-page">
      {showConfetti && (
        <Confetti width={windowSize.w} height={windowSize.h} numberOfPieces={300} recycle={false}
          colors={['#c0392b','#d4a017','#1a7a4a','#1a3a5c','#faf8f3']} />
      )}

      <div className="result-content">
        <motion.div className="result-hero" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="result-grade japanese-char" style={{ color: grade.color }}>{grade.label}</div>
          <div className="result-grade-sub">{grade.sub}</div>
          <div className="result-score-circle" style={{ borderColor: grade.color }}>
            <span className="result-pct">{pct}%</span>
            <span className="result-pct-label">Skor</span>
          </div>
        </motion.div>

        <div className="result-stats">
          {[
            { label: 'Benar', value: summary.correct, color: 'var(--jade)' },
            { label: 'Salah', value: summary.incorrect, color: 'var(--vermillion)' },
            { label: 'Dilewati', value: summary.skipped, color: 'var(--gold)' },
            { label: 'Total', value: summary.total_cards, color: 'var(--ink)' },
          ].map(s => (
            <div key={s.label} className="result-stat">
              <span className="result-stat-num" style={{ color: s.color }}>{s.value}</span>
              <span className="result-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Results list */}
        <div className="results-list">
          <h3 className="results-list-title">Detail Jawaban</h3>
          <div className="results-grid">
            {results.map(r => (
              <div key={r.index} className={`result-row ${r.correct ? 'rr-correct' : r.skipped ? 'rr-skip' : 'rr-wrong'}`}>
                <span className="rr-kana japanese-char">{r.kana}</span>
                <span className="rr-correct-romaji">{r.correct_romaji}</span>
                {r.skipped ? (
                  <span className="rr-your-answer rr-skip-label">skip</span>
                ) : (
                  <span className={`rr-your-answer ${r.correct ? 'rr-ok' : 'rr-bad'}`}>
                    {r.your_answer || '—'}
                  </span>
                )}
                <span className="rr-icon">{r.correct ? '✓' : r.skipped ? '○' : '✗'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="result-actions">
          <button className="btn-retry" onClick={onRetry}>
            <span className="japanese-char">再挑戦</span> Coba Lagi
          </button>
          <button className="btn-home" onClick={onBack}>← Beranda</button>
        </div>
      </div>
    </div>
  );
}
