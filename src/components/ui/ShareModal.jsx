import { useState } from "react";
import {
  X,
  Copy,
  Twitter,
  Linkedin,
  Facebook,
  Link as LinkIcon,
  Check,
} from "lucide-react";

const ShareModal = ({ isOpen, onClose, blogData }) => {
  const [copied, setCopied] = useState(false);
  const [userName, setUserName] = useState("");

  if (!isOpen) return null;

  const blogUrl = `${window.location.origin}/blog/${blogData?._id}`;
  const shareText = `${blogData?.title} - Check out this amazing blog post!`;

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(blogUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      blogUrl
    )}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      blogUrl
    )}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(
      shareText + " " + blogUrl
    )}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(blogUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const openShareLink = (platform) => {
    window.open(shareLinks[platform], "_blank", "width=600,height=400");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-dark-800 rounded-xl shadow-2xl max-w-md w-full border border-dark-600">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <h3 className="text-lg font-semibold text-dark-100">
            Share this post
          </h3>
          <button
            onClick={onClose}
            className="text-dark-400 hover:text-dark-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Blog Info */}
          <div className="space-y-2">
            <h4 className="font-medium text-dark-100">{blogData?.title}</h4>
            <p className="text-sm text-dark-300 line-clamp-2">
              {blogData?.shortNote || "Check out this amazing blog post!"}
            </p>
          </div>

          {/* User Name Input for Comments */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark-300">
              Your name (for comments)
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Share Options */}
          <div className="space-y-4">
            <h5 className="text-sm font-medium text-dark-300">
              Share on social media
            </h5>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => openShareLink("twitter")}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Twitter size={16} />
                <span className="text-sm">Twitter</span>
              </button>

              <button
                onClick={() => openShareLink("linkedin")}
                className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors"
              >
                <Linkedin size={16} />
                <span className="text-sm">LinkedIn</span>
              </button>

              <button
                onClick={() => openShareLink("facebook")}
                className="flex items-center gap-2 px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-lg transition-colors"
              >
                <Facebook size={16} />
                <span className="text-sm">Facebook</span>
              </button>

              <button
                onClick={() => openShareLink("whatsapp")}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
                <span className="text-sm">WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Copy Link */}
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-dark-300">Or copy link</h5>
            <div className="flex gap-2">
              <div className="flex-1 px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 text-sm truncate">
                {blogUrl}
              </div>
              <button
                onClick={copyToClipboard}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  copied
                    ? "bg-green-600 text-white"
                    : "bg-dark-700 hover:bg-dark-600 text-dark-300 hover:text-dark-100"
                }`}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span className="text-sm">{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
