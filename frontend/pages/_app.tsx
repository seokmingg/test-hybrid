import React from 'react';
import type { AppProps } from 'next/app';
import axios from 'axios';
import '../styles/globals.css';
import logger from '../utils/logger';

// axios 기본 설정
axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_API_URL}`;
axios.defaults.withCredentials = true;

function MyApp({ Component, pageProps }: AppProps) {
  // 페이지 로드 시 로깅
  logger.info('페이지 로드', { 
    page: Component.displayName || Component.name || 'Unknown',
    ...pageProps
  });

  return <Component {...pageProps} />;
}

export default MyApp; 