import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, FileText, Plus, User, Settings, X, Crown } from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    {
      path: "/",
      icon: Home,
      label: "Home",
      description: "Discover latest posts",
    },
    {
      path: "/create",
      icon: Plus,
      label: "Create Post",
      description: "Share your thoughts",
    },
    {
      path: "/blog",
      icon: FileText,
      label: "All Posts",
      description: "Browse all content",
    },
  ];

  const bottomMenuItems = [
    // {
    //   path: "/profile",
    //   icon: User,
    //   label: "Profile",
    //   description: "Your account",
    // },
    // {
    //   path: "/settings",
    //   icon: Settings,
    //   label: "Settings",
    //   description: "App preferences",
    // },
    {
      path: "/admin",
      icon: Crown,
      label: "Admin Panel",
      description: "Manage your blog",
    },
  ];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={`sidebar-container ${
          isOpen ? "sidebar-visible" : "sidebar-hidden"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-600/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <div>
              <h2 className="text-xl font-bold gradient-text">BlogHub</h2>
              <p className="text-xs text-dark-400">Your creative space</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden flex items-center justify-center w-8 h-8 bg-gradient-to-r from-dark-700/80 to-dark-600/80 hover:from-dark-600/80 hover:to-dark-500/80 border border-dark-600/50 rounded-lg transition-all duration-300 hover:scale-105 group"
          >
            <X
              size={16}
              className="text-dark-300 group-hover:text-dark-200 transition-colors"
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3 px-2">
              Navigation
            </h3>
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`sidebar-link group ${active ? "active" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          active
                            ? "bg-gradient-to-r from-primary-500/20 to-accent-500/20"
                            : "bg-dark-800/50 group-hover:bg-dark-700/50"
                        }`}
                      >
                        <Icon className="sidebar-icon" />
                      </div>
                      <div className="flex-1">
                        <span className="font-medium">{item.label}</span>
                        <p className="text-xs text-dark-400 group-hover:text-dark-300 transition-colors">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Bottom Menu */}
          <div className="pt-6 border-t border-dark-600/30">
            <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3 px-2">
              Account
            </h3>
            <div className="space-y-1">
              {bottomMenuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`sidebar-link group ${active ? "active" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          active
                            ? "bg-gradient-to-r from-primary-500/20 to-accent-500/20"
                            : "bg-dark-800/50 group-hover:bg-dark-700/50"
                        }`}
                      >
                        <Icon className="sidebar-icon" />
                      </div>
                      <div className="flex-1">
                        <span className="font-medium">{item.label}</span>
                        <p className="text-xs text-dark-400 group-hover:text-dark-300 transition-colors">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Footer */}
        {/* <div className="p-4 border-t border-dark-600/30">
          <div className="bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-primary-400 mb-2">
              Pro Features
            </h4>
            <p className="text-xs text-dark-400 mb-3">
              Unlock advanced analytics, custom themes, and more.
            </p>
            <button className="w-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
              Upgrade Now
            </button>
          </div>
        </div> */}
      </aside>
    </>
  );
};

export default Sidebar;
