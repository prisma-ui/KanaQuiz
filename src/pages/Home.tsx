import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Home.css';

interface Props {
  onStartQuiz: (cfg: { type?: string; category?: string; count: number }) => void;
  onBrowse: () => void;
}

const BG_KANA = ['あ','い','う','え','お','か','き','く','け','こ','さ','し','す','せ','そ','な','に','ぬ','ね','の','は','ひ','ふ','へ','ほ','ア','イ','ウ','エ','オ','カ','キ','ク','ケ','コ','サ','シ','ス','セ','ソ'];

export default function Home({ onStartQuiz, onBrowse }: Props) {
  const [kanaType, setKanaType] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [count, setCount] = useState(10);

  const handleStart = () => {
    onStartQuiz({
      type: kanaType || undefined,
      category: category || undefined,
      count,
    });
  };

  return (
    <div className="home">
      {/* Floating kana background */}
      <div className="home-bg" aria-hidden="true">
        {BG_KANA.map((k, i) => (
          <span
            key={i}
            className="bg-kana"
            style={{
              left: `${(i * 7.3 + 3) % 100}%`,
              top: `${(i * 11.7 + 5) % 100}%`,
              animationDelay: `${(i * 0.4) % 8}s`,
              fontSize: `${1.2 + (i % 4) * 0.4}rem`,
              opacity: 0.04 + (i % 5) * 0.015,
            }}
          >
            {k}
          </span>
        ))}
      </div>

      <div className="home-content">
        {/* Header */}
        <motion.div className="hero" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="hero-badge">日本語学習</div>
          <h1 className="hero-title">
            <span className="japanese-char hero-kana-title">仮名</span>
            <span className="hero-subtitle-word">Quiz</span>
          </h1>
          <p className="hero-desc">Kuasai Hiragana & Katakana dengan latihan interaktif berbasis <em>tofugu.com</em></p>
        </motion.div>

        {/* Config card */}
        <motion.div
          className="config-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="config-title">Atur Quiz</h2>

          {/* Kana type */}
          <div className="config-group">
            <label className="config-label">Jenis Kana</label>
            <div className="chip-group">
              {[
                { v: '', label: 'Semua', sub: 'ひ + ア' },
                { v: 'hiragana', label: 'Hiragana', sub: 'ひらがな' },
                { v: 'katakana', label: 'Katakana', sub: 'カタカナ' },
              ].map(o => (
                <button
                  key={o.v}
                  className={`chip ${kanaType === o.v ? 'chip-active' : ''}`}
                  onClick={() => setKanaType(o.v)}
                >
                  <span className="chip-label">{o.label}</span>
                  <span className="chip-sub japanese-char">{o.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="config-group">
            <label className="config-label">Kategori</label>
            <div className="chip-group">
              {[
                { v: '', label: 'Semua' },
                { v: 'main', label: 'Main' },
                { v: 'dakuten', label: 'Dakuten' },
                { v: 'combination', label: 'Kombinasi' },
              ].map(o => (
                <button
                  key={o.v}
                  className={`chip ${category === o.v ? 'chip-active' : ''}`}
                  onClick={() => setCategory(o.v)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          <div className="config-group">
            <label className="config-label">Jumlah Soal: <strong>{count}</strong></label>
            <input
              type="range"
              min={5}
              max={50}
              step={5}
              value={count}
              onChange={e => setCount(Number(e.target.value))}
              className="slider"
            />
            <div className="slider-marks">
              {[5, 10, 20, 30, 50].map(n => (
                <span key={n} className={count === n ? 'mark-active' : ''}>{n}</span>
              ))}
            </div>
          </div>

          <button className="btn-start" onClick={handleStart}>
            <span className="japanese-char btn-start-kana">始める</span>
            <span>Mulai Quiz</span>
            <span className="btn-arrow">→</span>
          </button>
        </motion.div>

        {/* Browse card */}
        <motion.div
          className="browse-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          <div className="browse-content">
            <div>
              <h3>Belajar Dulu?</h3>
              <p>Lihat semua karakter hiragana & katakana dengan romaji-nya</p>
            </div>
            <button className="btn-browse" onClick={onBrowse}>
              Jelajahi <span className="japanese-char">→</span>
            </button>
          </div>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          className="stats-strip"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {[
            { num: '46', label: 'Hiragana', kana: 'ひらがな' },
            { num: '46', label: 'Katakana', kana: 'カタカナ' },
            { num: '3', label: 'Kategori', kana: '種類' },
            { num: '∞', label: 'Latihan', kana: '練習' },
          ].map(s => (
            <div key={s.label} className="stat-item">
              <span className="stat-num">{s.num}</span>
              <span className="stat-label">{s.label}</span>
              <span className="stat-kana japanese-char">{s.kana}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
