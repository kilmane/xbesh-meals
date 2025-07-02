import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Auth from './components/Auth';
import MainApp from './components/MainApp';

const AppContent: React.FC = () => {
  const { user, authLoading } = useApp();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? <MainApp /> : <Auth />;
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
