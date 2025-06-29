import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Calendar,
  Tag,
  Eye,
  Send,
  Loader2,
} from "lucide-react";
import { getBlogById, addLike, removeLike, addComment } from "../utils/api";
import { useToast } from "../context/ToastContext";
import ShareModal from "../components/ui/ShareModal";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [htmlLoading, setHtmlLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [userName, setUserName] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setHtmlLoading(true);
      const result = await getBlogById(id);
      setBlog(result.data);
      setLikesCount(result.data.likes || 0);

      // Debug: Log the entire blog data structure
      console.log("Full blog data:", result.data);
      console.log("Available fields:", Object.keys(result.data));

      // Handle HTML content from different possible sources
      let content = "";

      // First, try to get content from fileContent field
      if (result.data.fileContent) {
        content = result.data.fileContent;
        console.log(
          "✅ Using fileContent field:",
          content.substring(0, 100) + "..."
        );
      }
      // If no fileContent, try htmlContent field
      else if (result.data.htmlContent) {
        content = result.data.htmlContent;
        console.log(
          "✅ Using htmlContent field:",
          content.substring(0, 100) + "..."
        );
      }
      // If no htmlContent, try htmlFile.fileContent
      else if (result.data.htmlFile?.fileContent) {
        content = result.data.htmlFile.fileContent;
        console.log(
          "✅ Using htmlFile.fileContent field:",
          content.substring(0, 100) + "..."
        );
      }
      // If no fileContent in htmlFile, try to fetch from URL
      else if (result.data.htmlFile?.url) {
        try {
          content = await fetchHtmlFromUrl(result.data.htmlFile.url);
          console.log(
            "✅ Fetched from URL:",
            content.substring(0, 100) + "..."
          );
        } catch (err) {
          console.error("❌ Failed to fetch from URL:", err);
          content = `
            <div class="text-center py-8">
              <p class="text-red-400 mb-4">Failed to load blog content from URL.</p>
              <p class="text-dark-400 text-sm mb-4">Error: ${err.message}</p>
              <p class="text-dark-400 text-sm">Please try refreshing the page or contact support if the issue persists.</p>
            </div>
          `;
        }
      }
      // If no content found anywhere, show a message
      else {
        console.warn("⚠️ No content found in any field");
        content = `
          <div class="text-center py-8">
            <p class="text-yellow-400 mb-4">No content found for this blog post.</p>
            <p class="text-dark-400 text-sm">The blog post exists but has no content to display.</p>
            <div class="mt-4 p-4 bg-dark-800 rounded-lg text-left">
              <p class="text-xs text-dark-400 mb-2">Debug Info:</p>
              <p class="text-xs text-dark-400">fileContent: ${
                result.data.fileContent ? "Present" : "Missing"
              }</p>
              <p class="text-xs text-dark-400">htmlContent: ${
                result.data.htmlContent ? "Present" : "Missing"
              }</p>
              <p class="text-xs text-dark-400">htmlFile.fileContent: ${
                result.data.htmlFile?.fileContent ? "Present" : "Missing"
              }</p>
              <p class="text-xs text-dark-400">htmlFile.url: ${
                result.data.htmlFile?.url ? "Present" : "Missing"
              }</p>
            </div>
          </div>
        `;
      }

      // Debug: Log the final content length
      console.log("📏 Final content length:", content.length);
      console.log("📄 Content preview:", content.substring(0, 200) + "...");

      setHtmlContent(content);
    } catch (err) {
      console.error("❌ Error fetching blog:", err);
      error("Failed to fetch blog post");
      setHtmlContent(`
        <div class="text-center py-8">
          <p class="text-red-400 mb-4">Failed to load blog post.</p>
          <p class="text-dark-400 text-sm mb-4">Error: ${err.message}</p>
          <p class="text-dark-400 text-sm">Please try refreshing the page or contact support if the issue persists.</p>
        </div>
      `);
    } finally {
      setLoading(false);
      setHtmlLoading(false);
    }
  };

  const fetchHtmlFromUrl = async (url) => {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    console.log("Fetched HTML content length:", html.length);

    // If the content is very short, it might be an error page
    if (html.length < 100) {
      console.warn("Fetched content seems too short, might be an error page");
    }

    return html;
  };

  const handleLike = async () => {
    try {
      if (isLiked) {
        await removeLike(blog._id, userName || "Anonymous User");
        setLikesCount((prev) => prev - 1);
        setIsLiked(false);
      } else {
        await addLike(blog._id, userName || "Anonymous User");
        setLikesCount((prev) => prev + 1);
        setIsLiked(true);
      }
    } catch (err) {
      error("Failed to update like");
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !userName.trim()) {
      error("Please provide both name and comment");
      return;
    }

    setIsSubmittingComment(true);
    try {
      await addComment(blog._id, {
        commentBy: userName,
        comment: commentText,
      });
      success("Comment added successfully");
      setCommentText("");
      fetchBlog(); // Refresh to get updated comments
    } catch (err) {
      error("Failed to add comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
        <div className="flex items-center gap-2 sm:gap-3 text-dark-300">
          <Loader2 size={20} className="sm:w-6 sm:h-6 animate-spin" />
          <span className="text-sm sm:text-base">Loading blog post...</span>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-8 sm:py-12">
        <h2 className="text-xl sm:text-2xl font-bold text-dark-100 mb-3 sm:mb-4">
          Blog post not found
        </h2>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 sm:gap-2 text-primary-400 hover:text-primary-300 transition-colors text-sm sm:text-base touch-manipulation"
        >
          <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 sm:gap-2 text-dark-300 hover:text-primary-400 transition-colors mb-4 sm:mb-6 text-sm sm:text-base touch-manipulation"
        >
          <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
          <span>Back to all posts</span>
        </Link>

        <div className="space-y-3 sm:space-y-4">
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-dark-400">
            <div className="flex items-center gap-1">
              <Calendar size={12} className="sm:w-3.5 sm:h-3.5" />
              <span>{formatDate(blog.createdAt)}</span>
            </div>
            {blog.category && (
              <div className="flex items-center gap-1">
                <span className="text-dark-600">•</span>
                <span className="text-primary-400 capitalize">
                  {blog.category}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <span className="text-dark-600">•</span>
              <span className="capitalize">{blog.visibility}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark-100 leading-tight">
            {blog.title}
          </h1>

          {/* Short Note */}
          {blog.shortNote && (
            <div className="p-3 sm:p-4 bg-dark-800/50 border-l-4 border-primary-500 rounded-r-lg">
              <p className="text-sm sm:text-base text-dark-200 italic leading-relaxed">
                "{blog.shortNote}"
              </p>
            </div>
          )}

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-dark-700 text-xs sm:text-sm text-dark-300 rounded-md"
                >
                  <Tag size={10} className="sm:w-3 sm:h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mb-6 sm:mb-8">
        {htmlLoading ? (
          <div className="flex items-center justify-center min-h-[200px] sm:min-h-[300px]">
            <div className="flex items-center gap-2 sm:gap-3 text-dark-300">
              <Loader2 size={18} className="sm:w-5 sm:h-5 animate-spin" />
              <span className="text-sm sm:text-base">Loading content...</span>
            </div>
          </div>
        ) : (
          <div
            className="html-content"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        )}
      </div>

      {/* Footer Quote */}
      {blog.footerQuote && (
        <div className="mb-6 sm:mb-8 p-3 sm:p-4 lg:p-6 bg-gradient-to-r from-dark-800 to-dark-700 border border-dark-600 rounded-lg">
          <blockquote className="text-sm sm:text-base lg:text-lg text-dark-200 italic leading-relaxed">
            "{blog.footerQuote}"
          </blockquote>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 bg-dark-800 rounded-xl border border-dark-700 mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg transition-colors touch-manipulation ${
              isLiked
                ? "bg-red-500/20 text-red-400"
                : "text-dark-400 hover:text-dark-300 hover:bg-dark-700"
            }`}
          >
            <Heart
              size={16}
              className={`sm:w-5 sm:h-5 ${isLiked ? "fill-current" : ""}`}
            />
            <span className="text-sm sm:text-base">{likesCount} likes</span>
          </button>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-dark-400 hover:text-dark-300 hover:bg-dark-700 rounded-lg transition-colors touch-manipulation"
          >
            <Share2 size={16} className="sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Share</span>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-dark-400">
          <div className="flex items-center gap-1">
            <Eye size={12} className="sm:w-3.5 sm:h-3.5" />
            <span>{blog.views || 0} views</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle size={12} className="sm:w-3.5 sm:h-3.5" />
            <span>{blog.comments ? blog.comments.length : 0} comments</span>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="space-y-4 sm:space-y-6">
        <h3 className="text-lg sm:text-xl font-semibold text-dark-100">
          Comments ({blog.comments ? blog.comments.length : 0})
        </h3>

        {/* Comment Form */}
        <form onSubmit={handleComment} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-dark-800 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
              required
            />
            <button
              type="submit"
              disabled={isSubmittingComment}
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all duration-200 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            >
              {isSubmittingComment ? (
                <Loader2 size={16} className="sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <Send size={16} className="sm:w-5 sm:h-5" />
              )}
              <span>{isSubmittingComment ? "Posting..." : "Post Comment"}</span>
            </button>
          </div>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write your comment..."
            rows={3}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-dark-800 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base resize-vertical"
            required
          />
        </form>

        {/* Comments List */}
        <div className="space-y-3 sm:space-y-4">
          {blog.comments && blog.comments.length > 0 ? (
            blog.comments.map((comment, index) => (
              <div
                key={index}
                className="p-3 sm:p-4 bg-dark-800 rounded-lg border border-dark-700"
              >
                <div className="flex items-start justify-between gap-3 sm:gap-4 mb-2">
                  <h4 className="text-sm sm:text-base font-semibold text-dark-100">
                    {comment.commentBy}
                  </h4>
                  <span className="text-xs sm:text-sm text-dark-400">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-dark-200 leading-relaxed">
                  {comment.comment}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-6 sm:py-8">
              <p className="text-sm sm:text-base text-dark-400">
                No comments yet. Be the first to comment!
              </p>
            </div>
          )}
        </div>
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        blogData={blog}
      />
    </div>
  );
};

export default BlogDetail;
