
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Home, Video, Wallet } from 'lucide-react';
import CoinBalance from './CoinBalance';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const routes = [
    { path: '/daily-login', label: 'Daily Login', icon: <Calendar className="w-5 h-5" /> },
    { path: '/', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { path: '/watch-ads', label: 'Watch Ads', icon: <Video className="w-5 h-5" /> },
    { path: '/withdraw', label: 'Withdraw', icon: <Wallet className="w-5 h-5" /> },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex justify-between items-center px-4 py-3">
          <div className="flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex flex-col items-center justify-center w-8 h-8 rounded-md mr-3 hover:bg-gray-100"
            >
              <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-gray-700 my-1 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
            </button>
            <h1 className="text-lg font-semibold text-app-purple-dark">Karcha Kamao</h1>
          </div>
          <CoinBalance />
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="absolute top-full left-0 w-full bg-white shadow-md z-20 py-2">
            <ul>
              {routes.map((route) => (
                <li key={route.path}>
                  <Link 
                    to={route.path} 
                    className={`flex items-center px-4 py-2.5 ${isActive(route.path) ? 'bg-app-gray-light text-app-purple font-medium' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mr-3">{route.icon}</span>
                    {route.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">{children}</main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 bg-white border-t border-gray-200 shadow-sm">
        <div className="flex justify-around">
          {routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className={`flex flex-col items-center py-2 px-4 ${
                isActive(route.path)
                  ? 'text-app-purple'
                  : 'text-gray-600'
              }`}
            >
              {route.icon}
              <span className="text-xs mt-1">{route.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
