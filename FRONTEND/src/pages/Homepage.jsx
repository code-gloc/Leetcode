import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import axiosClient from '../utils/axiosclient.js';
import { logoutUser } from '../authSlice';
import {
  FiMenu,
  FiX,
  FiLogOut,
  FiCheckCircle,
  FiFilter,
  FiSearch
} from 'react-icons/fi';

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    difficulty: 'all',
    tag: 'all'
  });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblems');
        setProblems(data.problems);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchSolved = async () => {
      try {
        const { data } = await axiosClient.get('/problem/solvedAllProblems');
        setSolvedProblems(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProblems();
    if (user) fetchSolved();
  }, [user]);

  const handleLogout = () => {
    if(!window.confirm("Are you sure you want to logout?")) return;
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

  const filtered = problems.filter((p) => {
    const matchStatus =
      filters.status === 'all' ||
      (filters.status === 'solved' && solvedProblems.some((s) => s._id === p._id));
    const matchDiff = filters.difficulty === 'all' || p.difficulty === filters.difficulty;
    const matchTag = filters.tag === 'all' || p.tags === filters.tag;
    return matchStatus && matchDiff && matchTag;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-black text-white">
      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full bg-black/50 backdrop-blur-md z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
          <NavLink to="/" className="text-2xl font-bold">
            CodeX
          </NavLink>
          <nav className="hidden md:flex items-center space-x-6">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="bg-white/10 px-3 py-1 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All</option>
              <option value="solved">Solved</option>
            </select>
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
              className="bg-white/10 px-3 py-1 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <select
              value={filters.tag}
              onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
              className="bg-white/10 px-3 py-1 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Tags</option>
              <option value="array">Array</option>
              <option value="linkedList">Linked List</option>
              <option value="graph">Graph</option>
              <option value="dp">DP</option>
            </select>
          </nav>
          <div className="flex items-center space-x-4">
            {user && (
              <div className="hidden md:flex items-center space-x-2">
                <span>{user.firstName}</span>
                <button onClick={handleLogout} className="p-2 bg-red-600 rounded-lg">
                  <FiLogOut />
                </button>
                {user.role === 'admin' && (
                  <NavLink to="/admin" className="p-2 bg-indigo-600 rounded-lg">
                    Admin
                  </NavLink>
                )}
              </div>
            )}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden p-2 bg-white/10 rounded-lg"
            >
              {mobileNavOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
        {/* Mobile Filters */}
        {mobileNavOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            className="md:hidden bg-black/60 backdrop-blur-md overflow-hidden"
          >
            <div className="flex flex-col space-y-2 p-4">
              <div className="flex items-center space-x-2">
                <FiSearch />
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="flex-1 bg-white/10 px-3 py-1 rounded-lg"
                >
                  <option value="all">All</option>
                  <option value="solved">Solved</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <FiFilter />
                <select
                  value={filters.difficulty}
                  onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                  className="flex-1 bg-white/10 px-3 py-1 rounded-lg"
                >
                  <option value="all">All Difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <FiFilter />
                <select
                  value={filters.tag}
                  onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
                  className="flex-1 bg-white/10 px-3 py-1 rounded-lg"
                >
                  <option value="all">All Tags</option>
                  <option value="array">Array</option>
                  <option value="linkedList">Linked List</option>
                  <option value="graph">Graph</option>
                  <option value="dp">DP</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero / Stats */}
      <section className="pt-24 pb-12 text-center">
        <h1 className="text-4xl font-bold mb-2">Welcome, {user ? user.firstName : 'Guest'}!</h1>
        <p className="text-gray-300 mb-6">Solve problems, track progress, and level up your skills.</p>
        <div className="flex justify-center space-x-6">
          <motion.div className="bg-indigo-600/20 backdrop-blur-md rounded-2xl p-4 w-40">
            <h2 className="text-2xl font-semibold">{problems.length}</h2>
            <p className="text-gray-300">Total Problems</p>
          </motion.div>
          <motion.div className="bg-green-600/20 backdrop-blur-md rounded-2xl p-4 w-40">
            <h2 className="text-2xl font-semibold">{solvedProblems.length}</h2>
            <p className="text-gray-300">Solved</p>
          </motion.div>
        </div>
      </section>

      {/* Problem Cards */}
      <main className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-12">
        {filtered.map((p) => (
          <motion.div
            key={p._id}
            whileHover={{ scale: 1.03 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex flex-col justify-between"
          >
            <NavLink to={`/problem/${p._id}`}>
              <h3 className="text-xl font-semibold mb-2">{p.title}</h3>
            </NavLink>
            <div className="flex items-center justify-between mb-4">
              <span className={`px-2 py-1 rounded-lg text-sm ${
                p.difficulty === 'easy'
                  ? 'bg-green-600/30'
                  : p.difficulty === 'medium'
                  ? 'bg-yellow-600/30'
                  : 'bg-red-600/30'
              }`}>
                {p.difficulty}
              </span>
              <span className="px-2 py-1 bg-indigo-600/30 rounded-lg text-sm">{p.tags}</span>
            </div>
            {solvedProblems.some((s) => s._id === p._id) ? (
              <div className="self-end px-3 py-1 bg-green-500 rounded-full inline-flex items-center space-x-1">
                <FiCheckCircle />
                <span>Solved</span>
              </div>
            ) : (
              <div className="h-6" />
            )}
          </motion.div>
        ))}
      </main>
    </div>
  );
}

export default Homepage;
