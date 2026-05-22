import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { useSEO, useStructuredData, HOME_SEO, QUIZ_STRUCTURED_DATA, APP_STRUCTURED_DATA } from './hooks/useSEO';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Browse from './pages/Browse';
import './App.css';

export type Page = 'home' | 'quiz' | 'browse';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [quizConfig, setQuizConfig] = useState<{
    type?: string;
    category?: string;
    count: number;
  } | null>(null);

  // Setup SEO based on current page
  useSEO(
    page === 'home' ? HOME_SEO : {
      title: '仮名 Quiz — Quiz',
      description: 'Ikuti quiz untuk menguji kemampuan hiragana dan katakana Anda',
      url: 'https://kanaquiz.vercel.app/'
    }
  );

  // Add app structured data (always called)
  useStructuredData(APP_STRUCTURED_DATA);

  // Prepare structured data based on page
  const structuredData = page === 'quiz' ? QUIZ_STRUCTURED_DATA : APP_STRUCTURED_DATA;

  const startQuiz = (cfg: { type?: string; category?: string; count: number }) => {
    setQuizConfig(cfg);
    setPage('quiz');
  };

  return (
    <div className="app-root">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: "'Space Grotesk', sans-serif",
            background: '#1a1a2e',
            color: '#faf8f3',
            borderRadius: '8px',
            fontSize: '14px',
          },
        }}
      />

      <AnimatePresence mode="wait">
        {page === 'home' && (
          <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}>
            <Home onStartQuiz={startQuiz} onBrowse={() => setPage('browse')} />
          </motion.div>
        )}
        {page === 'quiz' && quizConfig && (
          <motion.div key="quiz" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}>
            <Quiz config={quizConfig} onBack={() => setPage('home')} />
          </motion.div>
        )}
        {page === 'browse' && (
          <motion.div key="browse" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}>
            <Browse onBack={() => setPage('home')} onStartQuiz={startQuiz} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
