import { Link, useLocation } from "wouter";
import { useState } from "react";

export default function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <div className="animate-logo-float">
              <i className="fas fa-user-circle text-primary-600 text-2xl mr-2"></i>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Show Yourself</h1>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className={`font-medium transition-colors duration-200 ${
                location === '/' 
                  ? 'text-primary-600' 
                  : 'text-gray-600 hover:text-primary-600'
              }`}
              data-testid="nav-home"
            >
              Home
            </Link>
            <a 
              href="#profiles" 
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200"
              data-testid="nav-profiles"
            >
              Browse Profiles
            </a>
            <Link 
              href="/create-profile"
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                location === '/create-profile'
                  ? 'bg-primary-700 text-white'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
              data-testid="button-create-profile"
            >
              Create Profile
            </Link>
          </div>
          
          <div className="md:hidden">
            <button 
              className="text-gray-600 hover:text-primary-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-600 hover:text-primary-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="nav-home-mobile"
              >
                Home
              </Link>
              <a 
                href="#profiles" 
                className="text-gray-600 hover:text-primary-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="nav-profiles-mobile"
              >
                Browse Profiles
              </a>
              <Link 
                href="/create-profile"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 text-center"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="button-create-profile-mobile"
              >
                Create Profile
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
