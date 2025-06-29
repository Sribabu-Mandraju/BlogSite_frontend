import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  TrendingUp,
  Clock,
  Star,
  ArrowRight,
  Sparkles,
  BookOpen,
  Eye,
  Zap,
  Heart,
  Coffee,
  PenTool,
} from "lucide-react";
import BlogList from "../components/blog/BlogList";
import { getAllBlogs } from "../utils/api";
import { useToast } from "../context/ToastContext";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const { error } = useToast();

  const categories = ["all", "technology", "programming", "design", "tutorial"];

  const sortOptions = [
    { value: "latest", label: "Latest", icon: Clock },
    { value: "trending", label: "Most Liked", icon: Heart },
    { value: "popular", label: "Most Read", icon: Eye },
  ];

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await getAllBlogs();
      setBlogs(response.data || []);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedBlogs = blogs
    .filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.shortNote?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.htmlFile?.fileContent
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        blog.tags?.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "all" || blog.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "trending":
          return (b.likes || 0) - (a.likes || 0);
        case "popular":
          return (b.comments?.length || 0) - (a.comments?.length || 0);
        default:
          return 0;
      }
    });

  const stats = {
    totalPosts: blogs.length,
    totalViews: blogs.length, // Since views field doesn't exist in schema
    totalLikes: blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0),
  };

  return (
    <div className="min-h-screen space-y-8">
      {/* Hero Section */}

      {/* Stats Section */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="glass-card p-6 text-center group hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <PenTool size={24} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-dark-100 mb-2">
              {stats.totalPosts}
            </h3>
            <p className="text-dark-400">Stories Shared</p>
          </div>

          <div className="glass-card p-6 text-center group hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-accent-500 to-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Eye size={24} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-dark-100 mb-2">
              {stats.totalViews.toLocaleString()}
            </h3>
            <p className="text-dark-400">Times Read</p>
          </div>

          <div className="glass-card p-6 text-center group hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Heart size={24} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-dark-100 mb-2">
              {stats.totalLikes}
            </h3>
            <p className="text-dark-400">Hearts Received</p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-6 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search through my thoughts and experiences..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 lg:py-5 bg-gradient-to-r from-dark-800/80 to-dark-700/80 border border-dark-600/50 rounded-2xl text-dark-100 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-300 backdrop-blur-sm shadow-lg input-glow"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Category Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-dark-300 mb-2">
                What interests you?
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg"
                        : "bg-gradient-to-r from-dark-700/80 to-dark-600/80 text-dark-300 hover:text-dark-100 border border-dark-600/50"
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="sm:w-48">
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Sort by
              </label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 lg:py-4 bg-gradient-to-r from-dark-800/80 to-dark-700/80 border border-dark-600/50 rounded-xl text-dark-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-300 backdrop-blur-sm shadow-lg appearance-none"
                >
                  {sortOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    );
                  })}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <Filter size={16} className="text-dark-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-dark-100 mb-2">
            {searchTerm || selectedCategory !== "all"
              ? `Found ${filteredAndSortedBlogs.length} posts for you`
              : "Recent Writings"}
          </h2>
          <p className="text-dark-400">
            {searchTerm || selectedCategory !== "all"
              ? `Here's what I've written that matches your search`
              : "The latest thoughts and experiences I've shared"}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-3 text-dark-300">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-lg">Loading my thoughts...</span>
            </div>
          </div>
        ) : filteredAndSortedBlogs.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <BookOpen size={48} className="text-dark-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-dark-100 mb-2">
              {searchTerm || selectedCategory !== "all"
                ? "Nothing found yet"
                : "My first post is waiting to be written"}
            </h3>
            <p className="text-dark-400 mb-6">
              {searchTerm || selectedCategory !== "all"
                ? "Try a different search or browse all my posts"
                : "Ready to share your first thought with the world?"}
            </p>
            <Link
              to="/create"
              className="btn-primary btn-glow btn-3d inline-flex items-center gap-2"
            >
              <PenTool size={20} />
              <span>Start Writing</span>
            </Link>
          </div>
        ) : (
          <BlogList blogs={filteredAndSortedBlogs} />
        )}
      </section>
    </div>
  );
};

export default Home;
