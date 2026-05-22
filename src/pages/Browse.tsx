import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api, KanaChar } from '../api';
import './Browse.css';

interface Props {
  onBack: () => void;
  onStartQuiz: (cfg: { type?: string; category?: string; count: number }) => void;
}

type KanaType = 'hiragana' | 'katakana';
type Category = 'main' | 'dakuten' | 'combination';

const CAT_LABELS: Record<Category, string> = {
  main: 'Utama',
  dakuten: 'Dakuten',
  combination: 'Kombinasi',
};

export default function Browse({ onBack, onStartQuiz }: Props) {
  const [activeType, setActiveType] = useState<KanaType>('hiragana');
  const [activeCategory, setActiveCategory] = useState<Category>('main');
  const [chars, setChars] = useState<KanaChar[]>([]);
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    setRevealed(new Set());
    const fn = activeType === 'hiragana' ? api.hiragana : api.katakana;
    fn(activeCategory)
      .then(d => setChars(d.characters))
      .catch(() => setChars([]))
      .finally(() => setLoading(false));
  }, [activeType, activeCategory]);

  const toggleReveal = (kana: string) => {
    setRevealed(prev => {
      const n = new Set(prev);
      n.has(kana) ? n.delete(kana) : n.add(kana);
      return n;
    });
  };

  const revealAll = () => setRevealed(new Set(chars.map(c => c.kana)));
  const hideAll = () => setRevealed(new Set());

  const filtered = search
    ? chars.filter(c => c.kana.includes(search) || c.romaji.toLowerCase().includes(search.toLowerCase()) || c.row.includes(search))
    : chars;

  // Group by row
  const byRow: Record<string, KanaChar[]> = {};
  filtered.forEach(c => {
    const row = c.row || 'Lainnya';
    if (!byRow[row]) byRow[row] = [];
    byRow[row].push(c);
  });

  return (
    <div className="browse-page">
      {/* Header */}
      <div className="browse-header">
        <button className="back-btn" onClick={onBack}>← Kembali</button>
        <h1 className="browse-title">
          <span className="japanese-char">{activeType === 'hiragana' ? 'ひらがな' : 'カタカナ'}</span>
        </h1>
        <div className="browse-count">{chars.length} karakter</div>
      </div>

      {/* Controls */}
      <div className="browse-controls">
        {/* Type toggle */}
        <div className="toggle-group">
          {(['hiragana', 'katakana'] as KanaType[]).map(t => (
            <button
              key={t}
              className={`toggle-btn ${activeType === t ? 'toggle-active' : ''}`}
              onClick={() => setActiveType(t)}
            >
              <span className="japanese-char">{t === 'hiragana' ? 'ひ' : 'カ'}</span>
              <span>{t === 'hiragana' ? 'Hiragana' : 'Katakana'}</span>
            </button>
          ))}
        </div>

        {/* Category */}
        <div className="cat-tabs">
          {(Object.entries(CAT_LABELS) as [Category, string][]).map(([c, l]) => (
            <button
              key={c}
              className={`cat-tab ${activeCategory === c ? 'cat-tab-active' : ''}`}
              onClick={() => setActiveCategory(c)}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Search + reveal controls */}
        <div className="browse-tools">
          <input
            className="browse-search"
            type="text"
            placeholder="Cari kana atau romaji..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="reveal-btns">
            <button className="reveal-btn" onClick={revealAll}>Tampilkan Semua</button>
            <button className="reveal-btn" onClick={hideAll}>Sembunyikan</button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="browse-body">
        {loading ? (
          <div className="browse-loading">
            <span className="japanese-char browse-loading-kana">読み込み中</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="browse-empty">Tidak ada karakter ditemukan</div>
        ) : (
          Object.entries(byRow).map(([row, rowChars]) => (
            <div key={row} className="row-group">
              <div className="row-label">
                <span className="japanese-char">{row}</span>
                <span className="row-count">{rowChars.length}</span>
              </div>
              <div className="kana-grid">
                {rowChars.map((c, i) => (
                  <motion.button
                    key={c.kana}
                    className={`kana-tile ${revealed.has(c.kana) ? 'tile-revealed' : ''}`}
                    onClick={() => toggleReveal(c.kana)}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03, duration: 0.2 }}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="tile-kana japanese-char">{c.kana}</span>
                    <span className={`tile-romaji ${revealed.has(c.kana) ? 'romaji-visible' : 'romaji-hidden'}`}>
                      {c.romaji}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom action */}
      <div className="browse-footer">
        <button
          className="btn-quiz-now"
          onClick={() => onStartQuiz({ type: activeType, category: activeCategory, count: Math.min(chars.length, 10) })}
        >
          <span className="japanese-char">クイズ</span>
          Quiz {CAT_LABELS[activeCategory]} {activeType === 'hiragana' ? 'Hiragana' : 'Katakana'} →
        </button>
      </div>
    </div>
  );
}
