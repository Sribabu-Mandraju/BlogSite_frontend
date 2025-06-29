import React from "react";
import { Menu, X, Plus, Crown } from "lucide-react";
import { Link } from "react-router-dom";

const Header = ({ onToggleSidebar, isSidebarOpen }) => {
  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-dark-900/95 via-dark-800/95 to-dark-900/95 backdrop-blur-xl border-b border-dark-600/30 shadow-2xl">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary-500/20 to-accent-500/20 hover:from-primary-500/30 hover:to-accent-500/30 border border-primary-500/30 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group"
          >
            {isSidebarOpen ? (
              <X
                size={20}
                className="text-primary-400 group-hover:text-primary-300 transition-colors"
              />
            ) : (
              <Menu
                size={20}
                className="text-primary-400 group-hover:text-primary-300 transition-colors"
              />
            )}
          </button>

          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold gradient-text">
              BlogHub
            </h1>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin Button */}
          <Link
            to="/admin"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-medium text-sm sm:text-base"
            title="Admin Panel"
          >
            <Crown size={16} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Admin</span>
          </Link>

          {/* Create Post Button */}
          <Link
            to="/create"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-medium text-sm sm:text-base"
          >
            <Plus size={16} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Create Post</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
