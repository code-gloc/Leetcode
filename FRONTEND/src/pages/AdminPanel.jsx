import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router';
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSettings,
  FiCode,
  FiDatabase,
  FiActivity,
  FiUsers,
  FiBarChart,
  FiStar,
  FiVideo
} from 'react-icons/fi';

function AdminPanel() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add new coding challenges to expand your platform',
      icon: FiPlus,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/10 to-emerald-500/10',
      route: '/admin/create',
      stats: '150+ Created',
      iconBg: 'bg-green-500/20',
      borderColor: 'border-green-500/30'
    },
    {
      id: 'update',
      title: 'Update Problem',
      description: 'Edit and refine existing problems for better clarity',
      icon: FiEdit,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/10',
      route: '/admin/update',
      stats: '85 Updated',
      iconBg: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30'
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Remove outdated or duplicate problems safely',
      icon: FiTrash2,
      gradient: 'from-red-500 to-pink-500',
      bgGradient: 'from-red-500/10 to-pink-500/10',
      route: '/admin/delete',
      stats: '12 Removed',
      iconBg: 'bg-red-500/20',
      borderColor: 'border-red-500/30'
    },

    {
      id: 'video',
      title: 'Manage Videos',
      description: 'Upload, update, or delete video solutions',
      icon: FiVideo,
      gradient: 'from-red-500 to-pink-500',
      bgGradient: 'from-red-500/10 to-pink-500/10',
      route: '/admin/video',
      stats: '12 Videos',
      iconBg: 'bg-red-500/20',
      borderColor: 'border-red-500/30'
    }
  ];

  const quickStats = [
    { label: 'Total Problems', value: '247', icon: FiCode, color: 'text-purple-400' },
    { label: 'Active Users', value: '1.2K', icon: FiUsers, color: 'text-green-400' },
    { label: 'Daily Submissions', value: '450', icon: FiActivity, color: 'text-blue-400' },
    { label: 'Success Rate', value: '73%', icon: FiBarChart, color: 'text-orange-400' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Background Effects */}
      {/* <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div> */}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-3xl flex items-center justify-center mr-6 shadow-2xl">
              <FiSettings className="text-white text-3xl animate-pulse" />
            </div>
            <div className="text-left">
              <h1 className="text-5xl font-bold text-white mb-2">Admin Panel</h1>
              <p className="text-gray-300 text-xl">Manage and organize your coding platform</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickStats.map((stat, idx) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + idx * 0.1 }} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300">
              <stat.icon className={`${stat.color} text-3xl mx-auto mb-3`} />
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Admin Options */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {adminOptions.map((option, idx) => {
            const IconComp = option.icon;
            return (
              <motion.div key={option.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + idx * 0.1, type: 'spring', stiffness: 100 }} onHoverStart={() => setHoveredCard(option.id)} onHoverEnd={() => setHoveredCard(null)} className="group relative">
                <div className={`backdrop-blur-xl bg-white/10 border ${option.borderColor} rounded-3xl p-8 transition-all duration-500 hover:bg-white/20 hover:border-white/40 hover:shadow-2xl hover:shadow-purple-500/20`}>
                  {/* Hover Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${option.bgGradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                  <div className="relative z-10">
                    {/* Card Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-16 h-16 ${option.iconBg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <IconComp className="text-white text-2xl" />
                      </div>
                      <div className="text-right">
                        <div className="text-gray-400 text-sm">{option.stats}</div>
                        <FiStar className="text-yellow-400 text-lg inline-block ml-2" />
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                        {option.title}
                      </h2>
                      <p className="text-gray-300 leading-relaxed">{option.description}</p>
                    </div>

                    {/* Action Button */}
                    <NavLink to={option.route} className={`group/btn w-full inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r ${option.gradient} text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105`}>
                      <span className="mr-2">{option.title}</span>
                      <IconComp className="text-lg group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </NavLink>
                  </div>

                  {/* Animated Border Glow */}
                  <motion.div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${option.gradient} opacity-0 group-hover:opacity-20`} initial={{ scale: 0.8 }} animate={{ scale: hoveredCard === option.id ? 1.02 : 0.8, opacity: hoveredCard === option.id ? 0.2 : 0 }} transition={{ duration: 0.3 }} style={{ filter: 'blur(20px)' }} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Platform Overview */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center mb-6">
            <FiDatabase className="text-purple-400 text-2xl mr-3" />
            <h2 className="text-2xl font-bold text-white">Platform Overview</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FiCode className="text-green-400 text-xl" />
              </div>
              <h3 className="text-white font-semibold mb-2">Problem Library</h3>
              <p className="text-gray-400 text-sm">Comprehensive collection of coding challenges across all difficulty levels</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FiUsers className="text-blue-400 text-xl" />
              </div>
              <h3 className="text-white font-semibold mb-2">User Management</h3>
              <p className="text-gray-400 text-sm">Track user progress, submissions, and performance analytics</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FiActivity className="text-orange-400 text-xl" />
              </div>
              <h3 className="text-white font-semibold mb-2">Real-time Analytics</h3>
              <p className="text-gray-400 text-sm">Monitor platform activity and user engagement metrics</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AdminPanel;
