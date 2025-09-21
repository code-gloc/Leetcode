import { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import axiosClient from "../utils/axiosClient";
import { 
  FiCode, 
  FiPlay, 
  FiCheck, 
  FiX, 
  FiClock, 
  FiZap, 
  FiTrendingUp,
  FiBook,
  FiEye,
  FiSettings,
  FiMaximize2,
  FiMinimize2,
  FiRefreshCw,
  FiAward,
  FiStar,
  FiSave,
  FiDownload,
  FiCopy,
  FiTerminal,
  FiUser,
  FiTarget,
  FiHelpCircle,
  FiChevronDown,
  FiChevronRight,
  FiInfo,
  FiAlertCircle,
  FiCheckCircle,
  FiHeart,
  FiShare,
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiFacebook,
  FiSun,
  FiMoon,
  FiMic,
  FiMicOff,
  FiVolume2,
  FiVolumeX,
  FiWifi,
  FiWifiOff,
  FiCloud,
  FiCloudOff,
  FiDatabase,
  FiCpu,
  FiActivity,
  FiMonitor,
  FiCommand
} from 'react-icons/fi';

// Enhanced Fireworks with particles and sound effects
const Fireworks = ({ show, onComplete }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Enhanced fireworks with more particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${10 + i * 8}%`,
            top: `${20 + (i % 4) * 15}%`,
          }}
          initial={{ scale: 0, rotate: 0 }}
          animate={{ 
            scale: [0, 2.5, 0],
            rotate: [0, 360, 720],
            opacity: [0, 1, 0.8, 0]
          }}
          transition={{ 
            duration: 3,
            delay: i * 0.1,
            ease: "easeOut"
          }}
        >
          <div className="relative">
            {[...Array(16)].map((_, j) => (
              <motion.div
                key={j}
                className="absolute w-3 h-3 rounded-full shadow-lg"
                style={{
                  background: `hsl(${j * 22.5 + i * 30}, 100%, ${60 + Math.random() * 30}%)`,
                  boxShadow: `0 0 20px hsl(${j * 22.5 + i * 30}, 100%, 60%)`
                }}
                initial={{ x: 0, y: 0, scale: 0 }}
                animate={{
                  x: Math.cos(j * 22.5 * Math.PI / 180) * (60 + Math.random() * 40),
                  y: Math.sin(j * 22.5 * Math.PI / 180) * (60 + Math.random() * 40),
                  opacity: [1, 0.8, 0],
                  scale: [0, 1.5, 0.5]
                }}
                transition={{ 
                  duration: 2.5, 
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      ))}
      
      {/* Confetti rain */}
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={`confetti-${i}`}
          className="absolute w-2 h-4 rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            background: `hsl(${Math.random() * 360}, 80%, 60%)`
          }}
          initial={{ y: -20, rotate: 0, opacity: 1 }}
          animate={{
            y: window.innerHeight + 50,
            rotate: 720,
            x: Math.sin(i) * 100,
            opacity: [1, 0.8, 0]
          }}
          transition={{ 
            duration: 4 + Math.random() * 2,
            delay: Math.random() * 2,
            ease: "easeIn"
          }}
        />
      ))}

      {/* Success message with enhanced styling */}
      <motion.div
        initial={{ scale: 0, opacity: 0, y: -100 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0, opacity: 0, y: 100 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <div className="bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 text-white px-12 py-6 rounded-3xl font-bold text-3xl shadow-2xl border-4 border-white/20 backdrop-blur-lg">
          <div className="flex items-center space-x-3">
            <FiAward className="w-8 h-8" />
            <span>🎉 Solution Accepted! 🎉</span>
            <FiAward className="w-8 h-8" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Code snippets modal with categories
const CodeSnippetsModal = ({ isOpen, onClose, onInsert, language }) => {
  const snippets = {
    javascript: {
      'Data Structures': [
        { name: 'Array Methods', code: 'const arr = [];\narr.push(item);\narr.pop();\narr.map(x => x * 2);\narr.filter(x => x > 0);' },
        { name: 'Hash Map', code: 'const map = new Map();\nmap.set(key, value);\nmap.get(key);\nmap.has(key);\nmap.delete(key);' },
        { name: 'Set Operations', code: 'const set = new Set();\nset.add(item);\nset.has(item);\nset.delete(item);\nconst union = [...setA, ...setB];' }
      ],
      'Algorithms': [
        { name: 'Two Pointers', code: 'let left = 0, right = arr.length - 1;\nwhile (left < right) {\n  // Compare arr[left] and arr[right]\n  if (condition) left++;\n  else right--;\n}' },
        { name: 'Binary Search', code: 'let left = 0, right = arr.length - 1;\nwhile (left <= right) {\n  const mid = Math.floor((left + right) / 2);\n  if (arr[mid] === target) return mid;\n  if (arr[mid] < target) left = mid + 1;\n  else right = mid - 1;\n}\nreturn -1;' },
        { name: 'DFS Template', code: 'function dfs(node, visited) {\n  if (!node || visited.has(node)) return;\n  visited.add(node);\n  // Process node\n  for (let neighbor of node.neighbors) {\n    dfs(neighbor, visited);\n  }\n}' }
      ],
      'Utilities': [
        { name: 'Debounce', code: 'function debounce(func, delay) {\n  let timeoutId;\n  return function(...args) {\n    clearTimeout(timeoutId);\n    timeoutId = setTimeout(() => func.apply(this, args), delay);\n  };\n}' },
        { name: 'Deep Clone', code: 'function deepClone(obj) {\n  if (obj === null || typeof obj !== "object") return obj;\n  if (obj instanceof Date) return new Date(obj.getTime());\n  if (obj instanceof Array) return obj.map(item => deepClone(item));\n  const cloned = {};\n  for (let key in obj) {\n    cloned[key] = deepClone(obj[key]);\n  }\n  return cloned;\n}' }
      ]
    },
    java: {
      'Data Structures': [
        { name: 'ArrayList', code: 'List<Integer> list = new ArrayList<>();\nlist.add(item);\nlist.get(index);\nlist.remove(index);\nlist.size();' },
        { name: 'HashMap', code: 'Map<String, Integer> map = new HashMap<>();\nmap.put(key, value);\nmap.get(key);\nmap.containsKey(key);\nmap.remove(key);' },
        { name: 'HashSet', code: 'Set<Integer> set = new HashSet<>();\nset.add(item);\nset.contains(item);\nset.remove(item);\nset.size();' }
      ],
      'Algorithms': [
        { name: 'Binary Search', code: 'int left = 0, right = arr.length - 1;\nwhile (left <= right) {\n  int mid = left + (right - left) / 2;\n  if (arr[mid] == target) return mid;\n  if (arr[mid] < target) left = mid + 1;\n  else right = mid - 1;\n}\nreturn -1;' },
        { name: 'Quick Sort', code: 'public void quickSort(int[] arr, int low, int high) {\n  if (low < high) {\n    int pi = partition(arr, low, high);\n    quickSort(arr, low, pi - 1);\n    quickSort(arr, pi + 1, high);\n  }\n}' }
      ]
    },
    cpp: {
      'Data Structures': [
        { name: 'Vector', code: 'vector<int> vec;\nvec.push_back(item);\nvec.pop_back();\nvec.size();\nvec[index];' },
        { name: 'Unordered Map', code: 'unordered_map<int, int> mp;\nmp[key] = value;\nmp.find(key) != mp.end();\nmp.erase(key);' },
        { name: 'Priority Queue', code: 'priority_queue<int> pq; // max heap\npriority_queue<int, vector<int>, greater<int>> minPq; // min heap\npq.push(item);\npq.top();\npq.pop();' }
      ],
      'Algorithms': [
        { name: 'Sort', code: 'sort(vec.begin(), vec.end()); // ascending\nsort(vec.rbegin(), vec.rend()); // descending\nsort(vec.begin(), vec.end(), greater<int>()); // descending' },
        { name: 'Binary Search', code: 'int left = 0, right = arr.size() - 1;\nwhile (left <= right) {\n  int mid = left + (right - left) / 2;\n  if (arr[mid] == target) return mid;\n  if (arr[mid] < target) left = mid + 1;\n  else right = mid - 1;\n}\nreturn -1;' }
      ]
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        className="bg-gray-900/95 border border-gray-700 rounded-3xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto backdrop-blur-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white flex items-center">
            <FiTerminal className="w-6 h-6 mr-3 text-purple-400" />
            Code Snippets - {language.toUpperCase()}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-xl transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-6">
          {Object.entries(snippets[language] || {}).map(([category, snippetList]) => (
            <div key={category} className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-300 flex items-center">
                <FiCode className="w-4 h-4 mr-2 text-cyan-400" />
                {category}
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {snippetList.map((snippet, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => onInsert(snippet.code)}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="text-left p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl border border-gray-600/50 hover:border-purple-500/50 transition-all duration-200"
                  >
                    <div className="font-medium text-white mb-2 flex items-center justify-between">
                      <span>{snippet.name}</span>
                      <FiCopy className="w-4 h-4 text-gray-400" />
                    </div>
                    <pre className="text-xs text-gray-400 overflow-hidden line-clamp-3">
                      {snippet.code.substring(0, 80)}...
                    </pre>
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

// AI Assistant Panel
const AIAssistant = ({ isOpen, onClose, code, language, problem }) => {
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      content: `Hello! I'm your AI coding assistant. I can help you with:

• Code optimization and refactoring
• Algorithm explanations
• Debugging assistance
• Best practices
• Time/space complexity analysis

How can I assist you today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const newMessage = { type: 'user', content: input };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate AI response (replace with actual AI API)
    setTimeout(() => {
      const response = {
        type: 'assistant',
        content: `Based on your code, here are some suggestions:

1. **Time Complexity**: Consider the current approach's efficiency
2. **Code Structure**: The logic looks good, but you might want to add edge case handling
3. **Optimization**: Try using a hash map for O(1) lookup time

Would you like me to elaborate on any of these points?`
      };
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className="fixed right-0 top-0 h-full w-96 bg-gray-900/95 border-l border-gray-700 backdrop-blur-xl z-30 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700/50 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg mr-3 flex items-center justify-center">
            <FiCommand className="w-4 h-4 text-white" />
          </div>
          AI Assistant
        </h3>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-xl ${
                message.type === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300'
              }`}
            >
              <pre className="whitespace-pre-wrap text-sm font-sans">
                {message.content}
              </pre>
            </div>
          </motion.div>
        ))}
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-800 text-gray-300 p-3 rounded-xl">
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, delay: i * 0.1, duration: 0.6 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700/50">
        <div className="flex space-x-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask me anything about your code..."
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={sendMessage}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Send
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Performance Monitor Component
const PerformanceMonitor = ({ isVisible }) => {
  const [metrics, setMetrics] = useState({
    memory: 0,
    cpu: 0,
    network: 'online',
    responseTime: 0
  });

  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setMetrics({
        memory: Math.random() * 100,
        cpu: Math.random() * 100,
        network: Math.random() > 0.1 ? 'online' : 'offline',
        responseTime: Math.floor(Math.random() * 200) + 50
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-16 right-4 bg-gray-900/95 border border-gray-700 rounded-xl p-4 backdrop-blur-xl z-20 min-w-[200px]"
    >
      <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
        <FiActivity className="w-4 h-4 mr-2 text-green-400" />
        Performance
      </h4>
      
      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 flex items-center">
            <FiCpu className="w-3 h-3 mr-1" />
            CPU
          </span>
          <span className="text-white">{metrics.cpu.toFixed(1)}%</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400 flex items-center">
            <FiDatabase className="w-3 h-3 mr-1" />
            Memory
          </span>
          <span className="text-white">{metrics.memory.toFixed(1)} MB</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400 flex items-center">
            {metrics.network === 'online' ? <FiWifi className="w-3 h-3 mr-1" /> : <FiWifiOff className="w-3 h-3 mr-1" />}
            Network
          </span>
          <span className={metrics.network === 'online' ? 'text-green-400' : 'text-red-400'}>
            {metrics.network}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400 flex items-center">
            <FiClock className="w-3 h-3 mr-1" />
            Latency
          </span>
          <span className="text-white">{metrics.responseTime}ms</span>
        </div>
      </div>
    </motion.div>
  );
};

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const [isEditorMaximized, setIsEditorMaximized] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [showSnippets, setShowSnippets] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false);
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const [autoSave, setAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const [executionTime, setExecutionTime] = useState(0);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const editorRef = useRef(null);
  const autoSaveTimeout = useRef(null);
  let { problemId } = useParams();

  const { handleSubmit } = useForm();

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && code && problem) {
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current);
      }
      
      autoSaveTimeout.current = setTimeout(() => {
        localStorage.setItem(`problem_${problemId}_${selectedLanguage}`, code);
        setLastSaved(new Date());
      }, 2000);
    }

    return () => {
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current);
      }
    };
  }, [code, autoSave, problemId, selectedLanguage, problem]);

  // Load saved code
  useEffect(() => {
    if (problem && problemId) {
      const savedCode = localStorage.getItem(`problem_${problemId}_${selectedLanguage}`);
      if (savedCode) {
        setCode(savedCode);
        return;
      }
      
      const initialCode = problem.startCode.find(sc => {
        if (sc.language === "C++" && selectedLanguage === 'cpp') return true;
        if (sc.language === "Java" && selectedLanguage === 'java') return true;
        if (sc.language === "Javascript" && selectedLanguage === 'javascript') return true;
        return false;
      })?.initialCode || '';
      
      setCode(initialCode);
    }
  }, [selectedLanguage, problem, problemId]);

  // Fetch problem data
  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        setProblem(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching problem:', error);
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    
    // Add keyboard shortcuts
    editor.addCommand(window.monaco?.KeyMod?.CtrlCmd | window.monaco?.KeyCode?.KeyS, () => {
      handleSaveCode();
    });
    
    editor.addCommand(window.monaco?.KeyMod?.CtrlCmd | window.monaco?.KeyCode?.Enter, () => {
      handleRun();
    });
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleSaveCode = () => {
    localStorage.setItem(`problem_${problemId}_${selectedLanguage}`, code);
    setLastSaved(new Date());
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      // Show toast notification
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleDownloadCode = () => {
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${problem?.title || 'solution'}.${selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage === 'java' ? 'java' : 'js'}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleInsertSnippet = (snippet) => {
    if (editorRef.current) {
      const position = editorRef.current.getPosition();
      editorRef.current.executeEdits('', [{
        range: new window.monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
        text: snippet
      }]);
    }
    setShowSnippets(false);
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    const startTime = Date.now();
    
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage
      });

      setRunResult({
        ...response.data,
        testCases: response.data.testCases || [],
      });
      
      setExecutionTime(Date.now() - startTime);
      setLoading(false);
      setActiveRightTab('testcase');
      
    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({
        success: false,
        error: 'Internal server error',
        testCases: []
      });
      setLoading(false);
      setActiveRightTab('testcase');
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    setSubmissionCount(prev => prev + 1);
    const startTime = Date.now();
    
    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code: code,
        language: selectedLanguage
      });

      setSubmitResult(response.data);
      setExecutionTime(Date.now() - startTime);
      setLoading(false);
      setActiveRightTab('result');
      
      if (response.data.accepted) {
        setShowFireworks(true);
        localStorage.setItem(`problem_${problemId}_solution_${selectedLanguage}`, code);
      }
      
    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult({
        accepted: false,
        error: 'Submission failed',
        passedTestCases: 0,
        totalTestCases: 1
      });
      setLoading(false);
      setActiveRightTab('result');
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'hard': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getLanguageColor = (lang) => {
    switch (lang) {
      case 'javascript': return 'from-yellow-400 to-orange-500';
      case 'java': return 'from-red-400 to-red-600';
      case 'cpp': return 'from-blue-400 to-blue-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const formatTime = (ms) => {
    return ms > 1000 ? `${(ms/1000).toFixed(2)}s` : `${ms}ms`;
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
        <motion.div className="text-center">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-6"
          />
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <h3 className="text-2xl font-bold text-white mb-2">Loading Problem</h3>
            <p className="text-gray-400">Preparing your coding environment...</p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white overflow-hidden transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <Fireworks show={showFireworks} onComplete={() => setShowFireworks(false)} />
      
      {/* Enhanced Status Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-gray-900/90 backdrop-blur-xl border-b border-gray-700/50 px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-6">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <FiCode className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-bold text-white text-lg">CodeArena</span>
                <div className="text-xs text-gray-400">Professional IDE</div>
              </div>
            </motion.div>
            
            {problem && (
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-gray-300 font-medium">{problem.title}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                  {problem.difficulty?.charAt(0).toUpperCase() + problem.difficulty?.slice(1)}
                </span>
              </div>
            )}
          </div>
          
          {/* Center Section - Status Indicators */}
          <div className="flex items-center space-x-4 text-sm">
            {lastSaved && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-1 text-green-400"
              >
                <FiCheckCircle className="w-3 h-3" />
                <span className="text-xs">Auto-saved {lastSaved.toLocaleTimeString()}</span>
              </motion.div>
            )}
            
            {executionTime > 0 && (
              <div className="flex items-center space-x-1 text-blue-400">
                <FiClock className="w-3 h-3" />
                <span className="text-xs">{formatTime(executionTime)}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-1 text-purple-400">
              <FiActivity className="w-3 h-3" />
              <span className="text-xs">Live</span>
            </div>
          </div>
          
          {/* Right Section - Controls */}
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPerformance(!showPerformance)}
              className={`p-2 rounded-lg transition-colors ${showPerformance ? 'text-green-400 bg-green-500/10' : 'text-gray-400 hover:text-white hover:bg-gray-700/30'}`}
              title="Performance Monitor"
            >
              <FiMonitor className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAI(!showAI)}
              className={`p-2 rounded-lg transition-colors ${showAI ? 'text-purple-400 bg-purple-500/10' : 'text-gray-400 hover:text-white hover:bg-gray-700/30'}`}
              title="AI Assistant"
            >
              <FiCommand className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLiked(!liked)}
              className={`p-2 rounded-lg transition-colors ${liked ? 'text-red-400 bg-red-500/10' : 'text-gray-400 hover:text-white hover:bg-gray-700/30'}`}
              title="Like Problem"
            >
              <FiHeart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-2 rounded-lg transition-colors ${bookmarked ? 'text-yellow-400 bg-yellow-500/10' : 'text-gray-400 hover:text-white hover:bg-gray-700/30'}`}
              title="Bookmark Problem"
            >
              <FiStar className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
            </motion.button>
            
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/30 transition-colors"
                title="Share"
              >
                <FiShare className="w-4 h-4" />
              </motion.button>
              
              <AnimatePresence>
                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    className="absolute right-0 top-12 bg-gray-800/95 border border-gray-700 rounded-xl shadow-xl p-3 space-y-2 min-w-[160px] backdrop-blur-xl"
                  >
                    {[
                      { icon: FiTwitter, label: 'Twitter', color: 'text-blue-400' },
                      { icon: FiLinkedin, label: 'LinkedIn', color: 'text-blue-600' },
                      { icon: FiGithub, label: 'GitHub', color: 'text-gray-300' },
                      { icon: FiFacebook, label: 'Facebook', color: 'text-blue-500' }
                    ].map((social, idx) => (
                      <button
                        key={idx}
                        className="flex items-center space-x-3 w-full p-2 hover:bg-gray-700/50 rounded-lg text-sm transition-colors"
                      >
                        <social.icon className={`w-4 h-4 ${social.color}`} />
                        <span className="text-white">{social.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/30 transition-colors"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <FiMinimize2 className="w-4 h-4" /> : <FiMaximize2 className="w-4 h-4" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Performance Monitor */}
      <PerformanceMonitor isVisible={showPerformance} />

      {/* Main Content Area */}
      <div className="flex-1 flex mt-16">
        {/* Left Panel */}
        <motion.div 
          className={`${isEditorMaximized ? 'hidden' : 'w-1/2'} flex flex-col border-r border-gray-700/50 backdrop-blur-sm`}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Enhanced Left Tabs */}
          <div className="flex bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50">
            {[
              { id: 'description', label: 'Problem', icon: FiBook, color: 'text-blue-400' },
              { id: 'editorial', label: 'Editorial', icon: FiHelpCircle, color: 'text-green-400' },
              { id: 'solutions', label: 'Solutions', icon: FiStar, color: 'text-yellow-400' },
              { id: 'submissions', label: 'History', icon: FiTrendingUp, color: 'text-purple-400' }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-2 px-4 py-3 font-medium transition-all duration-200 ${
                  activeLeftTab === tab.id
                    ? `${tab.color} border-b-2 border-current bg-current/10`
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                }`}
                onClick={() => setActiveLeftTab(tab.id)}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.id === 'submissions' && submissionCount > 0 && (
                  <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {submissionCount}
                  </span>
                )}
              </motion.button>
            ))}
          </div>

          {/* Enhanced Left Content */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {problem && (
                <motion.div
                  key={activeLeftTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-6"
                >
                  {activeLeftTab === 'description' && (
                    <div className="space-y-6">
                      {/* Enhanced Problem Header */}
                      <div className="space-y-4">
                        <motion.h1 
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent"
                        >
                          {problem.title}
                        </motion.h1>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                              {problem.difficulty?.charAt(0).toUpperCase() + problem.difficulty?.slice(1)}
                            </span>
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">
                              {problem.tags}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <div className="flex items-center space-x-1">
                              <FiUser className="w-4 h-4" />
                              <span>Solved by 1.2k</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FiTarget className="w-4 h-4" />
                              <span>Success: 65%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Problem Description */}
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="prose prose-invert max-w-none"
                      >
                        <div className="text-gray-300 leading-relaxed whitespace-pre-wrap bg-gray-800/20 rounded-xl p-6 border border-gray-700/30">
                          {problem.description}
                        </div>
                      </motion.div>

                      {/* Enhanced Examples */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-4"
                      >
                        <h3 className="text-xl font-bold text-white flex items-center">
                          <FiInfo className="w-5 h-5 mr-2 text-cyan-400" />
                          Examples
                        </h3>
                        <div className="space-y-4">
                          {problem.visibleTestCases?.map((example, index) => (
                            <motion.div
                              key={index}
                              whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(139, 92, 246, 0.1)" }}
                              className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300"
                            >
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-purple-300 text-lg">Example {index + 1}</h4>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => navigator.clipboard.writeText(`Input: ${example.input}\nOutput: ${example.output}`)}
                                  className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
                                >
                                  <FiCopy className="w-4 h-4 text-gray-400" />
                                </motion.button>
                              </div>
                              
                              <div className="space-y-3 font-mono text-sm">
                                <div className="bg-gray-900/50 rounded-lg p-3 border-l-4 border-blue-400">
                                  <span className="text-blue-400 font-semibold">Input:</span> 
                                  <span className="ml-2 text-green-300">{example.input}</span>
                                </div>
                                <div className="bg-gray-900/50 rounded-lg p-3 border-l-4 border-orange-400">
                                  <span className="text-orange-400 font-semibold">Output:</span> 
                                  <span className="ml-2 text-yellow-300">{example.output}</span>
                                </div>
                                <div className="bg-gray-900/50 rounded-lg p-3 border-l-4 border-purple-400">
                                  <span className="text-purple-400 font-semibold">Explanation:</span> 
                                  <span className="ml-2 text-gray-300">{example.explanation}</span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>

                      {/* Enhanced Hints Section */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6"
                      >
                        <h4 className="flex items-center text-yellow-400 font-bold mb-3">
                          <FiHelpCircle className="w-5 h-5 mr-2" />
                          Hints
                        </h4>
                        <div className="space-y-2 text-gray-300">
                          <details className="group">
                            <summary className="cursor-pointer hover:text-white transition-colors flex items-center">
                              <FiChevronRight className="w-4 h-4 mr-1 group-open:rotate-90 transition-transform" />
                              💡 Hint 1: Think about using a hash map
                            </summary>
                            <p className="mt-2 ml-5 text-sm text-gray-400">
                              Consider storing elements you've seen in a hash map to achieve O(1) lookup time.
                            </p>
                          </details>
                          
                          <details className="group">
                            <summary className="cursor-pointer hover:text-white transition-colors flex items-center">
                              <FiChevronRight className="w-4 h-4 mr-1 group-open:rotate-90 transition-transform" />
                              🚀 Hint 2: One pass solution exists
                            </summary>
                            <p className="mt-2 ml-5 text-sm text-gray-400">
                              You can solve this problem in a single pass through the array.
                            </p>
                          </details>
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {activeLeftTab === 'editorial' && (
                    <div className="text-center py-16">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <FiHelpCircle className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-white mb-4">Editorial Coming Soon</h3>
                      <p className="text-gray-400 text-lg max-w-md mx-auto mb-6">
                        Detailed explanations, multiple approaches, and complexity analysis will be available here.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold shadow-lg"
                      >
                        Get Notified
                      </motion.button>
                    </div>
                  )}

                  {activeLeftTab === 'solutions' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white flex items-center">
                          <FiStar className="w-6 h-6 mr-2 text-yellow-400" />
                          Reference Solutions
                        </h2>
                        <div className="text-sm text-gray-400">
                          {problem.referenceSolution?.length || 0} solutions available
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {problem.referenceSolution?.map((solution, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300"
                          >
                            <div className={`bg-gradient-to-r ${getLanguageColor(solution.language)} px-6 py-4`}>
                              <div className="flex items-center justify-between">
                                <h3 className="font-bold text-white text-lg">{solution.language} Solution</h3>
                                <div className="flex items-center space-x-2">
                                  <span className="bg-black/20 px-3 py-1 rounded-full text-sm">Optimal</span>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigator.clipboard.writeText(solution.completeCode)}
                                    className="p-2 bg-black/20 rounded-lg hover:bg-black/30 transition-colors"
                                  >
                                    <FiCopy className="w-4 h-4" />
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                            <div className="p-6">
                              <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-700/30 overflow-x-auto">
                                <pre className="text-sm">
                                  <code className="text-gray-300">{solution.completeCode}</code>
                                </pre>
                              </div>
                              <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
                                <div className="flex items-center space-x-4">
                                  <span>Time: O(n)</span>
                                  <span>Space: O(n)</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <FiHeart className="w-4 h-4" />
                                  <span>124 likes</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )) || (
                          <div className="text-center py-16">
                            <FiStar className="w-20 h-20 text-gray-600 mx-auto mb-6" />
                            <p className="text-gray-400 text-lg">Solutions will be available after you solve the problem.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeLeftTab === 'submissions' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white flex items-center">
                          <FiTrendingUp className="w-6 h-6 mr-2 text-purple-400" />
                          Submission History
                        </h2>
                        <div className="text-sm text-gray-400">
                          {submissionCount} attempts
                        </div>
                      </div>
                      
                      {submissionCount > 0 ? (
                        <div className="space-y-3">
                          {/* Mock submission history */}
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <FiCheckCircle className="w-5 h-5 text-green-400" />
                                <span className="font-medium">Accepted</span>
                              </div>
                              <span className="text-gray-400 text-sm">Just now</span>
                            </div>
                            <div className="mt-2 text-sm text-gray-400">
                              Runtime: 68ms • Memory: 42.1MB • {selectedLanguage.toUpperCase()}
                            </div>
                          </motion.div>
                        </div>
                      ) : (
                        <div className="text-center py-16">
                          <FiTrendingUp className="w-20 h-20 text-gray-600 mx-auto mb-6" />
                          <p className="text-gray-400 text-lg">Your submission history will appear here.</p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right Panel - Enhanced Code Editor */}
        <motion.div 
          className={`${isEditorMaximized ? 'w-full' : showAI ? 'w-1/2 mr-96' : 'w-1/2'} flex flex-col transition-all duration-300`}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Enhanced Right Tabs */}
          <div className="flex bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50">
            {[
              { id: 'code', label: 'Code Editor', icon: FiCode, color: 'text-cyan-400' },
              { id: 'testcase', label: 'Test Results', icon: FiPlay, color: 'text-green-400' },
              { id: 'result', label: 'Submission', icon: FiCheck, color: 'text-purple-400' }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-2 px-4 py-3 font-medium transition-all duration-200 ${
                  activeRightTab === tab.id
                    ? `${tab.color} border-b-2 border-current bg-current/10`
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                }`}
                onClick={() => setActiveRightTab(tab.id)}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
            
            <div className="ml-auto flex items-center px-4 space-x-2">
              {executionTime > 0 && (
                <div className="text-xs text-gray-400 flex items-center space-x-1">
                  <FiClock className="w-3 h-3" />
                  <span>{formatTime(executionTime)}</span>
                </div>
              )}
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsEditorMaximized(!isEditorMaximized)}
                className="text-gray-400 hover:text-white transition-colors"
                title="Toggle Maximize"
              >
                {isEditorMaximized ? <FiMinimize2 /> : <FiMaximize2 />}
              </motion.button>
            </div>
          </div>

          {/* Enhanced Right Content */}
          <div className="flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRightTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col"
              >
                {activeRightTab === 'code' && (
                  <div className="flex-1 flex flex-col">
                    {/* Enhanced Editor Toolbar */}
                    <div className="flex justify-between items-center p-4 bg-gray-800/30 border-b border-gray-700/50">
                      <div className="flex items-center space-x-4">
                        {/* Enhanced Language Selector */}
                        <div className="flex space-x-2">
                          {['javascript', 'java', 'cpp'].map((lang) => (
                            <motion.button
                              key={lang}
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                                selectedLanguage === lang
                                  ? `bg-gradient-to-r ${getLanguageColor(lang)} text-white shadow-lg shadow-${lang === 'javascript' ? 'orange' : lang === 'java' ? 'red' : 'blue'}-500/25`
                                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white border border-gray-600/50 hover:border-gray-500/50'
                              }`}
                              onClick={() => handleLanguageChange(lang)}
                            >
                              {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : 'Java'}
                            </motion.button>
                          ))}
                        </div>
                        
                        {/* Font Size Control */}
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-gray-400">Font:</span>
                          <select 
                            value={fontSize} 
                            onChange={(e) => setFontSize(parseInt(e.target.value))}
                            className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-white text-xs focus:border-purple-500 focus:outline-none"
                          >
                            {[12, 14, 16, 18, 20].map(size => (
                              <option key={size} value={size}>{size}px</option>
                            ))}
                          </select>
                        </div>

                        {/* Theme Selector */}
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-gray-400">Theme:</span>
                          <select 
                            value={editorTheme} 
                            onChange={(e) => setEditorTheme(e.target.value)}
                            className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-white text-xs focus:border-purple-500 focus:outline-none"
                          >
                            <option value="vs-dark">Dark</option>
                            <option value="vs-light">Light</option>
                            <option value="hc-black">High Contrast</option>
                          </select>
                        </div>
                      </div>
                      
                      {/* Enhanced Editor Actions */}
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowSnippets(true)}
                          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
                          title="Code Snippets (Ctrl+Space)"
                        >
                          <FiTerminal className="w-4 h-4" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCopyCode}
                          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
                          title="Copy Code (Ctrl+C)"
                        >
                          <FiCopy className="w-4 h-4" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleDownloadCode}
                          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
                          title="Download Code"
                        >
                          <FiDownload className="w-4 h-4" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSaveCode}
                          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
                          title="Save Code (Ctrl+S)"
                        >
                          <FiSave className="w-4 h-4" />
                        </motion.button>
                        
                        <div className="w-px h-6 bg-gray-600"></div>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setEditorTheme(editorTheme === 'vs-dark' ? 'vs-light' : 'vs-dark')}
                          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
                          title="Toggle Theme"
                        >
                          {editorTheme === 'vs-dark' ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
                        </motion.button>
                      </div>
                    </div>

                    {/* Enhanced Monaco Editor */}
                    <div className="flex-1 relative">
                      <Editor
                        height="100%"
                        language={getLanguageForMonaco(selectedLanguage)}
                        value={code}
                        onChange={handleEditorChange}
                        onMount={handleEditorDidMount}
                        theme={editorTheme}
                        options={{
                          fontSize: fontSize,
                          minimap: { enabled: true },
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                          tabSize: 2,
                          insertSpaces: true,
                          wordWrap: 'on',
                          lineNumbers: 'on',
                          glyphMargin: true,
                          folding: true,
                          lineDecorationsWidth: 10,
                          lineNumbersMinChars: 3,
                          renderLineHighlight: 'line',
                          selectOnLineNumbers: true,
                          roundedSelection: false,
                          readOnly: false,
                          cursorStyle: 'line',
                          mouseWheelZoom: true,
                          fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, 'Courier New', monospace",
                          fontLigatures: true,
                          cursorBlinking: 'smooth',
                          smoothScrolling: true,
                          contextmenu: true,
                          quickSuggestions: true,
                          suggestOnTriggerCharacters: true,
                          acceptSuggestionOnEnter: 'on',
                          bracketPairColorization: { enabled: true },
                          guides: { bracketPairs: true },
                          renderWhitespace: 'selection',
                          showFoldingControls: 'mouseover',
                        }}
                      />
                      
                      {/* Enhanced Code Statistics */}
                      <div className="absolute bottom-4 right-4 bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 rounded-xl px-3 py-2 text-xs text-gray-400">
                        <div className="flex items-center space-x-4">
                          <span>Lines: {code.split('\n').length}</span>
                          <span>Chars: {code.length}</span>
                          <span>Words: {code.split(/\s+/).filter(w => w).length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Action Bar */}
                    <div className="p-4 bg-gray-800/30 border-t border-gray-700/50 flex justify-between items-center">
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${autoSave ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                          <span>{autoSave ? 'Auto-save ON' : 'Auto-save OFF'}</span>
                        </div>
                        
                        {lastSaved && (
                          <div className="flex items-center space-x-1">
                            <FiCheckCircle className="w-3 h-3 text-green-400" />
                            <span>Saved</span>
                          </div>
                        )}

                        <div className="flex items-center space-x-1">
                          <FiActivity className="w-3 h-3 text-purple-400" />
                          <span>Live coding</span>
                        </div>
                      </div>
                      
                      {/* Enhanced Action Buttons */}
                      <div className="flex space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(34, 197, 94, 0.4)" }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleRun}
                          disabled={loading}
                          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl font-medium transition-all duration-200 disabled:cursor-not-allowed shadow-lg"
                        >
                          {loading ? <FiRefreshCw className="w-4 h-4 animate-spin" /> : <FiPlay className="w-4 h-4" />}
                          <span>Run Code</span>
                          <span className="text-xs opacity-70">(Ctrl+Enter)</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(139, 92, 246, 0.4)" }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSubmitCode}
                          disabled={loading}
                          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl font-medium transition-all duration-200 disabled:cursor-not-allowed shadow-lg"
                        >
                          {loading ? <FiRefreshCw className="w-4 h-4 animate-spin" /> : <FiCheck className="w-4 h-4" />}
                          <span>Submit Solution</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}

                {activeRightTab === 'testcase' && (
                  <div className="flex-1 p-6 overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white flex items-center">
                        <FiPlay className="w-5 h-5 mr-2 text-green-400" />
                        Test Results
                      </h3>
                      
                      {runResult && (
                        <div className="flex items-center space-x-4 text-sm">
                          <div className={`flex items-center space-x-1 ${runResult.success ? 'text-green-400' : 'text-red-400'}`}>
                            {runResult.success ? <FiCheckCircle className="w-4 h-4" /> : <FiAlertCircle className="w-4 h-4" />}
                            <span>{runResult.success ? 'All Passed' : 'Failed'}</span>
                          </div>
                          
                          {runResult.success && (
                            <>
                              <div className="flex items-center space-x-1 text-blue-400">
                                <FiClock className="w-4 h-4" />
                                <span>{runResult.runtime}s</span>
                              </div>
                              <div className="flex items-center space-x-1 text-purple-400">
                                <FiZap className="w-4 h-4" />
                                <span>{runResult.memory}KB</span>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {runResult ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        {/* Enhanced Overall Result */}
                        <div className={`p-6 rounded-2xl border-2 ${
                          runResult.success 
                            ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30' 
                            : 'bg-gradient-to-r from-red-500/10 to-pink-500/10 border-red-500/30'
                        }`}>
                          <div className="text-center">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 200 }}
                              className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                                runResult.success ? 'bg-green-500' : 'bg-red-500'
                              }`}
                            >
                              {runResult.success ? <FiCheck className="w-8 h-8 text-white" /> : <FiX className="w-8 h-8 text-white" />}
                            </motion.div>
                            
                            <h4 className={`text-2xl font-bold mb-3 ${
                              runResult.success ? 'text-green-300' : 'text-red-300'
                            }`}>
                              {runResult.success ? '✅ All Tests Passed!' : '❌ Some Tests Failed'}
                            </h4>
                            
                            {runResult.success && (
                              <div className="flex justify-center space-x-6 text-sm text-gray-300">
                                <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg px-3 py-2">
                                  <FiClock className="w-4 h-4 text-blue-400" />
                                  <span>Runtime: {runResult.runtime}s</span>
                                </div>
                                <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg px-3 py-2">
                                  <FiZap className="w-4 h-4 text-purple-400" />
                                  <span>Memory: {runResult.memory}KB</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Enhanced Test Cases */}
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-white">Test Cases Details</h4>
                          {runResult?.testCases?.map((tc, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className={`rounded-xl border-2 overflow-hidden ${
                                tc.status_id === 3 
                                  ? 'bg-green-500/5 border-green-500/30' 
                                  : 'bg-red-500/5 border-red-500/30'
                              }`}
                            >
                              <div className={`px-4 py-3 ${
                                tc.status_id === 3 ? 'bg-green-500/10' : 'bg-red-500/10'
                              }`}>
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-white">Test Case {i + 1}</span>
                                  <div className={`flex items-center space-x-2 ${
                                    tc.status_id === 3 ? 'text-green-400' : 'text-red-400'
                                  }`}>
                                    {tc.status_id === 3 ? <FiCheckCircle className="w-4 h-4" /> : <FiAlertCircle className="w-4 h-4" />}
                                    <span className="font-medium">{tc.status_id === 3 ? 'PASSED' : 'FAILED'}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="p-4 space-y-3 font-mono text-sm">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <div className="bg-gray-900/50 rounded-lg p-3 border-l-4 border-blue-400">
                                    <div className="text-blue-400 font-semibold mb-1">Input</div>
                                    <div className="text-gray-300 break-all">{tc.stdin}</div>
                                  </div>
                                  
                                  <div className="bg-gray-900/50 rounded-lg p-3 border-l-4 border-orange-400">
                                    <div className="text-orange-400 font-semibold mb-1">Expected</div>
                                    <div className="text-gray-300 break-all">{tc.expected_output}</div>
                                  </div>
                                  
                                  <div className={`bg-gray-900/50 rounded-lg p-3 border-l-4 ${
                                    tc.status_id === 3 ? 'border-green-400' : 'border-red-400'
                                  }`}>
                                    <div className={`font-semibold mb-1 ${
                                      tc.status_id === 3 ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                      Your Output
                                    </div>
                                    <div className="text-gray-300 break-all">{tc.stdout}</div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    ) : (
                      <div className="text-center py-16">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <FiPlay className="w-20 h-20 text-gray-600 mx-auto mb-6" />
                        </motion.div>
                        <h4 className="text-xl font-semibold text-gray-400 mb-2">Ready to test your code?</h4>
                        <p className="text-gray-500 mb-6">Click "Run Code" to test with example cases</p>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleRun}
                          className="flex items-center space-x-2 mx-auto px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium shadow-lg"
                        >
                          <FiPlay className="w-4 h-4" />
                          <span>Run Code</span>
                        </motion.button>
                      </div>
                    )}
                  </div>
                )}

                {activeRightTab === 'result' && (
                  <div className="flex-1 p-6 overflow-y-auto">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                      <FiAward className="w-5 h-5 mr-2 text-purple-400" />
                      Submission Result
                    </h3>
                    
                    {submitResult ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                      >
                        <div className={`p-8 rounded-3xl border-2 ${
                          submitResult.accepted 
                            ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30' 
                            : 'bg-gradient-to-br from-red-500/20 to-pink-500/20 border-red-500/30'
                        }`}>
                          <div className="text-center">
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                              className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
                                submitResult.accepted ? 'bg-green-500' : 'bg-red-500'
                              }`}
                            >
                              {submitResult.accepted ? (
                                <FiCheck className="w-12 h-12 text-white" />
                              ) : (
                                <FiX className="w-12 h-12 text-white" />
                              )}
                            </motion.div>
                            
                            <motion.h4 
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 }}
                              className={`text-3xl font-bold mb-4 ${
                                submitResult.accepted ? 'text-green-300' : 'text-red-300'
                              }`}
                            >
                              {submitResult.accepted ? '🎉 Solution Accepted!' : `❌ ${submitResult.error || 'Solution Failed'}`}
                            </motion.h4>
                            
                            <motion.div 
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.6 }}
                              className="space-y-4"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gray-800/50 rounded-xl p-4">
                                  <div className="text-gray-400 text-sm">Test Cases</div>
                                  <div className="text-2xl font-bold text-white">
                                    {submitResult.passedTestCases || 0}/{submitResult.totalTestCases || 1}
                                  </div>
                                  <div className={`text-sm ${
                                    (submitResult.passedTestCases || 0) === (submitResult.totalTestCases || 1)
                                      ? 'text-green-400' : 'text-red-400'
                                  }`}>
                                    {Math.round(((submitResult.passedTestCases || 0) / (submitResult.totalTestCases || 1)) * 100)}% passed
                                  </div>
                                </div>
                                
                                {submitResult.accepted && (
                                  <>
                                    <div className="bg-gray-800/50 rounded-xl p-4">
                                      <div className="text-gray-400 text-sm">Runtime</div>
                                      <div className="text-2xl font-bold text-blue-400">{submitResult.runtime || '0'}s</div>
                                      <div className="text-sm text-gray-400">Execution time</div>
                                    </div>
                                    
                                    <div className="bg-gray-800/50 rounded-xl p-4">
                                      <div className="text-gray-400 text-sm">Memory</div>
                                      <div className="text-2xl font-bold text-purple-400">{submitResult.memory || '0'}KB</div>
                                      <div className="text-sm text-gray-400">Memory usage</div>
                                    </div>
                                  </>
                                )}
                              </div>
                              
                              {submitResult.accepted && (
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.8 }}
                                  className="mt-8 p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-2xl"
                                >
                                  <div className="text-center">
                                    <FiAward className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                                    <p className="text-purple-300 font-semibold text-lg mb-2">
                                      Congratulations! 🎉
                                    </p>
                                    <p className="text-gray-300">
                                      Your solution has been accepted and saved to your profile.
                                    </p>
                                    
                                    <div className="flex justify-center space-x-4 mt-6">
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                                      >
                                        <FiShare className="w-4 h-4" />
                                        <span>Share</span>
                                      </motion.button>
                                      
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                                      >
                                        <FiMonitor className="w-4 h-4" />
                                        <span>View Stats</span>
                                      </motion.button>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="text-center py-16">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <FiAward className="w-20 h-20 text-gray-600 mx-auto mb-6" />
                        </motion.div>
                        <h4 className="text-xl font-semibold text-gray-400 mb-2">Ready to submit your solution?</h4>
                        <p className="text-gray-500 mb-6">Your final submission results will appear here</p>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSubmitCode}
                          className="flex items-center space-x-2 mx-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium shadow-lg"
                        >
                          <FiCheck className="w-4 h-4" />
                          <span>Submit Solution</span>
                        </motion.button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Modals */}
      <CodeSnippetsModal 
        isOpen={showSnippets} 
        onClose={() => setShowSnippets(false)} 
        onInsert={handleInsertSnippet}
        language={selectedLanguage}
      />
      
      <AIAssistant
        isOpen={showAI}
        onClose={() => setShowAI(false)}
        code={code}
        language={selectedLanguage}
        problem={problem}
      />
    </div>
  );
};

export default ProblemPage;
