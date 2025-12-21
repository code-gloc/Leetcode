import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosClient from '../utils/axiosclient';
import {
  FiTrash2,
  FiSearch,
  FiFilter,
  FiAlertTriangle,
  FiCode,
  FiTag,
  FiX,
  FiLoader,
  FiAlertCircle,
  FiUpload,
  FiVideo,
  FiFile,
  FiCheck
} from 'react-icons/fi';

// Upload Video Modal Component with YouTube URL support
const UploadVideoModal = ({ isOpen, onClose, problem, onUploadSuccess }) => {
  const [uploadMethod, setUploadMethod] = useState('file'); // 'file' or 'youtube'
  const [videoFile, setVideoFile] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStep, setUploadStep] = useState('select'); // 'select', 'uploading', 'saving'
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  // Validate YouTube URL
  const isValidYoutubeUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/)?([a-zA-Z0-9_-]{11})/;
    return youtubeRegex.test(url);
  };

  // Extract YouTube video ID
  const getYoutubeVideoId = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  // Get YouTube thumbnail
  const getYoutubeThumbnail = (videoId) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  // Get YouTube embed URL
  const getYoutubeEmbedUrl = (videoId) => {
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo'];
      if (!validTypes.includes(file.type)) {
        setError('Please select a valid video file (MP4, WebM, OGG, MOV, AVI)');
        return;
      }
      // Validate file size (max 500MB)
      if (file.size > 500 * 1024 * 1024) {
        setError('File size must be less than 500MB');
        return;
      }
      setVideoFile(file);
      setError(null);
    }
  };

  const handleYoutubeUrlChange = (e) => {
    const url = e.target.value;
    setYoutubeUrl(url);
    
    if (url && !isValidYoutubeUrl(url)) {
      setError('Please enter a valid YouTube URL');
    } else {
      setError(null);
    }
  };

  const getUploadSignature = async () => {
    try {
      const { data } = await axiosClient.get(`/video/create/${problem._id}`);
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to get upload signature');
    }
  };

  const uploadToCloudinary = async (signature, timestamp, publicId, apiKey, cloudName) => {
    const formData = new FormData();
    formData.append('file', videoFile);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('public_id', publicId);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload to Cloudinary');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      throw new Error(err.message || 'Cloudinary upload failed');
    }
  };

  const saveVideoMetadata = async (videoData) => {
    try {
      const payload = {
        problemId: problem._id,
        ...videoData
      };

      const { data } = await axiosClient.post('/video/save', payload);
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to save video metadata');
    }
  };

  const handleFileUpload = async () => {
    if (!videoFile) {
      setError('Please select a video file');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);

      // Step 1: Get upload signature
      setUploadStep('uploading');
      const signatureData = await getUploadSignature();

      // Step 2: Upload to Cloudinary with progress tracking
      const cloudinaryResponse = await uploadToCloudinary(
        signatureData.signature,
        signatureData.timestamp,
        signatureData.public_id,
        signatureData.api_key,
        signatureData.cloud_name
      );

      // Step 3: Save metadata to database
      setUploadStep('saving');
      await saveVideoMetadata({
        cloudinaryPublicId: cloudinaryResponse.public_id,
        secureUrl: cloudinaryResponse.secure_url,
        duration: cloudinaryResponse.duration || 0,
        videoType: 'cloudinary'
      });

      // Success
      onUploadSuccess(`Video uploaded successfully for "${problem.title}"!`);
      handleClose();
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload video');
      setUploadStep('select');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleYoutubeUpload = async () => {
    if (!youtubeUrl) {
      setError('Please enter a YouTube URL');
      return;
    }

    if (!isValidYoutubeUrl(youtubeUrl)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      setUploadStep('saving');

      const videoId = getYoutubeVideoId(youtubeUrl);
      const thumbnailUrl = getYoutubeThumbnail(videoId);
      const embedUrl = getYoutubeEmbedUrl(videoId);

      // Save YouTube video metadata
      await saveVideoMetadata({
        secureUrl: embedUrl,
        thumbnailUrl: thumbnailUrl,
        duration: 0, // YouTube videos don't have duration in this implementation
        videoType: 'youtube',
        youtubeVideoId: videoId,
        youtubeUrl: youtubeUrl
      });

      // Success
      onUploadSuccess(`YouTube video linked successfully for "${problem.title}"!`);
      handleClose();
    } catch (err) {
      console.error('YouTube upload error:', err);
      setError(err.message || 'Failed to save YouTube video');
      setUploadStep('select');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpload = () => {
    if (uploadMethod === 'file') {
      handleFileUpload();
    } else {
      handleYoutubeUpload();
    }
  };

  const handleClose = () => {
    setVideoFile(null);
    setYoutubeUrl('');
    setUploadProgress(0);
    setUploadStep('select');
    setError(null);
    setUploadMethod('file');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="relative w-full max-w-2xl mx-auto"
        >
          <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-3xl p-8 shadow-2xl">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                <FiVideo className="text-white text-3xl" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-white text-center mb-4">
              Upload Solution Video
            </h3>

            {/* Problem Title */}
            <div className="bg-white/10 border border-white/20 rounded-xl p-3 mb-6">
              <p className="text-white font-semibold text-center break-words">
                "{problem?.title}"
              </p>
            </div>

            {/* Upload Method Toggle */}
            {uploadStep === 'select' && (
              <div className="flex space-x-2 mb-6 bg-white/5 p-1 rounded-xl">
                <button
                  onClick={() => setUploadMethod('file')}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    uploadMethod === 'file'
                      ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <FiUpload className="inline mr-2" />
                  Upload File
                </button>
                <button
                  onClick={() => setUploadMethod('youtube')}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    uploadMethod === 'youtube'
                      ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <FiVideo className="inline mr-2" />
                  YouTube URL
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-xl bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6"
              >
                <div className="flex items-center">
                  <FiAlertCircle className="text-red-400 mr-3" />
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              </motion.div>
            )}

            {/* Upload Section */}
            {uploadStep === 'select' ? (
              <div className="mb-6">
                {uploadMethod === 'file' ? (
                  // File Upload Section
                  <label className="block w-full">
                    <div className="border-2 border-dashed border-white/30 rounded-xl p-8 text-center hover:border-purple-400/50 transition-all duration-200 cursor-pointer bg-white/5 hover:bg-white/10">
                      <FiUpload className="text-white text-4xl mx-auto mb-4" />
                      <p className="text-white font-medium mb-2">
                        {videoFile ? videoFile.name : 'Click to select video file'}
                      </p>
                      <p className="text-gray-400 text-sm">
                        MP4, WebM, OGG, MOV, AVI (Max 500MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                ) : (
                  // YouTube URL Section
                  <div>
                    <div className="relative">
                      <FiVideo className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                      <input
                        type="text"
                        placeholder="Paste YouTube URL here (e.g., https://www.youtube.com/watch?v=...)"
                        value={youtubeUrl}
                        onChange={handleYoutubeUrlChange}
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border-2 border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-200"
                        disabled={isUploading}
                      />
                    </div>
                    
                    {/* YouTube URL Preview */}
                    {youtubeUrl && isValidYoutubeUrl(youtubeUrl) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 bg-white/10 border border-white/20 rounded-xl p-4"
                      >
                        <div className="flex items-center">
                          <img 
                            src={getYoutubeThumbnail(getYoutubeVideoId(youtubeUrl))} 
                            alt="YouTube thumbnail"
                            className="w-32 h-20 object-cover rounded-lg mr-4"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/320x180?text=Video+Preview';
                            }}
                          />
                          <div className="flex-1">
                            <p className="text-white font-medium mb-1">YouTube Video Detected</p>
                            <p className="text-gray-400 text-sm">ID: {getYoutubeVideoId(youtubeUrl)}</p>
                          </div>
                          <FiCheck className="text-green-400 text-2xl" />
                        </div>
                      </motion.div>
                    )}

                    {/* YouTube URL Help */}
                    <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                      <p className="text-blue-400 text-sm font-medium mb-2">✨ Supported YouTube URL formats:</p>
                      <ul className="text-gray-300 text-xs space-y-1">
                        <li>• https://www.youtube.com/watch?v=VIDEO_ID</li>
                        <li>• https://youtu.be/VIDEO_ID</li>
                        <li>• https://www.youtube.com/embed/VIDEO_ID</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Upload Progress Section
              <div className="mb-6">
                <div className="space-y-4">
                  {/* Step 1: Uploading (only for file upload) */}
                  {uploadMethod === 'file' && (
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        uploadStep === 'uploading' ? 'bg-purple-500' : 'bg-green-500'
                      }`}>
                        {uploadStep === 'uploading' ? (
                          <FiLoader className="text-white animate-spin" />
                        ) : (
                          <FiCheck className="text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">Uploading to Cloudinary</p>
                        {uploadStep === 'uploading' && (
                          <>
                            <div className="mt-2 bg-white/10 rounded-full h-2 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${uploadProgress}%` }}
                                className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                              />
                            </div>
                            <p className="text-gray-400 text-sm mt-1">{uploadProgress}%</p>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Saving metadata */}
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      uploadStep === 'saving' ? 'bg-purple-500' : uploadStep === 'uploading' ? 'bg-gray-600' : 'bg-green-500'
                    }`}>
                      {uploadStep === 'saving' ? (
                        <FiLoader className="text-white animate-spin" />
                      ) : uploadStep === 'uploading' ? (
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      ) : (
                        <FiCheck className="text-white" />
                      )}
                    </div>
                    <div>
                      <p className={`font-medium ${
                        uploadStep === 'saving' ? 'text-white' : uploadStep === 'uploading' ? 'text-gray-400' : 'text-gray-300'
                      }`}>
                        Saving metadata
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Buttons */}
            {uploadStep === 'select' ? (
              <div className="flex space-x-4">
                <button
                  onClick={handleClose}
                  disabled={isUploading}
                  className="flex-1 px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpload}
                  disabled={
                    isUploading || 
                    (uploadMethod === 'file' && !videoFile) ||
                    (uploadMethod === 'youtube' && (!youtubeUrl || !isValidYoutubeUrl(youtubeUrl)))
                  }
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center"
                >
                  {uploadMethod === 'file' ? (
                    <>
                      <FiUpload className="w-4 h-4 mr-2" />
                      Upload Video
                    </>
                  ) : (
                    <>
                      <FiVideo className="w-4 h-4 mr-2" />
                      Save YouTube Link
                    </>
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={handleClose}
                disabled={isUploading}
                className="w-full px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 disabled:opacity-50"
              >
                {isUploading ? 'Processing...' : 'Close'}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, problemTitle, isLoading }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="relative w-full max-w-md mx-auto"
        >
          <div className="backdrop-blur-xl bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <FiAlertTriangle className="text-white text-3xl" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white text-center mb-4">
              Delete Video?
            </h3>

            <div className="text-center mb-8">
              <p className="text-gray-300 mb-3">
                Are you sure you want to delete the video for
              </p>
              <div className="bg-white/10 border border-white/20 rounded-xl p-3 mb-3">
                <p className="text-white font-semibold text-lg break-words">
                  "{problemTitle}"
                </p>
              </div>
              <p className="text-red-400 text-sm font-medium">
                ⚠️ This action cannot be undone
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-red-400/50 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <FiLoader className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 className="w-4 h-4 mr-2" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Toast Component
const Toast = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -100, x: '-50%' }}
          className="fixed top-6 left-1/2 z-50 transform -translate-x-1/2"
        >
          <div className={`backdrop-blur-xl border rounded-2xl p-4 shadow-2xl ${
            type === 'success'
              ? 'bg-green-500/20 border-green-500/30'
              : 'bg-red-500/20 border-red-500/30'
          }`}>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                type === 'success' ? 'bg-green-500' : 'bg-red-500'
              }`}>
                {type === 'success' ? (
                  <FiCheck className="text-white text-sm" />
                ) : (
                  <FiAlertCircle className="text-white text-sm" />
                )}
              </div>
              <span className="text-white font-medium mr-4">{message}</span>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiX className="text-lg" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AdminVideo = () => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [problemToDelete, setProblemToDelete] = useState(null);
  const [problemToUpload, setProblemToUpload] = useState(null);

  // Toast states
  const [toast, setToast] = useState({ message: '', type: '', isVisible: false });

  const getErrorMessage = (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (data?.error) return data.error;
      if (data?.message) return data.message;

      switch (status) {
        case 400: return 'Bad request - please check your input';
        case 401: return 'Unauthorized - please log in again';
        case 403: return 'Forbidden - you don\'t have permission';
        case 404: return 'Resource not found';
        case 409: return 'Video already exists for this problem';
        case 500: return 'Internal server error - please try again later';
        default: return `Request failed with status ${status}`;
      }
    } else if (error.request) {
      return 'Network error - please check your connection';
    } else {
      return error.message || 'An unexpected error occurred';
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  useEffect(() => {
    filterProblems();
  }, [problems, searchTerm, difficultyFilter]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblems');
      setProblems(data.problems || []);
      setError(null);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      console.error('Fetch problems error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterProblems = () => {
    let filtered = problems.filter(problem =>
      problem.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(problem =>
        problem.difficulty.toLowerCase() === difficultyFilter
      );
    }

    setFilteredProblems(filtered);
  };

  const handleDeleteClick = (problem) => {
    setProblemToDelete(problem);
    setShowDeleteModal(true);
  };

  const handleUploadClick = (problem) => {
    setProblemToUpload(problem);
    setShowUploadModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!problemToDelete) return;

    try {
      setDeleteLoading(problemToDelete._id);
      await axiosClient.delete(`/video/delete/${problemToDelete._id}`);
      
      showToast(`Video for "${problemToDelete.title}" deleted successfully!`, 'success');

      setShowDeleteModal(false);
      setProblemToDelete(null);
      setError(null);
      
      // Refresh problems list
      fetchProblems();
    } catch (error) {
      console.error('Delete error:', error);
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setProblemToDelete(null);
  };

  const handleUploadSuccess = (message) => {
    showToast(message, 'success');
    fetchProblems(); // Refresh problems list
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'hard': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiLoader className="text-white text-2xl animate-spin" />
          </div>
          <p className="text-gray-300 text-lg">Loading problems...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-4 shadow-2xl">
                <FiVideo className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Manage Solution Videos</h1>
                <p className="text-gray-300 mt-2">Upload videos or link YouTube tutorials</p>
              </div>
            </div>
          </motion.div>

          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="backdrop-blur-xl bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6"
              >
                <div className="flex items-center">
                  <FiAlertTriangle className="text-red-400 text-xl mr-3" />
                  <span className="text-red-400 font-medium">{error}</span>
                  <button
                    onClick={() => setError(null)}
                    className="ml-auto text-red-400 hover:text-red-300 transition-colors"
                  >
                    <FiX className="text-lg" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-200"
                />
              </div>

              <div className="relative">
                <FiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-200 appearance-none cursor-pointer"
                >
                  <option value="all" className="bg-gray-800">All Difficulties</option>
                  <option value="easy" className="bg-gray-800">Easy</option>
                  <option value="medium" className="bg-gray-800">Medium</option>
                  <option value="hard" className="bg-gray-800">Hard</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <FiCode className="text-purple-400 mr-2" />
                  <span className="text-gray-300 text-sm">
                    Total: <span className="text-white font-semibold">{problems.length}</span>
                  </span>
                </div>
                <div className="flex items-center">
                  <FiSearch className="text-cyan-400 mr-2" />
                  <span className="text-gray-300 text-sm">
                    Filtered: <span className="text-white font-semibold">{filteredProblems.length}</span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Problems Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <AnimatePresence>
              {filteredProblems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-12 text-center"
                >
                  <FiSearch className="text-gray-400 text-4xl mx-auto mb-4" />
                  <h3 className="text-white text-xl font-semibold mb-2">No problems found</h3>
                  <p className="text-gray-400">Try adjusting your search or filters</p>
                </motion.div>
              ) : (
                filteredProblems.map((problem, index) => (
                  <motion.div
                    key={problem._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                    className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:border-purple-500/30 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="text-gray-400 text-sm mr-4">#{index + 1}</span>
                          <h3 className="text-white text-lg font-semibold group-hover:text-purple-400 transition-colors">
                            {problem.title}
                          </h3>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                            <span>{problem.difficulty}</span>
                          </div>

                          <div className="flex items-center">
                            <FiTag className="text-gray-400 mr-2" />
                            <span className="text-gray-300 text-sm bg-gray-700/50 px-3 py-1 rounded-full">
                              {problem.tags || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-3 ml-6">
                        {/* Upload Button */}
                        <button
                          onClick={() => handleUploadClick(problem)}
                          className="group/btn relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-300 transform hover:scale-105"
                        >
                          <FiUpload className="w-4 h-4 mr-2" />
                          <span>Upload</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteClick(problem)}
                          disabled={deleteLoading === problem._id}
                          className="group/btn relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-red-400/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          <FiTrash2 className="w-4 h-4 mr-2 group-hover/btn:animate-pulse" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadVideoModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        problem={problemToUpload}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        problemTitle={problemToDelete?.title || ''}
        isLoading={deleteLoading === problemToDelete?._id}
      />

      {/* Toast Notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </>
  );
};

export default AdminVideo;
