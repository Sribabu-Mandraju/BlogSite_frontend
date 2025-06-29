import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
  api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
});

// Upload file to Cloudinary
export const uploadToCloudinary = async (file, options = {}) => {
  try {
    // Create form data
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "ml_default"
    );

    // Add additional options
    Object.keys(options).forEach((key) => {
      formData.append(key, options[key]);
    });

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/auto/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

// Delete file from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    const response = await fetch(`/api/cloudinary/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      throw new Error("Delete failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw error;
  }
};

export default cloudinary;
