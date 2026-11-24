/**
 * Portal data service (demo). Data is kept in the browser's localStorage under "essi:*" keys,
 * the same as the design prototype. When the FastAPI backend is ready, replace the functions
 * in these files with calls through '@/services/api' – pages only import from here.
 */
export * from './types';
export * from './constants';
export * from './accounts';
export * from './auth';
export * from './outbox';
export * from './registration';
export * from './tracking';
export { STORAGE_KEYS } from './storage';
export * from './masterData';
export * from './employerNumber';
