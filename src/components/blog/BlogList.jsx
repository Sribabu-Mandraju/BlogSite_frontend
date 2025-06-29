import React from "react";
import BlogCard from "./BlogCard";

const BlogList = ({ blogs = [] }) => {
  if (!blogs || blogs.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <div className="text-dark-400 mb-4">
          <h3 className="text-base sm:text-lg font-medium text-dark-200 mb-1 sm:mb-2">
            No blogs found
          </h3>
          <p className="text-sm sm:text-base text-dark-400">
            No blogs available at the moment
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {blogs.map((blog) => (
        <BlogCard key={blog._id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogList;
