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

  // Fetch problems & solved problems
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

  // Safe filtered array
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
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          <NavLink to="/" className="text-xl sm:text-2xl font-bold">
            CodeX
          </NavLink>

          {/* Desktop filters */}
          <nav className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="bg-white/10 px-3 py-1 rounded-lg text-sm"
            >
              <option value="all">All</option>
              <option value="solved">Solved</option>
            </select>

            <select
              value={filters.difficulty}
              onChange={(e) =>
                setFilters({ ...filters, difficulty: e.target.value })
              }
              className="bg-white/10 px-3 py-1 rounded-lg text-sm"
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
              className="bg-white/10 px-3 py-1 rounded-lg text-sm"
            >
              <option value="all">All Tags</option>
              <option value="array">Array</option>
              <option value="linkedList">Linked List</option>
              <option value="graph">Graph</option>
              <option value="dp">DP</option>
            </select>
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {user && (
              <>
                <span className="hidden sm:inline-block text-sm sm:text-base">
                  {user.firstName}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 bg-red-600 rounded-lg text-sm"
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

        {/* Mobile filters drawer */}
        {mobileNavOpen && (
          <div className="md:hidden border-t border-white/10 bg-black/80">
            <div className="max-w-6xl mx-auto px-4 py-3 grid grid-cols-1 gap-3">
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="bg-white/10 px-3 py-2 rounded-lg text-sm"
              >
                <option value="all">All</option>
                <option value="solved">Solved</option>
              </select>

              <select
                value={filters.difficulty}
                onChange={(e) =>
                  setFilters({ ...filters, difficulty: e.target.value })
                }
                className="bg-white/10 px-3 py-2 rounded-lg text-sm"
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
                className="bg-white/10 px-3 py-2 rounded-lg text-sm"
              >
                <option value="all">All Tags</option>
                <option value="array">Array</option>
                <option value="linkedList">Linked List</option>
                <option value="graph">Graph</option>
                <option value="dp">DP</option>
              </select>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="pt-24 sm:pt-28 pb-8 sm:pb-12 text-center px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
          Welcome, {user ? user.firstName : 'Guest'}!
        </h1>
        <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto">
          Solve problems, track progress, and level up your skills.
        </p>
      </section>

      {/* Problems */}
      <main className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map((p) => (
            <motion.div
              key={p._id}
              whileHover={{ scale: 1.03 }}
              className="bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6"
            >
              <NavLink to={`/problem/${p._id}`}>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  {p.title}
                </h3>
              </NavLink>

              <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                <span className="px-2 py-1 rounded-lg bg-indigo-600/30 text-xs sm:text-sm">
                  {p.difficulty}
                </span>
                <span className="px-2 py-1 bg-indigo-600/30 rounded-lg text-xs sm:text-sm truncate max-w-[60%] text-right">
                  {Array.isArray(p.tags) ? p.tags.join(', ') : p.tags}
                </span>
              </div>

              {solvedProblems.some((s) => s._id === p._id) && (
                <div className="flex items-center text-green-400 text-sm mt-1">
                  <FiCheckCircle className="mr-1" /> Solved
                </div>
              )}
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full text-center text-gray-300 text-sm sm:text-base py-8">
              No problems found for the selected filters.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Homepage;
