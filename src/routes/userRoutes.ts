import express from 'express';
import upload from '../config/uploadConfig';
import {
  authUser,
  getUserProfile,
  registerUser,
  uploadSkinImage,
} from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// @route   POST /api/users
router.post('/', registerUser);

// @route   POST /api/users/signup
router.post('/signup', registerUser);

// @route   POST /api/users/login
router.post('/login', authUser);

// @route   GET /api/users/profile
// Protected route - requires authentication
router.get('/profile', protect, getUserProfile);

// @route   POST /api/users/upload-image
// Protected route - requires authentication
router.post('/upload-image', protect, upload.single('image'), uploadSkinImage);

// @route   GET /api/users/upload-form
// Simple test HTML form for uploading images (development only)
router.get('/upload-form', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Skin Image Upload Test</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
          h1 { color: #4CAF50; }
          .form-group { margin-bottom: 15px; }
          label { display: block; margin-bottom: 5px; }
          input[type="file"] { display: block; }
          button { background-color: #4CAF50; color: white; padding: 10px 15px; border: none; cursor: pointer; }
          .note { margin-top: 20px; padding: 10px; background-color: #f8f9fa; border-left: 4px solid #4CAF50; }
        </style>
      </head>
      <body>
        <h1>Skin Image Upload Test</h1>
        <div class="note">
          <p><strong>Note:</strong> This is a test form. In production, you would handle this in your frontend application.</p>
          <p>Make sure you have a valid JWT token to use this endpoint.</p>
        </div>
        <form id="uploadForm" enctype="multipart/form-data">
          <div class="form-group">
            <label for="token">JWT Token:</label>
            <input type="text" id="token" name="token" style="width: 100%;" placeholder="Bearer token" required>
          </div>
          <div class="form-group">
            <label for="image">Select Skin Image:</label>
            <input type="file" id="image" name="image" accept="image/*" required>
          </div>
          <button type="submit">Upload Image</button>
        </form>
        <div id="result" style="margin-top: 20px;"></div>
        
        <script>
          document.getElementById('uploadForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const token = document.getElementById('token').value;
            const image = document.getElementById('image').files[0];
            
            if (!token || !image) {
              document.getElementById('result').innerHTML = '<p style="color: red;">Please provide both token and image</p>';
              return;
            }
            
            const formData = new FormData();
            formData.append('image', image);
            
            try {
              const response = await fetch('/api/users/upload-image', {
                method: 'POST',
                headers: {
                  'Authorization': token.startsWith('Bearer ') ? token : 'Bearer ' + token
                },
                body: formData
              });
              
              const data = await response.json();
              
              if (response.ok) {
                document.getElementById('result').innerHTML = 
                  '<p style="color: green;">Upload successful!</p>' + 
                  '<pre>' + JSON.stringify(data, null, 2) + '</pre>' +
                  (data.skinImage && data.skinImage.url ? 
                    '<img src="' + data.skinImage.url + '" style="max-width: 100%; margin-top: 10px;" />' : '');
              } else {
                document.getElementById('result').innerHTML = 
                  '<p style="color: red;">Error: ' + data.message + '</p>';
              }
            } catch (error) {
              document.getElementById('result').innerHTML = 
                '<p style="color: red;">Error: ' + error.message + '</p>';
            }
          });
        </script>
      </body>
    </html>
  `);
});

export default router;
