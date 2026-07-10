export * from './Vehicle';
export * from './Telemetry';
export * from './Alert';
export * from './Maintenance';
export * from './Chart';


export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  timestamp: string;
}

export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface AsyncState {
  status: LoadingState;
  error: string | null;
}
export type { RCAData } from "./Vehicle";

