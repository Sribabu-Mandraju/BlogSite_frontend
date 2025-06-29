import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Clock,
  User,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  ArrowLeft,    
  Calendar,
  Tag,
  Quote,
} from "lucide-react";

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    // Simulate fetching post data with the new structure
    const mockPost = {
      id: parseInt(id),
      title: "Getting Started with React and TypeScript",
      shortNote:
        "A comprehensive guide to building modern web applications with React and TypeScript, covering setup, best practices, and advanced concepts.",
      footerQuote:
        "The best code is no code at all. But if you must write code, make it readable, maintainable, and well-typed.",
      htmlContent: `
        <div class="prose prose-invert prose-lg max-w-none">
          <h1>Getting Started with React and TypeScript</h1>
          
          <p>React and TypeScript are a powerful combination for building modern web applications. In this guide, we'll explore how to set up a new project and understand the key concepts.</p>
          
          <h2>Why TypeScript with React?</h2>
          
          <p>TypeScript provides static type checking for JavaScript, which helps catch errors early in development and improves code maintainability. When combined with React, it offers:</p>
          
          <ul>
            <li><strong>Better IntelliSense</strong>: Enhanced autocomplete and error detection</li>
            <li><strong>Type Safety</strong>: Catch bugs before they reach production</li>
            <li><strong>Better Documentation</strong>: Types serve as living documentation</li>
            <li><strong>Refactoring Confidence</strong>: Safe refactoring with type checking</li>
          </ul>
          
          <h2>Setting Up a New Project</h2>
          
          <h3>1. Create a New React TypeScript Project</h3>
          
          <pre><code class="language-bash">npx create-react-app my-app --template typescript
cd my-app
npm start</code></pre>
          
          <h3>2. Understanding TypeScript Configuration</h3>
          
          <p>The <code>tsconfig.json</code> file contains important configuration options:</p>
          
          <pre><code class="language-json">{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}</code></pre>
          
          <h2>Basic Component with TypeScript</h2>
          
          <p>Here's how to create a typed React component:</p>
          
          <pre><code class="language-tsx">interface UserProps {
  name: string;
  age: number;
  email?: string; // Optional property
}

const UserProfile: React.FC&lt;UserProps&gt; = ({ name, age, email }) => {
  return (
    &lt;div&gt;
      &lt;h2&gt;{name}&lt;/h2&gt;
      &lt;p&gt;Age: {age}&lt;/p&gt;
      {email && &lt;p&gt;Email: {email}&lt;/p&gt;}
    &lt;/div&gt;
  );
};</code></pre>
          
          <h2>State Management with TypeScript</h2>
          
          <h3>useState Hook</h3>
          
          <pre><code class="language-tsx">const [count, setCount] = useState&lt;number&gt;(0);
const [user, setUser] = useState&lt;User | null&gt;(null);
const [loading, setLoading] = useState&lt;boolean&gt;(false);</code></pre>
          
          <h3>useReducer Hook</h3>
          
          <pre><code class="language-tsx">interface State {
  count: number;
  loading: boolean;
}

type Action = 
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'SET_LOADING'; payload: boolean };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};</code></pre>
          
          <h2>Event Handling</h2>
          
          <p>TypeScript provides excellent support for event handling:</p>
          
          <pre><code class="language-tsx">const handleClick = (event: React.MouseEvent&lt;HTMLButtonElement&gt;) => {
  console.log('Button clicked!');
};

const handleInputChange = (event: React.ChangeEvent&lt;HTMLInputElement&gt;) => {
  console.log('Input value:', event.target.value);
};

const handleFormSubmit = (event: React.FormEvent&lt;HTMLFormElement&gt;) => {
  event.preventDefault();
  // Handle form submission
};</code></pre>
          
          <h2>Best Practices</h2>
          
          <ol>
            <li><strong>Use Strict Mode</strong>: Enable strict mode in tsconfig.json</li>
            <li><strong>Define Interfaces</strong>: Create interfaces for all props and state</li>
            <li><strong>Avoid <code>any</code></strong>: Use proper types instead of <code>any</code></li>
            <li><strong>Use Generic Types</strong>: Leverage TypeScript's generic capabilities</li>
            <li><strong>Type Your API Responses</strong>: Create interfaces for API data</li>
          </ol>
          
          <h2>Conclusion</h2>
          
          <p>TypeScript with React provides a robust foundation for building scalable applications. The initial learning curve is worth the long-term benefits in code quality and developer experience.</p>
          
          <p>Start with simple components and gradually add more complex types as you become comfortable with the syntax.</p>
        </div>
      `,
      author: "Sarah Johnson",
      date: "2024-01-15",
      readTime: "8 min read",
      views: 1247,
      likes: 89,
      comments: 23,
      tags: ["React", "TypeScript", "Frontend"],
      authorAvatar: "SJ",
    };

    setPost(mockPost);
  }, [id]);

  if (!post) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-dark-300 hover:text-primary-400 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back to Home</span>
      </Link>

      {/* Post Header */}
      <article className="card p-8 lg:p-12">
        {/* Post Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="tag flex items-center gap-1">
                <Tag size={12} />
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-6 text-sm text-dark-400 ml-auto">
            <span className="flex items-center gap-1">
              <Clock size={16} />
              {post.readTime}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={16} />
              {post.views.toLocaleString()} views
            </span>
            <span className="flex items-center gap-1">
              <Heart size={16} />
              {post.likes} likes
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle size={16} />
              {post.comments} comments
            </span>
          </div>
        </div>

        {/* Title and Author */}
        <header className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-dark-100 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Short Note */}
          {post.shortNote && (
            <div className="mb-6 p-4 bg-dark-800/50 border-l-4 border-primary-500 rounded-r-lg">
              <p className="text-dark-200 italic leading-relaxed">
                "{post.shortNote}"
              </p>
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {post.authorAvatar}
            </div>
            <div>
              <p className="text-lg font-semibold text-dark-100">
                {post.author}
              </p>
              <div className="flex items-center gap-2 text-sm text-dark-400">
                <Calendar size={14} />
                <span>{post.date}</span>
              </div>
            </div>
          </div>
        </header>

        {/* HTML Content */}
        <div className="mb-8">
          <div
            className="prose prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.htmlContent }}
          />
        </div>

        {/* Footer Quote */}
        {post.footerQuote && (
          <div className="mt-12 p-6 bg-gradient-to-r from-dark-800 to-dark-700 border border-dark-600 rounded-lg">
            <div className="flex items-start gap-3">
              <Quote
                size={24}
                className="text-primary-400 mt-1 flex-shrink-0"
              />
              <blockquote className="text-lg text-dark-200 italic leading-relaxed">
                "{post.footerQuote}"
              </blockquote>
            </div>
          </div>
        )}
      </article>

      {/* Action Buttons */}
      <div className="card p-6">
        <div className="flex flex-wrap items-center gap-4">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              liked
                ? "bg-primary-600/20 text-primary-400 border border-primary-600/30"
                : "bg-dark-700 hover:bg-dark-600 text-dark-300 hover:text-dark-100 border border-dark-600"
            }`}
            onClick={() => setLiked(!liked)}
          >
            <Heart size={20} className={liked ? "fill-current" : ""} />
            <span>{liked ? post.likes + 1 : post.likes}</span>
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-dark-300 hover:text-dark-100 border border-dark-600 rounded-lg transition-all duration-200">
            <MessageCircle size={20} />
            <span>Comment</span>
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-dark-300 hover:text-dark-100 border border-dark-600 rounded-lg transition-all duration-200">
            <Share2 size={20} />
            <span>Share</span>
          </button>

          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              bookmarked
                ? "bg-primary-600/20 text-primary-400 border border-primary-600/30"
                : "bg-dark-700 hover:bg-dark-600 text-dark-300 hover:text-dark-100 border border-dark-600"
            }`}
            onClick={() => setBookmarked(!bookmarked)}
          >
            <Bookmark size={20} className={bookmarked ? "fill-current" : ""} />
            <span>{bookmarked ? "Saved" : "Save"}</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="card p-8">
        <h3 className="text-2xl font-bold text-dark-100 mb-6">
          Comments ({post.comments})
        </h3>

        <div className="space-y-6">
          <div className="space-y-4">
            <textarea
              placeholder="Add a comment..."
              className="w-full min-h-[100px] p-4 bg-dark-800 border border-dark-600 text-dark-100 placeholder-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-vertical"
            />
            <button className="btn-primary">Post Comment</button>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-dark-800/50 rounded-lg border border-dark-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  MK
                </div>
                <div>
                  <p className="text-sm font-semibold text-dark-100">
                    Mike Kim
                  </p>
                  <p className="text-xs text-dark-400">2 hours ago</p>
                </div>
              </div>
              <p className="text-dark-200 leading-relaxed">
                Great article! I've been using TypeScript with React for a while
                now, and the benefits are incredible. The type safety has saved
                me from so many runtime errors.
              </p>
            </div>

            <div className="p-6 bg-dark-800/50 rounded-lg border border-dark-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-primary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  AL
                </div>
                <div>
                  <p className="text-sm font-semibold text-dark-100">
                    Alex Lee
                  </p>
                  <p className="text-xs text-dark-400">1 day ago</p>
                </div>
              </div>
              <p className="text-dark-200 leading-relaxed">
                This is exactly what I needed! The examples are clear and the
                explanations are thorough. Thanks for sharing this comprehensive
                guide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
