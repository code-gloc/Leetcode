import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import axiosClient from '../utils/axiosclient';
import { z } from 'zod';
import { useNavigate } from 'react-router';
import {
  FiEdit,
  FiSearch,
  FiFilter,
  FiAlertTriangle,
  FiX,
  FiLoader,
  FiCheckCircle,
  FiTag,
  FiFileText,
  FiCode,
    FiAlertCircle
} from 'react-icons/fi';

// Zod schema
const problemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1),
      output: z.string().min(1),
      explanation: z.string().min(1)
    })
  ).min(1),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1),
      output: z.string().min(1)
    })
  ).min(1),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string().min(1)
    })
  ).length(3),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string().min(1)
    })
  ).length(3)
});

const AdminUpdate = () => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const navigate = useNavigate();

  // React Hook Form
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: '',
      description: '',
      difficulty: 'easy',
      tags: 'array',
      visibleTestCases: [{ input: '', output: '', explanation: '' }],
      hiddenTestCases: [{ input: '', output: '' }],
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
  } = useFieldArray({ control, name: 'visibleTestCases' });
  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({ control, name: 'hiddenTestCases' });

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
    } catch {
      setError('Failed to fetch problems');
    } finally {
      setLoading(false);
    }
  };

  const filterProblems = () => {
    let list = problems.filter(p =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (difficultyFilter !== 'all') {
      list = list.filter(
        p => p.difficulty.toLowerCase() === difficultyFilter
      );
    }
    setFilteredProblems(list);
  };

  const selectForEdit = (problem) => {
    setSelectedProblem(problem);
    reset({
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty.toLowerCase(),
      tags: problem.tags,
      visibleTestCases: problem.visibleTestCases,
      hiddenTestCases: problem.hiddenTestCases,
      startCode: problem.startCode,
      referenceSolution: problem.referenceSolution
    });
  };

  const onSubmit = async (data) => {
    if (!selectedProblem) return;
    if(!window.confirm("Are you sure you want to update this problem?")) return;
    try {
      await axiosClient.patch(`/problem/update/${selectedProblem._id}`, data);
      navigate('/');
    } catch {
      setError('Failed to update problem');
    }
  };

  const getDifficultyColor = (d) => {
    switch (d) {
      case 'easy': return 'text-green-400 bg-green-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'hard': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-purple-900">
        <FiLoader className="text-white text-4xl animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Search & Filter */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-xl grid md:grid-cols-2 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search problems..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400"
            />
          </div>
          <div className="relative">
            <FiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={difficultyFilter}
              onChange={e => setDifficultyFilter(e.target.value)}
              className="w-full pl-12 py-3 bg-white/5 border border-white/20 rounded-xl text-white"
            >
              <option value="all">All</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Problems List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems.map(p => (
            <motion.div
              key={p._id}
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-xl cursor-pointer"
              onClick={() => selectForEdit(p)}
            >
              <h3 className="text-white font-semibold text-lg">{p.title}</h3>
              <span className={`mt-2 inline-block px-3 py-1 rounded-full text-sm ${getDifficultyColor(p.difficulty)}`}>
                {p.difficulty}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Edit Form */}
        {selectedProblem && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 border border-white/20 rounded-3xl p-8 backdrop-blur-xl"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Edit "{selectedProblem.title}"
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-2">
                <label className="text-gray-300">Title</label>
                <input
                  {...register('title')}
                  className="w-full px-4 py-3 bg-white/5 text-white rounded-xl border border-white/20"
                />
                {errors.title && <p className="text-red-400">{errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-gray-300">Description</label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 text-white rounded-xl border border-white/20"
                />
                {errors.description && <p className="text-red-400">{errors.description.message}</p>}
              </div>
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <label className="text-gray-300">Difficulty</label>
                  <select {...register('difficulty')} className="w-full px-4 py-3 bg-white/5 text-white rounded-xl border border-white/20">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-gray-300">Tag</label>
                  <select {...register('tags')} className="w-full px-4 py-3 bg-white/5 text-white rounded-xl border border-white/20">
                    <option value="array">Array</option>
                    <option value="linkedList">Linked List</option>
                    <option value="graph">Graph</option>
                    <option value="dp">Dynamic Programming</option>
                  </select>
                </div>
              </div>

              {/* Test Cases */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Visible Test Cases</h3>
                {visibleFields.map((field, idx) => (
                  <div key={field.id} className="bg-white/5 p-4 rounded-xl border border-white/20">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">Case {idx + 1}</span>
                      <button type="button" onClick={() => removeVisible(idx)} className="text-red-400">Remove</button>
                    </div>
                    <input {...register(`visibleTestCases.${idx}.input`)} placeholder="Input" className="w-full mb-2 px-3 py-2 bg-white/10 rounded-lg text-white" />
                    <input {...register(`visibleTestCases.${idx}.output`)} placeholder="Output" className="w-full mb-2 px-3 py-2 bg-white/10 rounded-lg text-white" />
                    <textarea {...register(`visibleTestCases.${idx}.explanation`)} placeholder="Explanation" rows={2} className="w-full px-3 py-2 bg-white/10 rounded-lg text-white" />
                  </div>
                ))}
                <button type="button" onClick={() => appendVisible({ input: '', output: '', explanation: '' })} className="flex items-center space-x-2 px-4 py-2 bg-green-500 rounded-xl text-white">
                  <FiCheckCircle /> Add Visible
                </button>
              </div>
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Hidden Test Cases</h3>
                {hiddenFields.map((field, idx) => (
                  <div key={field.id} className="bg-white/5 p-4 rounded-xl border border-white/20">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">Case {idx + 1}</span>
                      <button type="button" onClick={() => removeHidden(idx)} className="text-red-400">Remove</button>
                    </div>
                    <input {...register(`hiddenTestCases.${idx}.input`)} placeholder="Input" className="w-full mb-2 px-3 py-2 bg-white/10 rounded-lg text-white" />
                    <input {...register(`hiddenTestCases.${idx}.output`)} placeholder="Output" className="w-full px-3 py-2 bg-white/10 rounded-lg text-white" />
                  </div>
                ))}
                <button type="button" onClick={() => appendHidden({ input: '', output: '' })} className="flex items-center space-x-2 px-4 py-2 bg-orange-500 rounded-xl text-white">
                  <FiAlertCircle /> Add Hidden
                </button>
              </div>

              {/* Code Templates */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Code Templates</h3>
                {['C++', 'Java', 'JavaScript'].map((lang, i) => (
                  <div key={lang} className="bg-white/5 p-4 rounded-xl border border-white/20">
                    <div className="flex items-center mb-3 text-white">
                      <FiCode className="mr-2" /> {lang}
                    </div>
                    <textarea {...register(`startCode.${i}.initialCode`)} rows={4} placeholder="Starter Code" className="w-full mb-2 px-3 py-2 bg-white/10 rounded-lg text-white font-mono" />
                    <textarea {...register(`referenceSolution.${i}.completeCode`)} rows={4} placeholder="Solution Code" className="w-full px-3 py-2 bg-white/10 rounded-lg text-white font-mono" />
                  </div>
                ))}
              </div>

              {/* Submit */}
              <button type="submit" disabled={isSubmitting} className="w-full flex justify-center items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl text-white font-semibold">
                {isSubmitting ? <FiLoader className="animate-spin" /> : <FiEdit />}
                <span>{isSubmitting ? 'Updating...' : 'Update Problem'}</span>
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminUpdate;
