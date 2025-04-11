import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { User } from '../types/user';

interface Memo {
  id: string;
  content: string;
  createdAt: string;
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [memos, setMemos] = useState<Memo[]>([]);
  const [newMemo, setNewMemo] = useState('');

  useEffect(() => {
    // URL에서 토큰 파라미터 확인
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    
    if (token) {
      // 토큰을 localStorage에 저장
      localStorage.setItem('token', token);
      // URL에서 토큰 제거
      router.replace('/', undefined, { shallow: true });
    }

    const fetchUser = async () => {
      try {
        const savedToken = localStorage.getItem('token');
        // console.log('Saved token:', savedToken);

        if (!savedToken) {
          setUser(null);
          setLoading(false);
          return;
        }

        const response = await axios.get('/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${savedToken}`
          }
        });
        // console.log('Profile response:', response.data);
        setUser(response.data);
        fetchMemos();
      } catch (error) {
        console.error('사용자 정보를 가져오는데 실패했습니다:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const fetchMemos = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('/api/memo', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMemos(response.data);
    } catch (error) {
      console.error('메모를 가져오는데 실패했습니다:', error);
    }
  };

  const handleLogout = () => {
    try {
      // 먼저 localStorage에서 토큰 제거
      localStorage.removeItem('token');
      // 상태 초기화
      setUser(null);
      setMemos([]);
      // 홈으로 리다이렉트
      router.replace('/', undefined, { shallow: true });
    } catch (error) {
      console.error('로그아웃에 실패했습니다:', error);
      // 에러가 발생해도 로컬의 토큰은 제거
      localStorage.removeItem('token');
      setUser(null);
      setMemos([]);
    }
  };

  const handleSubmitMemo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.post(
        '/api/memo',
        { content: newMemo },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setNewMemo('');
      fetchMemos();
    } catch (error) {
      console.error('메모 저장에 실패했습니다:', error);
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }
  // console.log('유저',user)
  return (
    <div className="container">
      <h1>소셜로그인 테스트</h1>



      {user ? (
        <div>
          <p>안녕하세요, {user.name || user.email.split('@')[0]}님!</p>
          <p>이메일: {user.email}</p>
          <p>소셜 로그인: {user.provider}</p>
          <button
            onClick={handleLogout}
            className="logout-button"
          >
            로그아웃
          </button>

          <div className="memo-section">
            <h2>메모</h2>
            <form onSubmit={handleSubmitMemo}>
              <input
                type="text"
                value={newMemo}
                onChange={(e) => setNewMemo(e.target.value)}
                placeholder="메모를 입력하세요"
              />
              <button type="submit">저장</button>
            </form>
            <ul>
              {memos.map((memo) => (
                <div className='memo-item' key={memo.id}>
                  {memo.content}
                  <span className="memo-date">
                    {new Date(memo.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="login-section">
          <button
            onClick={() => {
              window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
            }}
            className="google-login"
          >
            Google로 로그인
          </button>
          <button
            onClick={() => {
              window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/kakao`;
            }}
            className="kakao-login"
          >
            Kakao로 로그인
          </button>
        </div>
      )}

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .memo-section {
          margin-top: 20px;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        textarea {
          width: 100%;
          height: 100px;
          margin-bottom: 10px;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        .memo-list {
          margin-top: 20px;
        }
        .memo-item {
          padding: 10px;
          margin-bottom: 10px;
          border: 1px solid #eee;
          border-radius: 5px;
        }
        button {
          padding: 8px 16px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        button:hover {
          background-color: #0051a2;
        }
      `}</style>
    </div>
  );
} 