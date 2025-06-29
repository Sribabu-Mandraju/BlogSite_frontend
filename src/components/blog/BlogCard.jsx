import React from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  Tag,
  ArrowRight,
  Clock,
  User,
} from "lucide-react";

const BlogCard = ({ blog }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatReadTime = (content) => {
    if (!content) return "2 min read";
    const wordsPerMinute = 200;
    const wordCount = content.split(" ").length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  // Get content for read time calculation
  const getContentForReadTime = () => {
    return blog.htmlFile?.fileContent || blog.shortNote || "";
  };

  return (
    <Link to={`/blog/${blog._id}`} className="group block slide-in">
      <article className="post-card floating-card h-full">
        {/* Header */}
        <div className="mb-4">
          {/* Category Badge */}
          {blog.category && (
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-primary-500/20 to-accent-500/20 text-primary-400 text-xs font-medium rounded-full border border-primary-500/30">
                <Tag size={12} />
                {blog.category}
              </span>
              <span className="text-xs text-dark-400 capitalize">
                {blog.visibility}
              </span>
            </div>
          )}

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-dark-100 leading-tight mb-3 group-hover:text-primary-400 transition-colors duration-300 line-clamp-2">
            {blog.title}
          </h3>

          {/* Short Note */}
          {blog.shortNote && (
            <p className="text-sm text-dark-300 leading-relaxed mb-4 line-clamp-3 italic">
              "{blog.shortNote}"
            </p>
          )}
        </div>

        {/* Content Preview */}
        <div className="mb-4">
          <p className="text-sm text-dark-200 leading-relaxed line-clamp-3">
            {blog.htmlFile?.fileContent?.substring(0, 150) ||
              blog.shortNote?.substring(0, 150) ||
              "No content available"}
            ...
          </p>
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-dark-700/80 to-dark-600/80 text-xs text-dark-300 rounded-md border border-dark-600/50"
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
            {blog.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-dark-700/80 to-dark-600/80 text-xs text-dark-400 rounded-md border border-dark-600/50">
                +{blog.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto">
          {/* Stats */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 text-xs text-dark-400">
              <div className="flex items-center gap-1">
                <Eye size={12} />
                <span>1</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart size={12} />
                <span>{blog.likes || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle size={12} />
                <span>{blog.comments?.length || 0}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-dark-400">
              <Clock size={12} />
              <span>{formatReadTime(getContentForReadTime())}</span>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                <User size={12} className="text-white" />
              </div>
              <span className="text-xs text-dark-300 font-medium">
                Anonymous
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-dark-400">
              <Calendar size={12} />
              <span>{formatDate(blog.createdAt)}</span>
            </div>
          </div>

          {/* Hover Arrow */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-lg">
              <ArrowRight size={16} className="text-white" />
            </div>
          </div>
        </div>

        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
      </article>
    </Link>
  );
};

export default BlogCard;
