import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Heart,
  MessageCircle,
  Eye as ViewIcon,
  Send,
  Save,
  X,
  Check,
  AlertTriangle,
  BarChart3,
  FileText,
  Globe,
  Clock,
  TrendingUp,
  Users,
  Zap,
  Settings,
  LogOut,
  ArrowLeft,
  MoreVertical,
  RefreshCw,
  Download,
  Upload,
  Shield,
  Crown,
  Activity,
  Target,
  Award,
  Star,
  BookOpen,
  PenTool,
  Archive,
  Unlock,
  Key,
  Tag,
} from "lucide-react";
import {
  getAllBlogs,
  deleteBlog,
  updateBlog,
  publishBlog,
  getBlogStats,
} from "../utils/api";
import { useToast } from "../context/ToastContext";

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [editingBlog, setEditingBlog] = useState(null);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [deletingBlog, setDeletingBlog] = useState(null);
  const [publishingBlog, setPublishingBlog] = useState(null);

  const navigate = useNavigate();
  const { success, error, warning } = useToast();

  // Admin password (in production, this should be handled server-side)
  const ADMIN_PASSWORD = "admin123";

  const categories = ["all", "technology", "programming", "design", "tutorial"];
  const statuses = ["all", "draft", "published", "private"];

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [blogsResponse, statsResponse] = await Promise.all([
        getAllBlogs(),
        getBlogStats(),
      ]);

      if (blogsResponse.success) {
        setBlogs(blogsResponse.data || []);
      }

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      error("Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      success("Welcome to Admin Panel!");
    } else {
      error("Invalid password. Please try again.");
      setPassword("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    setEditingBlog(null);
    success("Logged out successfully");
  };

  const handleDeleteBlog = async (blogId) => {
    if (
      !confirm(
        "Are you sure you want to delete this blog? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeletingBlog(blogId);
    try {
      const result = await deleteBlog(blogId);
      if (result.success) {
        setBlogs(blogs.filter((blog) => blog._id !== blogId));
        success("Blog deleted successfully");
      } else {
        error(result.message || "Failed to delete blog");
      }
    } catch (err) {
      console.error("Error deleting blog:", err);
      error("Failed to delete blog");
    } finally {
      setDeletingBlog(null);
    }
  };

  const handlePublishBlog = async (blogId) => {
    setPublishingBlog(blogId);
    try {
      const result = await publishBlog(blogId);
      if (result.success) {
        setBlogs(
          blogs.map((blog) =>
            blog._id === blogId
              ? {
                  ...blog,
                  isPublished: true,
                  visibility: "public",
                  publishedAt: new Date(),
                }
              : blog
          )
        );
        success("Blog published successfully");
      } else {
        error(result.message || "Failed to publish blog");
      }
    } catch (err) {
      console.error("Error publishing blog:", err);
      error("Failed to publish blog");
    } finally {
      setPublishingBlog(null);
    }
  };

  const handleUpdateBlog = async (blogId, updatedData) => {
    try {
      const result = await updateBlog(blogId, updatedData);
      if (result.success) {
        setBlogs(
          blogs.map((blog) =>
            blog._id === blogId ? { ...blog, ...updatedData } : blog
          )
        );
        setEditingBlog(null);
        success("Blog updated successfully");
      } else {
        error(result.message || "Failed to update blog");
      }
    } catch (err) {
      console.error("Error updating blog:", err);
      error("Failed to update blog");
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.shortNote?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || blog.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "published" && blog.isPublished) ||
      (selectedStatus === "draft" && !blog.isPublished) ||
      (selectedStatus === "private" && blog.visibility === "private");

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (blog) => {
    if (blog.isPublished) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30">
          <Globe size={10} />
          Published
        </span>
      );
    } else if (blog.visibility === "private") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full border border-yellow-500/30">
          <Lock size={10} />
          Private
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-500/20 text-gray-400 text-xs font-medium rounded-full border border-gray-500/30">
          <Clock size={10} />
          Draft
        </span>
      );
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="glass-card p-8 text-center space-y-6">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto">
                <Crown size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-dark-100 mb-2">
                  Admin Access
                </h1>
                <p className="text-dark-400">
                  Enter your password to access the admin panel
                </p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <Key size={20} className="text-dark-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full pl-12 pr-12 py-4 bg-dark-800/50 border border-dark-600/50 rounded-xl text-dark-100 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-dark-400 hover:text-dark-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg"
              >
                Access Admin Panel
              </button>
            </form>

            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 text-dark-400 hover:text-dark-200 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Admin Panel
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-dark-900/80 backdrop-blur-md border-b border-dark-600/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 text-dark-300 hover:text-dark-100 transition-colors group"
              >
                <ArrowLeft
                  size={20}
                  className="group-hover:-translate-x-1 transition-transform duration-200"
                />
                <span className="font-medium">Back to Home</span>
              </button>

              <div className="flex items-center gap-2">
                <Crown size={24} className="text-primary-400" />
                <h1 className="text-xl font-bold text-dark-100">Admin Panel</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full text-xs text-green-400 border border-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Admin Active
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-xl transition-all duration-200"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="mb-8">
          <div className="flex bg-dark-800/50 rounded-xl p-1 backdrop-blur-sm border border-dark-600/50">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "blogs", label: "Manage Blogs", icon: FileText },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg"
                    : "text-dark-400 hover:text-dark-300"
                }`}
              >
                <tab.icon size={16} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-dark-400 text-sm">Total Blogs</p>
                    <p className="text-2xl font-bold text-dark-100">
                      {blogs.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <FileText size={24} className="text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-dark-400 text-sm">Published</p>
                    <p className="text-2xl font-bold text-dark-100">
                      {blogs.filter((b) => b.isPublished).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <Globe size={24} className="text-green-400" />
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-dark-400 text-sm">Drafts</p>
                    <p className="text-2xl font-bold text-dark-100">
                      {blogs.filter((b) => !b.isPublished).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                    <Clock size={24} className="text-yellow-400" />
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-dark-400 text-sm">Total Likes</p>
                    <p className="text-2xl font-bold text-dark-100">
                      {blogs.reduce((sum, b) => sum + (b.likes || 0), 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                    <Heart size={24} className="text-red-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-dark-100 mb-4 flex items-center gap-2">
                <Activity size={20} className="text-primary-400" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {blogs.slice(0, 5).map((blog) => (
                  <div
                    key={blog._id}
                    className="flex items-center justify-between p-4 bg-dark-800/30 rounded-xl border border-dark-600/30"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                        <FileText size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-dark-100 font-medium">
                          {blog.title}
                        </p>
                        <p className="text-dark-400 text-sm">
                          {formatDate(blog.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(blog)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Blogs Management Tab */}
        {activeTab === "blogs" && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="glass-card p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search blogs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-dark-800/50 border border-dark-600/50 rounded-xl text-dark-100 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 bg-dark-800/50 border border-dark-600/50 rounded-xl text-dark-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all"
                        ? "All Categories"
                        : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-3 bg-dark-800/50 border border-dark-600/50 rounded-xl text-dark-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status === "all"
                        ? "All Status"
                        : status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>

                <button
                  onClick={fetchData}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 hover:text-primary-300 rounded-xl transition-all duration-200"
                >
                  <RefreshCw size={16} />
                  Refresh
                </button>
              </div>
            </div>

            {/* Blogs List */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-dark-100 flex items-center gap-2">
                  <FileText size={20} className="text-primary-400" />
                  Manage Blogs ({filteredBlogs.length})
                </h3>
                <button
                  onClick={() => navigate("/create")}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-medium rounded-xl transition-all duration-200"
                >
                  <Plus size={16} />
                  New Blog
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3 text-dark-400">
                    <RefreshCw size={20} className="animate-spin" />
                    <span>Loading blogs...</span>
                  </div>
                </div>
              ) : filteredBlogs.length === 0 ? (
                <div className="text-center py-12">
                  <FileText size={48} className="text-dark-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-dark-100 mb-2">
                    No blogs found
                  </h3>
                  <p className="text-dark-400">
                    Try adjusting your search criteria
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBlogs.map((blog) => (
                    <div
                      key={blog._id}
                      className="p-6 bg-dark-800/30 rounded-xl border border-dark-600/30 hover:border-primary-500/30 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h4 className="text-lg font-semibold text-dark-100">
                              {blog.title}
                            </h4>
                            {getStatusBadge(blog)}
                          </div>

                          {blog.shortNote && (
                            <p className="text-dark-300 mb-3 italic">
                              "{blog.shortNote}"
                            </p>
                          )}

                          <div className="flex items-center gap-6 text-sm text-dark-400">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              <span>{formatDate(blog.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart size={14} />
                              <span>{blog.likes || 0} likes</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle size={14} />
                              <span>{blog.comments?.length || 0} comments</span>
                            </div>
                            {blog.category && (
                              <div className="flex items-center gap-1">
                                <Tag size={14} />
                                <span className="capitalize">
                                  {blog.category}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => navigate(`/blog/${blog._id}`)}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-all duration-200"
                            title="View Blog"
                          >
                            <ViewIcon size={16} />
                          </button>

                          <button
                            onClick={() => setEditingBlog(blog)}
                            className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20 rounded-lg transition-all duration-200"
                            title="Edit Blog"
                          >
                            <Edit3 size={16} />
                          </button>

                          {!blog.isPublished && (
                            <button
                              onClick={() => handlePublishBlog(blog._id)}
                              disabled={publishingBlog === blog._id}
                              className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/20 rounded-lg transition-all duration-200 disabled:opacity-50"
                              title="Publish Blog"
                            >
                              {publishingBlog === blog._id ? (
                                <RefreshCw size={16} className="animate-spin" />
                              ) : (
                                <Send size={16} />
                              )}
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteBlog(blog._id)}
                            disabled={deletingBlog === blog._id}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200 disabled:opacity-50"
                            title="Delete Blog"
                          >
                            {deletingBlog === blog._id ? (
                              <RefreshCw size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-dark-100 mb-4 flex items-center gap-2">
                <Settings size={20} className="text-primary-400" />
                Admin Settings
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-dark-800/30 rounded-xl border border-dark-600/30">
                  <h4 className="text-dark-100 font-medium mb-2">
                    System Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-dark-400">
                    <div>
                      <p>Total Blogs: {blogs.length}</p>
                      <p>
                        Published: {blogs.filter((b) => b.isPublished).length}
                      </p>
                      <p>
                        Drafts: {blogs.filter((b) => !b.isPublished).length}
                      </p>
                    </div>
                    <div>
                      <p>
                        Total Likes:{" "}
                        {blogs.reduce((sum, b) => sum + (b.likes || 0), 0)}
                      </p>
                      <p>
                        Total Comments:{" "}
                        {blogs.reduce(
                          (sum, b) => sum + (b.comments?.length || 0),
                          0
                        )}
                      </p>
                      <p>
                        Categories:{" "}
                        {
                          new Set(blogs.map((b) => b.category).filter(Boolean))
                            .size
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-dark-800/30 rounded-xl border border-dark-600/30">
                  <h4 className="text-dark-100 font-medium mb-2">
                    Quick Actions
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => navigate("/create")}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 hover:text-primary-300 rounded-lg transition-all duration-200"
                    >
                      <Plus size={16} />
                      Create New Blog
                    </button>
                    <button
                      onClick={fetchData}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 rounded-lg transition-all duration-200"
                    >
                      <RefreshCw size={16} />
                      Refresh Data
                    </button>
                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-lg transition-all duration-200"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Blog Modal */}
      {editingBlog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-dark-100 flex items-center gap-2">
                <Edit3 size={20} className="text-primary-400" />
                Edit Blog
              </h3>
              <button
                onClick={() => setEditingBlog(null)}
                className="p-2 text-dark-400 hover:text-dark-200 hover:bg-dark-700/50 rounded-lg transition-all duration-200"
              >
                <X size={20} />
              </button>
            </div>

            <EditBlogForm
              blog={editingBlog}
              onSave={handleUpdateBlog}
              onCancel={() => setEditingBlog(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Edit Blog Form Component
const EditBlogForm = ({ blog, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: blog.title,
    shortNote: blog.shortNote || "",
    footerQuote: blog.footerQuote || "",
    category: blog.category || "",
    visibility: blog.visibility,
    htmlContent: blog.htmlContent || "",
    tags: blog.tags ? blog.tags.join(", ") : "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    };
    onSave(blog._id, updatedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-dark-300 mb-2">
          Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-3 bg-dark-800/50 border border-dark-600/50 rounded-xl text-dark-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-300 mb-2">
          Short Note
        </label>
        <textarea
          value={formData.shortNote}
          onChange={(e) =>
            setFormData({ ...formData, shortNote: e.target.value })
          }
          rows={3}
          className="w-full px-4 py-3 bg-dark-800/50 border border-dark-600/50 rounded-xl text-dark-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-300 mb-2">
          HTML Content
        </label>
        <textarea
          value={formData.htmlContent}
          onChange={(e) =>
            setFormData({ ...formData, htmlContent: e.target.value })
          }
          rows={8}
          placeholder="Enter your HTML content here..."
          className="w-full px-4 py-3 bg-dark-800/50 border border-dark-600/50 rounded-xl text-dark-100 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 resize-none font-mono text-sm"
        />
        <p className="mt-1 text-xs text-dark-500">
          Enter the HTML content for your blog post
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-300 mb-2">
          Footer Quote
        </label>
        <textarea
          value={formData.footerQuote}
          onChange={(e) =>
            setFormData({ ...formData, footerQuote: e.target.value })
          }
          rows={2}
          className="w-full px-4 py-3 bg-dark-800/50 border border-dark-600/50 rounded-xl text-dark-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full px-4 py-3 bg-dark-800/50 border border-dark-600/50 rounded-xl text-dark-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
          >
            <option value="">Select Category</option>
            <option value="technology">Technology</option>
            <option value="programming">Programming</option>
            <option value="design">Design</option>
            <option value="tutorial">Tutorial</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            Visibility
          </label>
          <select
            value={formData.visibility}
            onChange={(e) =>
              setFormData({ ...formData, visibility: e.target.value })
            }
            className="w-full px-4 py-3 bg-dark-800/50 border border-dark-600/50 rounded-xl text-dark-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
          >
            <option value="draft">Draft</option>
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-300 mb-2">
          Tags
        </label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="react, javascript, tutorial"
          className="w-full px-4 py-3 bg-dark-800/50 border border-dark-600/50 rounded-xl text-dark-100 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
        />
        <p className="mt-1 text-xs text-dark-500">Separate tags with commas</p>
      </div>

      <div className="flex items-center gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-medium rounded-xl transition-all duration-200"
        >
          <Save size={16} />
          Save Changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-dark-700/50 hover:bg-dark-700 text-dark-300 hover:text-dark-100 font-medium rounded-xl transition-all duration-200"
        >
          <X size={16} />
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AdminPanel;
