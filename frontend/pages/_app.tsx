import React from 'react';
import { AppProps } from 'next/app';
import axios from 'axios';
import '../styles/globals.css';

// axios 기본 설정
axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_API_URL}`;
axios.defaults.withCredentials = true;

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp; 