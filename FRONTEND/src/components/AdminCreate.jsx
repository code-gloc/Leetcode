import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosclient';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  FiPlus, 
  FiTrash2, 
  FiCode, 
  FiEye, 
  FiEyeOff, 
  FiSave, 
  FiSettings,
  FiTag,
  FiFileText,
  FiCheckCircle,
  FiX
} from 'react-icons/fi';

// Zod schema matching the problem schema
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(3, 'All three languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(3, 'All three languages required')
});

function AdminCreate() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      startCode: [
        { language: 'C++', initialCode: '' },
        { language: 'Java', initialCode: '' },
        { language: 'JavaScript', initialCode: '' }
      ],
      referenceSolution: [
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'JavaScript', completeCode: '' }
      ]
    }
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await axiosClient.post('/problem/create', data);
      alert('Problem created successfully!');
      navigate('/');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'hard': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: FiFileText },
    { id: 'testcases', label: 'Test Cases', icon: FiCheckCircle },
    { id: 'code', label: 'Code Templates', icon: FiCode }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Background Effects
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div> */}

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-4">
              <FiSettings className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Admin Panel</h1>
              <p className="text-gray-300 mt-2">Create and manage coding problems</p>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-2">
            <div className="flex space-x-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {/* Basic Information Tab */}
            {activeTab === 'basic' && (
              <motion.div
                key="basic"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl mb-6"
              >
                <div className="flex items-center mb-6">
                  <FiFileText className="text-purple-400 text-2xl mr-3" />
                  <h2 className="text-2xl font-bold text-white">Basic Information</h2>
                </div>

                <div className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Problem Title
                    </label>
                    <input
                      {...register('title')}
                      placeholder="Enter problem title..."
                      className={`w-full px-4 py-4 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-200 ${
                        errors.title ? 'border-red-400' : 'border-white/20 focus:border-purple-400'
                      }`}
                    />
                    {errors.title && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm"
                      >
                        {errors.title.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Problem Description
                    </label>
                    <textarea
                      {...register('description')}
                      placeholder="Enter detailed problem description..."
                      rows={6}
                      className={`w-full px-4 py-4 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-200 resize-none ${
                        errors.description ? 'border-red-400' : 'border-white/20 focus:border-purple-400'
                      }`}
                    />
                    {errors.description && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm"
                      >
                        {errors.description.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Difficulty and Tags */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Difficulty Level
                      </label>
                      <select
                        {...register('difficulty')}
                        className={`w-full px-4 py-4 bg-white/5 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-200 ${
                          errors.difficulty ? 'border-red-400' : 'border-white/20 focus:border-purple-400'
                        }`}
                      >
                        <option value="easy" className="bg-gray-800">Easy</option>
                        <option value="medium" className="bg-gray-800">Medium</option>
                        <option value="hard" className="bg-gray-800">Hard</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Problem Tag
                      </label>
                      <select
                        {...register('tags')}
                        className={`w-full px-4 py-4 bg-white/5 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-200 ${
                          errors.tags ? 'border-red-400' : 'border-white/20 focus:border-purple-400'
                        }`}
                      >
                        <option value="array" className="bg-gray-800">Array</option>
                        <option value="linkedList" className="bg-gray-800">Linked List</option>
                        <option value="graph" className="bg-gray-800">Graph</option>
                        <option value="dp" className="bg-gray-800">Dynamic Programming</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Test Cases Tab */}
            {activeTab === 'testcases' && (
              <motion.div
                key="testcases"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Visible Test Cases */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <FiEye className="text-green-400 text-2xl mr-3" />
                      <h2 className="text-2xl font-bold text-white">Visible Test Cases</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
                    >
                      <FiPlus className="w-4 h-4" />
                      <span>Add Test Case</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {visibleFields.map((field, index) => (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold text-white">Test Case {index + 1}</h3>
                          <button
                            type="button"
                            onClick={() => removeVisible(index)}
                            className="flex items-center space-x-1 px-3 py-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                          >
                            <FiTrash2 className="w-4 h-4" />
                            <span className="text-sm">Remove</span>
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Input</label>
                            <input
                              {...register(`visibleTestCases.${index}.input`)}
                              placeholder="Enter input..."
                              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-200"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Output</label>
                            <input
                              {...register(`visibleTestCases.${index}.output`)}
                              placeholder="Enter expected output..."
                              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-200"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Explanation</label>
                          <textarea
                            {...register(`visibleTestCases.${index}.explanation`)}
                            placeholder="Explain the test case..."
                            rows={3}
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-200 resize-none"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Hidden Test Cases */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <FiEyeOff className="text-orange-400 text-2xl mr-3" />
                      <h2 className="text-2xl font-bold text-white">Hidden Test Cases</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => appendHidden({ input: '', output: '' })}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200"
                    >
                      <FiPlus className="w-4 h-4" />
                      <span>Add Test Case</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {hiddenFields.map((field, index) => (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold text-white">Hidden Test Case {index + 1}</h3>
                          <button
                            type="button"
                            onClick={() => removeHidden(index)}
                            className="flex items-center space-x-1 px-3 py-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                          >
                            <FiTrash2 className="w-4 h-4" />
                            <span className="text-sm">Remove</span>
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Input</label>
                            <input
                              {...register(`hiddenTestCases.${index}.input`)}
                              placeholder="Enter input..."
                              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-200"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Output</label>
                            <input
                              {...register(`hiddenTestCases.${index}.output`)}
                              placeholder="Enter expected output..."
                              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-200"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Code Templates Tab */}
            {activeTab === 'code' && (
              <motion.div
                key="code"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl"
              >
                <div className="flex items-center mb-6">
                  <FiCode className="text-cyan-400 text-2xl mr-3" />
                  <h2 className="text-2xl font-bold text-white">Code Templates</h2>
                </div>

                <div className="space-y-8">
                  {[0, 1, 2].map((index) => {
                    const language = index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript';
                    const colors = {
                      0: 'from-blue-500 to-purple-500',
                      1: 'from-orange-500 to-red-500',
                      2: 'from-yellow-500 to-orange-500'
                    };
                    
                    return (
                      <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${colors[index]} text-white rounded-xl font-medium mb-4`}>
                          <FiCode className="w-4 h-4 mr-2" />
                          {language}
                        </div>
                        
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">
                              Initial Code Template
                            </label>
                            <div className="bg-gray-900/50 border border-gray-600 rounded-xl p-4">
                              <textarea
                                {...register(`startCode.${index}.initialCode`)}
                                placeholder={`Enter initial ${language} code template...`}
                                rows={8}
                                className="w-full bg-transparent text-gray-100 font-mono text-sm focus:outline-none resize-none"
                                style={{ fontFamily: 'Consolas, Monaco, "Courier New", monospace' }}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">
                              Reference Solution
                            </label>
                            <div className="bg-gray-900/50 border border-gray-600 rounded-xl p-4">
                              <textarea
                                {...register(`referenceSolution.${index}.completeCode`)}
                                placeholder={`Enter complete ${language} solution...`}
                                rows={8}
                                className="w-full bg-transparent text-gray-100 font-mono text-sm focus:outline-none resize-none"
                                style={{ fontFamily: 'Consolas, Monaco, "Courier New", monospace' }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mt-8"
          >
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-2xl hover:from-purple-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {isSubmitting ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating Problem...</span>
                </>
              ) : (
                <>
                  <FiSave className="w-5 h-5" />
                  <span>Create Problem</span>
                </>
              )}
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}

export default AdminCreate;



