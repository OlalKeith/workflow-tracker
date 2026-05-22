// API functions for applications
import axios from 'axios'
import { Application } from '../types/application'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
})

export const getApplications = () =>
  api.get<Application[]>('/applications/').then(r => r.data)

export const getApplication = (id: number) =>
  api.get<Application>(`/applications/${id}`).then(r => r.data)

export const createApplication = (data: Partial<Application>) =>
  api.post<Application>('/applications/', data).then(r => r.data)

export const updateApplication = (id: number, data: Partial<Application>) =>
  api.put<Application>(`/applications/${id}`, data).then(r => r.data)

export const submitApplication = (id: number) =>
  api.post<Application>(`/applications/${id}/submit`).then(r => r.data)

export const startReview = (id: number) =>
  api.post<Application>(`/applications/${id}/start-review`).then(r => r.data)

export const recordDecision = (id: number, data: { decision: string; reviewer_comment?: string }) =>
  api.post<Application>(`/applications/${id}/decision`, data).then(r => r.data)