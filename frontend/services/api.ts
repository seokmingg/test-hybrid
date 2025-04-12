import axios from 'axios';
import logger from '../utils/logger';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = {
  // 메모 관련 API
  async getMemos(token: string) {
    try {
      logger.info('메모 목록 조회 시작');
      const response = await axios.get(`${API_BASE_URL}/api/memo`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      logger.info('메모 목록 조회 성공', { count: response.data.length });
      return response.data;
    } catch (error) {
      logger.error('메모 목록 조회 실패', { 
        error: error.message,
        status: error.response?.status
      });
      throw error;
    }
  },

  async createMemo(token: string, content: string) {
    try {
      logger.info('메모 저장 시작', { content });
      const response = await axios.post(
        `${API_BASE_URL}/api/memo`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      logger.info('메모 저장 성공', { content });
      return response.data;
    } catch (error) {
      logger.error('메모 저장 실패', { 
        content,
        error: error.message,
        status: error.response?.status
      });
      throw error;
    }
  },

  // 인증 관련 API
  async getProfile(token: string) {
    try {
      logger.info('프로필 조회 시작');
      const response = await axios.get(`${API_BASE_URL}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      logger.info('프로필 조회 성공');
      return response.data;
    } catch (error) {
      logger.error('프로필 조회 실패', { 
        error: error.message,
        status: error.response?.status
      });
      throw error;
    }
  }
}; 