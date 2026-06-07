import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  state: string;
  progress: number;
  complianceScore: number;
  lastActivity: string;
  status: 'active' | 'completed' | 'pending';
}

export interface AnalysisResult {
  id: string;
  imageUrl: string;
  detectedElements: DetectedElement[];
  gpsData: GPSData | null;
  measurements: Measurement[];
  overallConfidence: number;
}

export interface DetectedElement {
  id: string;
  label: string;
  confidence: number;
  bbox: { x: number; y: number; w: number; h: number };
}

export interface GPSData {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  timestamp: string;
}

export interface Measurement {
  id: string;
  sno: number;
  description: string;
  category: string;
  number: number;
  length: number;
  breadth: number;
  depthOrHeight: number;
  quantity: number;
  unit: string;
  confidence: number;
  rate?: number;
  amount?: number;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  currentProject: Project | null;
  projects: Project[];
  analysisResults: AnalysisResult[];
  sidebarOpen: boolean;
  theme: 'dark';
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_CURRENT_PROJECT'; payload: Project | null }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'ADD_ANALYSIS_RESULT'; payload: AnalysisResult }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR'; payload: boolean }
  | { type: 'LOGOUT' };

const initialState: AppState = {
  user: localStorage.getItem('mbook_user')
    ? JSON.parse(localStorage.getItem('mbook_user')!)
    : null,
  isAuthenticated: !!localStorage.getItem('mbook_token'),
  currentProject: null,
  projects: [],
  analysisResults: [],
  sidebarOpen: false,
  theme: 'dark',
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'SET_CURRENT_PROJECT':
      return { ...state, currentProject: action.payload };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'ADD_ANALYSIS_RESULT':
      return { ...state, analysisResults: [...state.analysisResults, action.payload] };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'SET_SIDEBAR':
      return { ...state, sidebarOpen: action.payload };
    case 'LOGOUT':
      localStorage.removeItem('mbook_token');
      localStorage.removeItem('mbook_user');
      return { ...initialState, user: null, isAuthenticated: false };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const login = async (_username: string, _password: string) => {
    // Mock login — in production this would call the API
    const mockUser: User = {
      id: '1',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@mbook.ai',
      role: 'Senior Auditor',
    };
    const mockToken = 'mock-jwt-token-' + Date.now();
    localStorage.setItem('mbook_token', mockToken);
    localStorage.setItem('mbook_user', JSON.stringify(mockUser));
    dispatch({ type: 'SET_USER', payload: mockUser });
    dispatch({ type: 'SET_AUTHENTICATED', payload: true });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AppContext.Provider value={{ state, dispatch, login, logout }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
