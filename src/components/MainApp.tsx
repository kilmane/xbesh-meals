import React, { useState } from 'react';
import { ChefHat, Package, Calendar, ShoppingCart, Settings, Home, LogOut } from 'lucide-react';
import Dashboard from './Dashboard';
import Inventory from './Inventory';
import MealPlanner from './MealPlanner';
import Recipes from './Recipes';
import ShoppingList from './ShoppingList';
import SettingsComponent from './Settings';
import { useApp } from '../context/AppContext';

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, signOut } = useApp();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'planner', label: 'Meal Planner', icon: Calendar },
    { id: 'recipes', label: 'Recipes', icon: ChefHat },
    { id: 'shopping', label: 'Shopping', icon: ShoppingCart },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <Inventory />;
      case 'planner':
        return <MealPlanner />;
      case 'recipes':
        return <Recipes />;
      case 'shopping':
        return <ShoppingList />;
      case 'settings':
        return <SettingsComponent />;
      default:
        return <Dashboard />;
    }
  };

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await signOut();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">FreshPlan</h1>
                {user?.email && (
                  <p className="text-xs text-gray-500">{user.email}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setActiveTab('settings')}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Settings className="w-6 h-6" />
              </button>
              <button 
                onClick={handleSignOut}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-green-600 border-b-2 border-green-500 bg-green-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default MainApp;
