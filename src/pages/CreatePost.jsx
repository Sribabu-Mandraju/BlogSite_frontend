"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  Save,
  Send,
  Tag,
  FileText,
  Quote,
  Edit3,
  Loader2,
  Hash,
  Globe,
  Lock,
  FileEdit,
  Sparkles,
  BookOpen,
  Calendar,
  User,
} from "lucide-react";
import { createBlog } from "../utils/api";
import { useToast } from "../context/ToastContext";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [shortNote, setShortNote] = useState("");
  const [footerQuote, setFooterQuote] = useState("");
  const [tags, setTags] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [visibility, setVisibility] = useState("draft");
  const [category, setCategory] = useState("");
  const [activeTab, setActiveTab] = useState("content");
  const [wordCount, setWordCount] = useState(0);

  const navigate = useNavigate();
  const { success, error, warning } = useToast();

  useEffect(() => {
    const text = htmlContent.replace(/<[^>]*>/g, "");
    setWordCount(text.split(/\s+/).filter((word) => word.length > 0).length);
  }, [htmlContent]);

  const getTagsArray = () => {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  };

  const validateFormData = (data) => {
    const errors = [];

    if (!data.title || data.title.trim().length === 0) {
      errors.push("Title is required");
    }

    if (!data.htmlContent || data.htmlContent.trim().length === 0) {
      errors.push("Content is required");
    }

    if (data.title && data.title.length > 200) {
      errors.push("Title must be less than 200 characters");
    }

    if (data.shortNote && data.shortNote.length > 500) {
      errors.push("Short note must be less than 500 characters");
    }

    if (data.footerQuote && data.footerQuote.length > 500) {
      errors.push("Footer quote must be less than 500 characters");
    }

    return errors;
  };

  const handleSave = async () => {
    const draftData = {
      title: title.trim(),
      shortNote: shortNote.trim(),
      htmlContent: htmlContent,
      footerQuote: footerQuote.trim(),
      tags: getTagsArray(),
      visibility: "draft",
      category: category || "",
    };

    // Validate data before sending
    const validationErrors = validateFormData(draftData);
    if (validationErrors.length > 0) {
      error(validationErrors[0]);
      return;
    }

    setIsSaving(true);
    try {
      console.log("Sending draft data:", draftData);
      const result = await createBlog(draftData);

      if (result.success) {
        success(
          "Draft saved successfully! You can continue editing or publish later."
        );
        // Optionally redirect to the saved draft
        // navigate(`/blog/${result.data._id}`)
      } else {
        error(result.message || "Failed to save draft");
      }
    } catch (err) {
      console.error("Error saving draft:", err);
      // Provide more specific error messages
      if (err.message.includes("Title and HTML content are required")) {
        error("Please provide both a title and content for your draft");
      } else if (err.message.includes("Title")) {
        error("Please provide a valid title for your draft");
      } else if (err.message.includes("HTML content")) {
        error("Please add some content to your draft");
      } else {
        error(err.message || "Failed to save draft. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    const blogData = {
      title: title.trim(),
      shortNote: shortNote.trim(),
      htmlContent: htmlContent,
      footerQuote: footerQuote.trim(),
      tags: getTagsArray(),
      visibility: "public",
      category: category || "",
    };

    // Validate data before sending
    const validationErrors = validateFormData(blogData);
    if (validationErrors.length > 0) {
      error(validationErrors[0]);
      return;
    }

    if (!category) {
      warning("Consider adding a category to help readers find your post");
    }

    setIsPublishing(true);
    try {
      console.log("Sending publish data:", blogData);
      const result = await createBlog(blogData);

      if (result.success) {
        success("Blog published successfully! Redirecting to your post...");
        // Redirect to the published blog post
        setTimeout(() => {
          navigate(`/blog/${result.data._id}`);
        }, 1500);
      } else {
        error(result.message || "Failed to publish blog");
      }
    } catch (err) {
      console.error("Error publishing blog:", err);
      // Provide more specific error messages
      if (err.message.includes("Title and HTML content are required")) {
        error("Please provide both a title and content for your blog post");
      } else if (err.message.includes("Title")) {
        error("Please provide a valid title for your blog post");
      } else if (err.message.includes("HTML content")) {
        error("Please add some content to your blog post");
      } else {
        error(err.message || "Failed to publish blog. Please try again.");
      }
    } finally {
      setIsPublishing(false);
    }
  };

  const cleanHtml = (html) => {
    return html
      .replace(/<style[^>]*>.*?<\/style>/gis, "")
      .replace(/<body[^>]*>|<\/body>/gi, "");
  };

  const renderPreview = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Preview Header */}
          <div className="mb-8 p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div>
                <p className="text-gray-300 text-sm">Preview Mode</p>
                <p className="text-gray-500 text-xs flex items-center gap-2">
                  <Calendar size={12} />
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            {category && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm mb-4">
                <BookOpen size={14} />
                {category}
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6 leading-tight">
            {title || "Untitled Post"}
          </h1>

          {/* Short Note */}
          {shortNote && (
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-l-4 border-blue-500 rounded-r-2xl backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <Quote size={20} className="text-blue-400 mt-1 flex-shrink-0" />
                <p className="text-gray-300 italic text-lg leading-relaxed">
                  "{shortNote}"
                </p>
              </div>
            </div>
          )}

          {/* HTML Content */}
          <div className="mb-8">
            <div
              className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-gray-300 prose-a:text-blue-400 prose-strong:text-white prose-code:text-pink-400 prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700"
              dangerouslySetInnerHTML={{ __html: cleanHtml(htmlContent) }}
            />
          </div>

          {/* Footer Quote */}
          {footerQuote && (
            <div className="mb-8 p-6 bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-2xl backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <Sparkles
                  size={20}
                  className="text-yellow-400 mt-1 flex-shrink-0"
                />
                <blockquote className="text-gray-300 italic text-lg leading-relaxed">
                  "{footerQuote}"
                </blockquote>
              </div>
            </div>
          )}

          {/* Tags */}
          {tags && (
            <div className="flex flex-wrap gap-2">
              {getTagsArray().map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm border border-gray-600/50 backdrop-blur-sm"
                >
                  <Hash size={12} />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderEditor = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Mobile Tabs */}
          <div className="md:hidden mb-6">
            <div className="flex bg-gray-800/50 rounded-xl p-1 backdrop-blur-sm border border-gray-700/50">
              {[
                { id: "content", label: "Content", icon: FileEdit },
                { id: "settings", label: "Settings", icon: Tag },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  <tab.icon size={16} />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Content */}
            <div
              className={`md:col-span-2 space-y-6 ${
                activeTab !== "content" ? "hidden md:block" : ""
              }`}
            >
              {/* Title */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <FileText size={16} />
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your blog post title..."
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg font-medium"
                />
              </div>

              {/* Short Note */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <Quote size={16} />
                  Short Note
                </label>
                <textarea
                  value={shortNote}
                  onChange={(e) => setShortNote(e.target.value)}
                  placeholder="A brief description or excerpt of your post..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>

              {/* HTML Content */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                    <FileEdit size={16} />
                    Content *
                  </label>
                  <div className="text-xs text-gray-400 flex items-center gap-2">
                    <BookOpen size={12} />
                    {wordCount} words
                  </div>
                </div>
                <textarea
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  placeholder="Paste your HTML content here or start writing..."
                  rows={16}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono text-sm resize-none"
                />
                <p className="mt-3 text-xs text-gray-500">
                  You can paste HTML content directly or write in plain text.
                  The content will be rendered in the preview.
                </p>
              </div>

              {/* Footer Quote */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <Sparkles size={16} />
                  Footer Quote
                </label>
                <textarea
                  value={footerQuote}
                  onChange={(e) => setFooterQuote(e.target.value)}
                  placeholder="An inspiring quote to end your post..."
                  rows={2}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>
            </div>

            {/* Sidebar */}
            <div
              className={`space-y-6 ${
                activeTab !== "settings" ? "hidden md:block" : ""
              }`}
            >
              {/* Quick Actions */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                  <Sparkles size={16} />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setIsPreview(!isPreview)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl transition-all duration-200 group"
                  >
                    {isPreview ? <Edit3 size={16} /> : <Eye size={16} />}
                    <span>{isPreview ? "Edit Mode" : "Preview"}</span>
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 hover:text-yellow-300 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    <span>{isSaving ? "Saving..." : "Save Draft"}</span>
                  </button>

                  <button
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {isPublishing ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                    <span>{isPublishing ? "Publishing..." : "Publish"}</span>
                  </button>
                </div>
              </div>

              {/* Post Settings */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                  <Tag size={16} />
                  Post Settings
                </h3>
                <div className="space-y-4">
                  {/* Category */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                    >
                      <option value="">Select Category</option>
                      <option value="technology">Technology</option>
                      <option value="programming">Programming</option>
                      <option value="design">Design</option>
                      <option value="tutorial">Tutorial</option>
                    </select>
                  </div>

                  {/* Visibility */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">
                      Visibility
                    </label>
                    <div className="space-y-2">
                      {[
                        {
                          value: "draft",
                          label: "Draft",
                          icon: FileEdit,
                          desc: "Only you can see this",
                        },
                        {
                          value: "private",
                          label: "Private",
                          icon: Lock,
                          desc: "Only invited people",
                        },
                        {
                          value: "public",
                          label: "Public",
                          icon: Globe,
                          desc: "Anyone can see this",
                        },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                            visibility === option.value
                              ? "bg-blue-600/20 border border-blue-500/50"
                              : "bg-gray-700/30 hover:bg-gray-700/50 border border-transparent"
                          }`}
                        >
                          <input
                            type="radio"
                            name="visibility"
                            value={option.value}
                            checked={visibility === option.value}
                            onChange={(e) => setVisibility(e.target.value)}
                            className="sr-only"
                          />
                          <option.icon
                            size={16}
                            className={
                              visibility === option.value
                                ? "text-blue-400"
                                : "text-gray-400"
                            }
                          />
                          <div className="flex-1">
                            <div
                              className={`text-sm font-medium ${
                                visibility === option.value
                                  ? "text-blue-400"
                                  : "text-gray-300"
                              }`}
                            >
                              {option.label}
                            </div>
                            <div className="text-xs text-gray-500">
                              {option.desc}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="react, javascript, tutorial"
                      className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Separate tags with commas
                    </p>
                    {tags && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {getTagsArray()
                          .slice(0, 3)
                          .map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-700/50 text-gray-300 rounded text-xs"
                            >
                              <Hash size={10} />
                              {tag}
                            </span>
                          ))}
                        {getTagsArray().length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{getTagsArray().length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-sm font-semibold text-gray-300 mb-4">
                  Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Words</span>
                    <span className="text-sm text-white font-medium">
                      {wordCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Characters</span>
                    <span className="text-sm text-white font-medium">
                      {htmlContent.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Tags</span>
                    <span className="text-sm text-white font-medium">
                      {getTagsArray().length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
            >
              <ArrowLeft
                size={20}
                className="group-hover:-translate-x-1 transition-transform duration-200"
              />
              <span className="font-medium">Back to Home</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-gray-800/50 rounded-full text-xs text-gray-400">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isSaving || isPublishing
                      ? "bg-yellow-400 animate-pulse"
                      : "bg-green-400"
                  }`}
                ></div>
                {isSaving
                  ? "Saving..."
                  : isPublishing
                  ? "Publishing..."
                  : "Ready"}
              </div>

              <button
                onClick={() => setIsPreview(!isPreview)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  isPreview
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {isPreview ? <Edit3 size={16} /> : <Eye size={16} />}
                <span className="hidden sm:inline">
                  {isPreview ? "Edit" : "Preview"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {isPreview ? renderPreview() : renderEditor()}
    </div>
  );
};

export default CreatePost;
