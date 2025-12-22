import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  FiCode,
  FiPlay,
  FiGithub,
  FiYoutube,
  FiInstagram,
  FiStar,
  FiAward,
  FiUsers,
  FiMail,
  FiMenu,
  FiX,
} from "react-icons/fi";

// Merge Sort Algorithm lines for animated code block
const mergeSortCode = [
  "def merge_sort(arr):",
  "    if len(arr) > 1:",
  "        mid = len(arr) // 2",
  "        L = arr[:mid]",
  "        R = arr[mid:]",
  "        merge_sort(L)",
  "        merge_sort(R)",
  "        i = j = k = 0",
  "        while i < len(L) and j < len(R):",
  "            if L[i] < R[j]:",
  "                arr[k] = L[i]",
  "                i += 1",
  "            else:",
  "                arr[k] = R[j]",
  "                j += 1",
  "            k += 1",
  "        while i < len(L):",
  "            arr[k] = L[i]",
  "            i += 1",
  "            k += 1",
  "        while j < len(R):",
  "            arr[k] = R[j]",
  "            j += 1",
  "            k += 1",
];

function AnimatedCodeBlock({
  height = 320,
  width = "100%",
  lines = mergeSortCode,
}) {
  const [start, setStart] = useState(0);
  const visibleLines = 10;

  useEffect(() => {
    const interval = setInterval(() => {
      setStart((s) => (s < lines.length - visibleLines ? s + 1 : 0));
    }, 900);
    return () => clearInterval(interval);
  }, [lines.length]);

  return (
    <div
      className="relative w-full max-w-md rounded-2xl shadow-2xl bg-gradient-to-br from-[#17172b] to-[#1b1633] border border-purple-900 p-0.5"
      style={{ height }}
    >
      <div className="bg-[#17172b] rounded-2xl h-full w-full flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-[#232342] border-b border-purple-900 rounded-t-2xl">
          <span className="w-3 h-3 bg-red-400 rounded-full"></span>
          <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
          <span className="w-3 h-3 bg-green-400 rounded-full"></span>
          <span className="ml-4 text-[10px] sm:text-xs text-white/80">
            MergeSort.py
          </span>
        </div>
        <pre className="flex-1 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-mono text-left text-green-300 overflow-hidden select-none">
          {lines.slice(start, start + visibleLines).map((line, i) => (
            <div key={i} className="transition-all">
              {line}
            </div>
          ))}
        </pre>
        <div className="absolute top-2 sm:top-4 right-4 sm:right-6 text-green-400 text-[10px] sm:text-xs font-bold flex items-center gap-2">
          <span className="animate-pulse">&#9679;</span>
          Live Coding
        </div>
      </div>
    </div>
  );
}

const stats = [
  { number: "20K+", label: "Motivated Coders" },
  { number: "2K+", label: "Challenging Problems" },
  { number: "900+", label: "Video Editorials" },
  { number: "120+", label: "Monthly Contests" },
];

const features = [
  {
    icon: <FiCode className="w-8 h-8" />,
    title: "Structured Coding Practice",
    description:
      "Solve curated coding challenges, grow your skills, and compete globally.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: <FiPlay className="w-8 h-8" />,
    title: "Editorial Video Explanations",
    description:
      "Unlock video solutions, deep concepts, and peer-reviewed strategies.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: <FiStar className="w-8 h-8" />,
    title: "Personal Progress Tracker",
    description:
      "See your journey visualized, set goals, and celebrate milestones.",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: <FiAward className="w-8 h-8" />,
    title: "Live Coding Contests",
    description:
      "Join regular contests, climb the leaderboard, and win prizes.",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: <FiUsers className="w-8 h-8" />,
    title: "Collaborative Community",
    description:
      "Ask questions, share insights, and join peer learning with global devs.",
    gradient: "from-green-500 to-emerald-500",
  },
];

