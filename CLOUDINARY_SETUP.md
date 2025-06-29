# Cloudinary Setup Guide

This guide will help you set up Cloudinary for file uploads in your React application.

## Step 1: Create a Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/) and sign up for a free account
2. Verify your email address
3. Log in to your Cloudinary dashboard

## Step 2: Get Your Cloudinary Credentials

1. In your Cloudinary dashboard, go to the **Settings** tab
2. Click on **Access Keys** in the left sidebar
3. You'll find your credentials:
   - **Cloud Name**: Your unique cloud identifier
   - **API Key**: Your API key for authentication
   - **API Secret**: Your API secret (keep this secure)

## Step 3: Create an Upload Preset

1. In your Cloudinary dashboard, go to **Settings** > **Upload**
2. Scroll down to **Upload presets**
3. Click **Add upload preset**
4. Set the following:
   - **Preset name**: Choose a name (e.g., `ml_default`)
   - **Signing Mode**: Choose `Unsigned` for client-side uploads
   - **Folder**: Optional - specify a folder name
5. Click **Save**

## Step 4: Configure Your Application

### Option A: Using Environment Variables (Recommended)

1. Create a `.env` file in your project root:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_API_SECRET=your_api_secret
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_name
```

2. Update the `CreatePost.jsx` file to use environment variables:

```javascript
// Replace these lines in CreatePost.jsx
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
```

### Option B: Direct Configuration (For Testing)

1. Update the constants in `CreatePost.jsx`:

```javascript
const CLOUDINARY_CLOUD_NAME = "your_actual_cloud_name";
const CLOUDINARY_UPLOAD_PRESET = "your_actual_upload_preset";
```

## Step 5: Test the Upload

1. Start your development server: `npm run dev`
2. Navigate to the Create Post page
3. Try uploading an HTML file
4. Check the browser console for any errors
5. Verify the file appears in your Cloudinary dashboard

## Security Notes

- **Never commit your API secret to version control**
- Use environment variables for sensitive data
- Consider implementing server-side upload for production applications
- Set up proper CORS settings in your Cloudinary account if needed

## Troubleshooting

### Common Issues:

1. **"Upload failed" error**:

   - Check your cloud name and upload preset
   - Ensure your upload preset is set to "Unsigned"
   - Verify your Cloudinary account is active

2. **CORS errors**:

   - Go to Cloudinary Settings > Security
   - Add your domain to the allowed origins

3. **File size limits**:
   - Free accounts have upload limits
   - Check your Cloudinary plan limits

### Debug Mode:

Add this to your upload function for debugging:

```javascript
console.log("Upload response:", result);
console.log("Cloudinary URL:", result.secure_url);
```

## Additional Features

You can enhance the upload with additional options:

```javascript
// Add these to the formData in uploadToCloudinary function
formData.append("folder", "blog-posts"); // Organize files in folders
formData.append("transformation", "w_800,h_600,c_fill"); // Resize images
formData.append("tags", "blog,html"); // Add tags for organization
```

## Support

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Upload API](https://cloudinary.com/documentation/upload_images)
- [React Integration Guide](https://cloudinary.com/documentation/react_integration)
