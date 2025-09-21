import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosClient from '../utils/axiosClient';
import {
  FiTrash2,
  FiSearch,
  FiFilter,
  FiAlertTriangle,
  FiCode,
  FiTag,
  FiX,
  FiLoader,
  FiAlertCircle
} from 'react-icons/fi';

// Custom Confirmation Modal Component
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, problemTitle, isLoading }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="relative w-full max-w-md mx-auto"
        >
          <div className="backdrop-blur-xl bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-3xl p-8 shadow-2xl">
            {/* Warning Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <FiAlertTriangle className="text-white text-3xl" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-white text-center mb-4">
              Delete Problem?
            </h3>

            {/* Message */}
            <div className="text-center mb-8">
              <p className="text-gray-300 mb-3">
                Are you sure you want to delete
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

            {/* Buttons */}
            <div className="flex space-x-4">
              {/* Cancel Button */}
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </button>

              {/* Delete Button */}
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

// Custom Toast Component
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
                  <FiTrash2 className="text-white text-sm" />
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

const AdminDelete = () => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [deleteLoading, setDeleteLoading] = useState(null);
  
  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [problemToDelete, setProblemToDelete] = useState(null);
  
  // Toast states
  const [toast, setToast] = useState({ message: '', type: '', isVisible: false });

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
    } catch (err) {
      setError('Failed to fetch problems');
      console.error(err);
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

  const handleDeleteConfirm = async () => {
    if (!problemToDelete) return;
    
    try {
      setDeleteLoading(problemToDelete._id);
      await axiosClient.delete(`/problem/delete/${problemToDelete._id}`);
      setProblems(problems.filter(problem => problem._id !== problemToDelete._id));
      
      // Show success toast
      showToast(`"${problemToDelete.title}" deleted successfully!`, 'success');
      
      // Close modal
      setShowDeleteModal(false);
      setProblemToDelete(null);
      setError(null);
    } catch (err) {
      setError('Failed to delete problem');
      showToast('Failed to delete problem', 'error');
      console.error(err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setProblemToDelete(null);
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
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4 shadow-2xl">
                <FiTrash2 className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Delete Problems</h1>
                <p className="text-gray-300 mt-2">Remove problems from your platform</p>
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
              {/* Search */}
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

              {/* Difficulty Filter */}
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

            {/* Stats */}
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
                    className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:border-red-500/30 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      {/* Problem Info */}
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="text-gray-400 text-sm mr-4">#{index + 1}</span>
                          <h3 className="text-white text-lg font-semibold group-hover:text-red-400 transition-colors">
                            {problem.title}
                          </h3>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          {/* Difficulty Badge */}
                          <div className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                            <span>{problem.difficulty}</span>
                          </div>
                          
                          {/* Tags */}
                          <div className="flex items-center">
                            <FiTag className="text-gray-400 mr-2" />
                            <span className="text-gray-300 text-sm bg-gray-700/50 px-3 py-1 rounded-full">
                              {problem.tags}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Delete Button */}
                      <div className="ml-6">
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

      {/* Custom Delete Confirmation Modal */}
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

export default AdminDelete;