const courseCards = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    title: "Fullstack Coding Bootcamp",
    description: "Intensive hands-on coding with real projects and devops.",
    level: "Beginner to Advanced",
    lectures: 80,
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    title: "DSA Mastery Series",
    description: "Top DSA challenges and optimized approaches.",
    level: "Intermediate",
    lectures: 60,
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    title: "System Design Crash Course",
    description: "Design for interviews & architecture.",
    level: "Advanced",
    lectures: 40,
  },
];

const testimonials = [
  {
    name: "Anya Gupta",
    role: "Placed at FAANG",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
    content:
      "This coding platform made me believe that consistent effort wins. Video editorials and contest atmosphere kept me motivated!",
  },
  {
    name: "Rohan Singh",
    role: "College Topper",
    image: "https://randomuser.me/api/portraits/men/28.jpg",
    content:
      "Contests are honestly thrilling here—my rank went from average to top 10% in just two months of using this site.",
  },
  {
    name: "Lina Park",
    role: "Developer & Mentor",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    content:
      "The learning community never lets you get stuck. Everyone lifts each other up. The solution videos are crystal clear.",
  },
];

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleProblemsClick = () => {
    if (isAuthenticated) {
      navigate("/homepage");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 bg-neutral-900/90 border-b border-purple-800/5 shadow-lg transition-all duration-300 ${
          isScrolled ? "backdrop-blur-lg" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-5">
          <NavLink
            to="/"
            className="flex items-center gap-2 text-white font-extrabold text-lg sm:text-xl tracking-tight"
          >
            <FiCode className="text-purple-400" />
            CodeX
          </NavLink>
          <ul className="hidden md:flex items-center gap-6 text-white/80 font-semibold text-sm lg:text-lg">
            <li>
              <button
                onClick={handleProblemsClick}
                className="bg-transparent border-none cursor-pointer text-inherit hover:text-purple-400 font-semibold"
              >
                Problems
              </button>
            </li>
            <li>
              <NavLink to="/contests" className="hover:text-purple-400">
                Contests
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className="hover:text-purple-400">
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className="hover:text-purple-400">
                Contact
              </NavLink>
            </li>
          </ul>
          <div className="hidden md:flex gap-3 lg:gap-4">
            <NavLink
              to="/login"
              className="px-4 py-2 rounded-xl border hover:border-purple-400 font-bold text-white/90 hover:text-purple-400 transition text-sm lg:text-base"
            >
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className="px-4 py-2 rounded-xl bg-purple-500 font-bold text-white hover:bg-purple-600 transition text-sm lg:text-base"
            >
              Sign Up
            </NavLink>
          </div>
          <button
            onClick={() => setIsMenuOpen((v) => !v)}
            className="md:hidden text-white p-2"
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
        {isMenuOpen && (
          <ul className="md:hidden flex flex-col gap-1 pb-4 px-4 sm:px-6 bg-neutral-900/95 mt-1 rounded-b-xl text-sm">
            <li>
              <NavLink to="/" className="block py-2">
                Home
              </NavLink>
            </li>
            <li>
              <button
                onClick={handleProblemsClick}
                className="block py-2 text-left w-full bg-transparent border-none text-white hover:text-purple-400 cursor-pointer"
              >
                Problems
              </button>
            </li>
            <li>
              <NavLink to="/contests" className="block py-2">
                Contests
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className="block py-2">
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className="block py-2">
                Contact
              </NavLink>
            </li>
            <li className="pt-2">
              <NavLink to="/login" className="block py-2">
                Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/signup" className="block py-2">
                Sign Up
              </NavLink>
            </li>
          </ul>
        )}
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto pt-28 sm:pt-32 md:pt-36 pb-12 sm:pb-20 px-4 sm:px-6 gap-8">
        <div className="w-full md:max-w-xl space-y-5 sm:space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            Be a part of our <span className="text-purple-400">Future</span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg">
            Discover your full potential. Unlock video editorial for every
            problem. Challenge, compete, and succeed with our vibrant platform
            made for coders like you.
          </p>
          <div className="flex flex-wrap gap-3 mt-4 sm:mt-6">
            <NavLink
              to="/signup"
              className="rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 bg-purple-600 hover:bg-purple-700 font-semibold transition text-sm sm:text-lg"
            >
              Start Free Learning
            </NavLink>
            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 font-semibold flex items-center gap-2 text-sm sm:text-lg"
            >
              <FiPlay /> Watch Demo
            </a>
          </div>
          <div className="flex gap-4 mt-6">
            <a
              href="https://github.com/"
              aria-label="GitHub"
              className="hover:text-purple-400"
            >
              <FiGithub className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
            <a
              href="https://youtube.com"
              aria-label="YouTube"
              className="hover:text-purple-400"
            >
              <FiYoutube className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
            <a
              href="https://instagram.com"
              aria-label="Instagram"
              className="hover:text-purple-400"
            >
              <FiInstagram className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
          </div>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 sm:gap-8 mt-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-xl sm:text-2xl font-bold text-purple-400">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm sm:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full flex-1 flex justify-center mb-6 md:mb-0">
          <AnimatedCodeBlock />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-neutral-900 py-14 sm:py-20 px-4 sm:px-6" id="courses">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 sm:mb-12 text-center">
          Train, Compete, Succeed—
          <span className="text-purple-400"> Key Features</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`p-6 sm:p-8 rounded-2xl shadow-xl bg-black/80 border-l-4 ${
                idx % 2 === 0 ? "border-purple-500" : "border-cyan-400"
              } hover:scale-[1.02] sm:hover:scale-105 transition`}
            >
              <div
                className={`bg-gradient-to-br ${feature.gradient} rounded-full p-3 mb-4 sm:mb-5 w-fit`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-300 text-sm sm:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Premium Courses Showcase */}
      <section className="py-14 sm:py-20 bg-neutral-950 px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-8 text-center">
          Deep Dive Courses
        </h2>
        <p className="text-center text-gray-400 mb-8 sm:mb-12 text-sm sm:text-base max-w-2xl mx-auto">
          Go beyond the basics: exclusive editorial explanations, in-depth
          system design & regular coding contests.
        </p>
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          {courseCards.map((course) => (
            <div
              key={course.id}
              className="rounded-2xl bg-neutral-900 border border-purple-600/10 w-full max-w-xs p-4 sm:p-5 flex flex-col transition hover:scale-[1.02] sm:hover:scale-105 hover:shadow-lg"
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-32 sm:h-36 object-cover rounded-xl mb-3"
              />
              <div className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 text-white">
                {course.title}
              </div>
              <div className="text-gray-400 text-sm sm:text-base mb-2">
                {course.description}
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-purple-400 font-bold">
                {course.level} · {course.lectures} lectures
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Inspirational/Mentor Section */}
      <section className="py-14 sm:py-20 bg-black px-4 sm:px-6 flex flex-col md:flex-row items-center gap-10 sm:gap-16 max-w-7xl mx-auto">
        <div className="flex-1 w-full">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            Unlock Your Career with{" "}
            <span className="text-purple-400">Motivation & Guidance</span>
          </h2>
          <ul className="text-base sm:text-lg text-gray-300 space-y-2 sm:space-y-3 mb-3 sm:mb-4">
            <li>🚀 1:1 Mentorship and doubt support for any problem</li>
            <li>🧑‍💻 Weekly challenges and leaderboard ranking</li>
            <li>🌎 Connect with learners and experts globally</li>
            <li>🏆 Build portfolio, get project reviews & referrals</li>
          </ul>
        </div>
        <div className="flex-1 w-full flex flex-wrap justify-center items-center gap-4 sm:gap-5">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/4f/Csharp_Logo.png"
            alt="C#"
            className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"
            alt="JS"
            className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg"
            alt="Cpp"
            className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/Java_logo.png"
            alt="Java"
            className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
            alt="React"
            className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl"
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-14 sm:py-20 bg-neutral-900 px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-10 sm:mb-16 text-center">
          Loved by Coders Everywhere
        </h2>
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-xl bg-neutral-950 border border-purple-700/10 p-6 sm:p-8 w-full max-w-xs flex flex-col items-center hover:scale-[1.02] sm:hover:scale-105 transition"
            >
              <img
                src={t.image}
                alt={t.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full mb-3"
              />
              <div className="text-base sm:text-lg font-semibold text-purple-400 pb-1">
                {t.name}
              </div>
              <div className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
                {t.role}
              </div>
              <p className="text-gray-300 text-sm sm:text-base italic mb-3 sm:mb-4 text-center">
                "{t.content}"
              </p>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 sm:py-24 bg-neutral-950 px-4 sm:px-6 flex flex-col md:flex-row items-start md:items-center gap-10 sm:gap-16 max-w-7xl mx-auto">
        <div className="flex-1 max-w-lg mx-auto md:mx-0 w-full">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Get In <span className="text-purple-400">Touch</span>
          </h2>
          <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
            Doubts, suggestions or technical questions? Reach out and our team
            will respond!
          </p>
          <form className="space-y-4 sm:space-y-5">
            <input
              placeholder="Full Name"
              className="w-full p-3 rounded bg-black/60 text-white border border-gray-600 text-sm sm:text-base"
              required
            />
            <input
              placeholder="Email Address"
              className="w-full p-3 rounded bg-black/60 text-white border border-gray-600 text-sm sm:text-base"
              required
            />
            <input
              placeholder="Subject"
              className="w-full p-3 rounded bg-black/60 text-white border border-gray-600 text-sm sm:text-base"
              required
            />
            <textarea
              placeholder="Message"
              className="w-full p-3 rounded bg-black/60 text-white border border-gray-600 min-h-[120px] text-sm sm:text-base"
              required
            />
            <button
              type="submit"
              className="w-full py-3 bg-purple-600 font-bold rounded-xl hover:bg-purple-700 text-white transition text-sm sm:text-base"
            >
              Send Message
            </button>
          </form>
        </div>
        <div className="flex-1 w-full flex flex-col items-center gap-3 sm:gap-4">
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/contact-us-3488384-2925974.png"
            className="w-56 sm:w-72"
            alt="Contact Visual"
          />
          <span className="mt-2 sm:mt-4 bg-green-800 text-green-300 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold shadow">
            Quick Response
          </span>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-950 text-gray-400 py-10 sm:py-12 pt-16 sm:pt-24 border-t border-purple-600/30 mt-4 sm:mt-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-16 px-4 sm:px-6">
          <div>
            <div className="text-xl sm:text-2xl font-bold mb-2 text-purple-400">
              CodeXpand
            </div>
            <div className="text-sm sm:text-base">
              Empowering coders for a better future through practice, contests,
              and community support.
            </div>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://github.com/"
                className="hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiGithub className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com/"
                className="hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiYoutube className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/"
                className="hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiInstagram className="w-5 h-5" />
              </a>
              <a
                href="mailto:support@codexpand.com"
                className="hover:text-white"
              >
                <FiMail className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <div className="font-bold text-white text-sm sm:text-base">
              Quick Links
            </div>
            <ul className="space-y-1 mt-2 text-sm sm:text-base">
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li>
                <NavLink to="/about">About Us</NavLink>
              </li>
              <li>
                <NavLink to="/problems">Problem</NavLink>
              </li>
              <li>
                <NavLink to="/contests">Contests</NavLink>
              </li>
              <li>
                <NavLink to="/contact">Contact Us</NavLink>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-bold text-white text-sm sm:text-base">
              Company
            </div>
            <ul className="space-y-1 mt-2 text-sm sm:text-base">
              <li>
                <NavLink to="/terms">Terms & Conditions</NavLink>
              </li>
              <li>
                <NavLink to="/privacy">Privacy Policy</NavLink>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-bold text-white text-sm sm:text-base">
              Stay Connected
            </div>
            <div className="max-w-xs text-xs sm:text-sm mt-2">
              Don&apos;t let your dreams stay dreams. Start building your skills
              and your future—today.
            </div>
          </div>
        </div>
        <div className="mt-8 sm:mt-12 border-t border-purple-600/30 pt-4 sm:pt-6 text-center text-[10px] sm:text-xs text-gray-600">
          &copy; {new Date().getFullYear()} CodeXpand | All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
