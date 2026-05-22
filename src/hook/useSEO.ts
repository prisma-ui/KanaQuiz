import { useEffect } from 'react';

export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'app';
  author?: string;
  ogType?: string;
}

/**
 * Hook untuk mengatur SEO meta tags secara dynamic
 * @param config - Konfigurasi SEO
 */
export function useSEO(config: SEOConfig) {
  useEffect(() => {
    // Update title
    if (config.title) {
      document.title = config.title;
      updateMetaTag('og:title', config.title);
      updateMetaTag('twitter:title', config.title);
    }

    // Update description
    if (config.description) {
      updateMetaTag('description', config.description);
      updateMetaTag('og:description', config.description);
      updateMetaTag('twitter:description', config.description);
    }

    // Update keywords
    if (config.keywords) {
      updateMetaTag('keywords', config.keywords);
    }

    // Update image
    if (config.image) {
      updateMetaTag('og:image', config.image);
      updateMetaTag('twitter:image', config.image);
    }

    // Update URL
    if (config.url) {
      updateMetaTag('og:url', config.url);
      updateMetaTag('twitter:url', config.url);
      updateLinkTag('canonical', config.url);
    }

    // Update type
    if (config.ogType) {
      updateMetaTag('og:type', config.ogType);
    }

    // Update author
    if (config.author) {
      updateMetaTag('author', config.author);
    }

    return () => {
      // Cleanup if needed
    };
  }, [config]);
}

/**
 * Update atau create meta tag
 */
function updateMetaTag(name: string, content: string) {
  let element = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
  
  if (!element) {
    element = document.createElement('meta');
    if (name.startsWith('og:') || name.startsWith('twitter:')) {
      element.setAttribute('property', name);
    } else {
      element.setAttribute('name', name);
    }
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
}

/**
 * Update atau create link tag
 */
function updateLinkTag(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`);
  
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  
  element.setAttribute('href', href);
}

/**
 * Structured Data untuk JSON-LD (Schema.org)
 */
export function useStructuredData(data: Record<string, any>) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [data]);
}

/**
 * Default SEO config untuk home page
 */
export const HOME_SEO: SEOConfig = {
  title: '仮名 Quiz — Belajar Hiragana & Katakana',
  description: 'Quiz interaktif untuk menguasai hiragana dan katakana dengan sistem penilaian real-time. 46 hiragana + 46 katakana, 3 kategori, latihan unlimited.',
  keywords: 'hiragana, katakana, japanese, kana, quiz, belajar bahasa jepang',
  url: 'https://kanaquiz-neon.vercel.app/',
  type: 'website',
  ogType: 'website',
  author: 'Kana Quiz'
};

/**
 * Structured data untuk Quiz app
 */
export const QUIZ_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'EducationEvent',
  name: '仮名 Quiz — Belajar Hiragana & Katakana',
  description: 'Interactive quiz untuk belajar hiragana dan katakana',
  organizer: {
    '@type': 'Organization',
    name: 'Kana Quiz',
    url: 'https://kanaquiz-neon.vercel.app/'
  },
  inLanguage: 'id',
  isAccessibleForFree: true,
  teaches: [
    'Hiragana',
    'Katakana',
    'Japanese Writing System'
  ],
  learningResourceType: 'Quiz',
  image: 'https://kanaquiz-neon.vercel.app/logo512.png'
};

/**
 * Structured data untuk Software/App
 */
export const APP_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: '仮名 Quiz',
  description: 'Interactive quiz app untuk belajar hiragana dan katakana',
  url: 'https://kanaquiz-neon.vercel.app/',
  applicationCategory: 'EducationalApplication',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD'
  },
  operatingSystem: 'Web',
  inLanguage: ['id', 'en'],
  image: 'https://kanaquiz-neon.vercel.app/logo512.png',
  isAccessibleForFree: true,
  softwareVersion: '0.1.0',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.5',
    ratingCount: '100'
  }
};
