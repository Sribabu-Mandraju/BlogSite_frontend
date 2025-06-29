const API_BASE_URL = "http://localhost:5000/blog";

// Blog CRUD operations
export const createBlog = async (blogData) => {
  console.log(blogData)
  try {
    const response = await fetch(`${API_BASE_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(blogData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `HTTP error! status: ${response.status}`
      );
    }

    return result;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const getBlogs = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams ? `${API_BASE_URL}?${queryParams}` : API_BASE_URL;

    const response = await fetch(url);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `HTTP error! status: ${response.status}`
      );
    }

    return result;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const getBlogById = async (blogId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${blogId}`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `HTTP error! status: ${response.status}`
      );
    }

    return result;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const updateBlog = async (blogId, blogData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${blogId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(blogData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `HTTP error! status: ${response.status}`
      );
    }

    return result;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const deleteBlog = async (blogId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${blogId}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `HTTP error! status: ${response.status}`
      );
    }

    return result;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Draft management
export const saveDraft = async (blogId, blogData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${blogId}/save-draft`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(blogData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `HTTP error! status: ${response.status}`
      );
    }

    return result;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const publishBlog = async (blogId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${blogId}/publish`, {
      method: "PUT",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `HTTP error! status: ${response.status}`
      );
    }

    return result;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Interaction operations
export const addLike = async (blogId, userName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${blogId}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: userName }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `HTTP error! status: ${response.status}`
      );
    }

    return result;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const removeLike = async (blogId, userName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${blogId}/like`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: userName }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `HTTP error! status: ${response.status}`
      );
    }

    return result;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const addComment = async (blogId, commentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${blogId}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `HTTP error! status: ${response.status}`
      );
    }

    return result;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Statistics
export const getBlogStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `HTTP error! status: ${response.status}`
      );
    }

    return result;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const getAllBlogs = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams
      ? `${API_BASE_URL}/all?${queryParams}`
      : `${API_BASE_URL}/all`;

    const response = await fetch(url);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `HTTP error! status: ${response.status}`
      );
    }

    return result;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
