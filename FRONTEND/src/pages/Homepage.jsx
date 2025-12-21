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
    tag: 'all',
  });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // ✅ Fetch problems & solved problems
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblems');
        setProblems(data?.problems || []);
      } catch (err) {
        console.error('Error fetching problems:', err);
        setProblems([]);
      }
    };

    const fetchSolved = async () => {
      try {
        const { data } = await axiosClient.get('/problem/solvedAllProblems');
        setSolvedProblems(data || []);
      } catch (err) {
        console.error('Error fetching solved problems:', err);
        setSolvedProblems([]);
      }
    };

    fetchProblems();
    if (user) fetchSolved();
  }, [user]);

  // ✅ Safe filtered array
  const filtered = Array.isArray(problems)
    ? problems.filter((p) => {
        const matchStatus =
          filters.status === 'all' ||
          (filters.status === 'solved' &&
            solvedProblems.some((s) => s._id === p._id));

        const matchDifficulty =
          filters.difficulty === 'all' ||
          p.difficulty === filters.difficulty;

        const matchTag =
          filters.tag === 'all' || p.tags?.includes(filters.tag);

        return matchStatus && matchDifficulty && matchTag;
      })
    : [];

  const handleLogout = () => {
    if (!window.confirm('Are you sure you want to logout?')) return;
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-black text-white">
      
      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full bg-black/50 backdrop-blur-md z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
          <NavLink to="/" className="text-2xl font-bold">
            CodeX
          </NavLink>

          <nav className="hidden md:flex items-center space-x-4">
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="bg-white/10 px-3 py-1 rounded-lg"
            >
              <option value="all">All</option>
              <option value="solved">Solved</option>
            </select>

            <select
              value={filters.difficulty}
              onChange={(e) =>
                setFilters({ ...filters, difficulty: e.target.value })
              }
              className="bg-white/10 px-3 py-1 rounded-lg"
            >
              <option value="all">All Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <select
              value={filters.tag}
              onChange={(e) =>
                setFilters({ ...filters, tag: e.target.value })
              }
              className="bg-white/10 px-3 py-1 rounded-lg"
            >
              <option value="all">All Tags</option>
              <option value="array">Array</option>
              <option value="linkedList">Linked List</option>
              <option value="graph">Graph</option>
              <option value="dp">DP</option>
            </select>
          </nav>

          <div className="flex items-center space-x-3">
            {user && (
              <>
                <span className="hidden md:block">{user.firstName}</span>
                <button
                  onClick={handleLogout}
                  className="p-2 bg-red-600 rounded-lg"
                >
                  <FiLogOut />
                </button>
              </>
            )}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden p-2 bg-white/10 rounded-lg"
            >
              {mobileNavOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-24 pb-12 text-center">
        <h1 className="text-4xl font-bold mb-2">
          Welcome, {user ? user.firstName : 'Guest'}!
        </h1>
        <p className="text-gray-300 mb-6">
          Solve problems, track progress, and level up your skills.
        </p>
      </section>

      {/* Problems */}
      <main className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-12">
        {filtered.map((p) => (
          <motion.div
            key={p._id}
            whileHover={{ scale: 1.03 }}
            className="bg-white/10 border border-white/20 rounded-2xl p-6"
          >
            <NavLink to={`/problem/${p._id}`}>
              <h3 className="text-xl font-semibold mb-2">{p.title}</h3>
            </NavLink>

            <div className="flex justify-between mb-4">
              <span className="px-2 py-1 rounded-lg bg-indigo-600/30 text-sm">
                {p.difficulty}
              </span>
              <span className="px-2 py-1 bg-indigo-600/30 rounded-lg text-sm">
                {p.tags}
              </span>
            </div>

            {solvedProblems.some((s) => s._id === p._id) && (
              <div className="flex items-center text-green-400">
                <FiCheckCircle className="mr-1" /> Solved
              </div>
            )}
          </motion.div>
        ))}
      </main>
    </div>
  );
}

export default Homepage;
