import axios from 'axios';
import queryString from 'query-string';
import { ThreadInterface, ThreadGetQueryInterface } from 'interfaces/thread';
import { GetQueryInterface } from '../../interfaces';

export const getThreads = async (query?: ThreadGetQueryInterface) => {
  const response = await axios.get(`/api/threads${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createThread = async (thread: ThreadInterface) => {
  const response = await axios.post('/api/threads', thread);
  return response.data;
};

export const updateThreadById = async (id: string, thread: ThreadInterface) => {
  const response = await axios.put(`/api/threads/${id}`, thread);
  return response.data;
};

export const getThreadById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/threads/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteThreadById = async (id: string) => {
  const response = await axios.delete(`/api/threads/${id}`);
  return response.data;
};
