import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import BlogDetail from "./pages/BlogDetail";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import AdminPanel from "./pages/AdminPanel";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <ToastProvider>
      <Router>
        <div className="layout-container">
          <Header
            onToggleSidebar={handleSidebarToggle}
            isSidebarOpen={sidebarOpen}
          />
          <div className="flex h-[calc(100vh-80px)]">
            <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
            <main className="main-content flex-1 overflow-y-auto">
              <div className="responsive-padding">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/create" element={<CreatePost />} />
                  <Route path="/blog/:id" element={<BlogDetail />} />
                  <Route path="/admin" element={<AdminPanel />} />
                  {/* <Route path="?" */}
                </Routes>
              </div>
            </main>
          </div>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
