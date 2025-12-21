import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import axiosClient from "../utils/axiosclient";
import Editorial from '../components/editorials'; 
import ChatAi from '../components/ChatAi';
import {
  FiPlay,
  FiSend,
  FiCode,
  FiFileText,
  FiBook,
  FiUsers,
  FiMessageSquare,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiCpu,
  FiZap,
  FiTarget,
  FiAward,
  FiSettings,
  FiLoader,
  FiChevronRight,
  FiArrowRight,
  FiTrendingUp,
  FiActivity,
  FiEdit
} from 'react-icons/fi';

const langMap = {
  cpp: 'C++',
  java: 'Java',
  javascript: 'JavaScript'
};

const ProblemPage = () => {
  const [problem, setProblem] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorRef = useRef(null);
  let { problemId } = useParams();

  const { handleSubmit } = useForm();
useEffect(() => {
  const fetchProblem = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(
        `/problem/problemById/${problemId}`
      );

      const startCodeArr = response.data?.startCode || [];

      const matchedCode = startCodeArr.find(
        sc => sc.language === langMap[selectedLanguage]
      );

      setProblem(response.data);
      setCode(matchedCode?.initialCode || "");T
    } catch (error) {
      console.error('Error fetching problem:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchProblem();
}, [problemId, selectedLanguage]);


  useEffect(() => {
    if (problem) {
      const initialCode = problem.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode;
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage
      });
      setRunResult(response.data);
      setLoading(false);
      setActiveRightTab('testcase');
    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({
        success: false,
        error: 'Internal server error'
      });
      setLoading(false);
      setActiveRightTab('testcase');
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code: code,
        language: selectedLanguage
      });
      setSubmitResult(response.data);
      setLoading(false);
      setActiveRightTab('result');
    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult(null);
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
      case 'easy': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'hard': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const leftTabs = [
    { id: 'description', label: 'Problem', icon: FiFileText, color: 'from-blue-500 to-indigo-600' },
    { id: 'editorial', label: 'Editorial', icon: FiBook, color: 'from-purple-500 to-violet-600' },
    { id: 'solutions', label: 'Solutions', icon: FiCode, color: 'from-green-500 to-emerald-600' },
    { id: 'submissions', label: 'History', icon: FiUsers, color: 'from-orange-500 to-red-600' },
    { id: 'chatAI', label: 'AI Help', icon: FiMessageSquare, color: 'from-cyan-500 to-blue-600' }
  ];

  const rightTabs = [
    { id: 'code', label: 'Code Editor', icon: FiEdit, color: 'from-slate-500 to-slate-700' },
    { id: 'testcase', label: 'Test Results', icon: FiTarget, color: 'from-yellow-500 to-orange-600' },
    { id: 'result', label: 'Submission', icon: FiAward, color: 'from-pink-500 to-rose-600' }
  ];

  if (loading && !problem) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-purple-500/25">
              <FiCode className="text-white text-3xl" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-2xl blur opacity-25 animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <p className="text-white text-xl font-semibold">Loading Problem</p>
            <div className="flex items-center justify-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-950 text-white overflow-hidden">
      {/* Professional Header */}
      <header className="bg-slate-900/50 border-b border-slate-800/50 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
            >
              <FiCode className="text-white text-lg" />
            </motion.div>
            {problem && (
              <div>
                <h1 className="text-xl font-bold text-white">{problem.title}</h1>
                <div className="flex items-center space-x-3 mt-1">
                  <div className={`inline-flex items-center px-2 py-1 rounded-lg border text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                  </div>
                  <div className="inline-flex items-center px-2 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
                    {problem.tags}
                  </div>
                </div>
              </div>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <FiSettings className="w-5 h-5" />
          </motion.button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Panel - Problem Description */}
        <div className="w-1/2 flex flex-col border-r border-slate-800/50">
          {/* Enhanced Left Tabs */}
          <div className="flex bg-slate-900/30 backdrop-blur-sm border-b border-slate-800/50 overflow-x-auto">
            {leftTabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveLeftTab(tab.id)}
                whileHover={{ y: -1 }}
                className={`flex items-center space-x-2 px-4 py-3 transition-all duration-300 relative whitespace-nowrap ${
                  activeLeftTab === tab.id
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
                {activeLeftTab === tab.id && (
                  <motion.div
                    layoutId="leftActiveTab"
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${tab.color}`}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Enhanced Left Content */}
          <div className="flex-1 overflow-y-auto bg-slate-950/50">
            <AnimatePresence mode="wait">
              {problem && (
                <motion.div
                  key={activeLeftTab}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="p-6"
                >
                  {activeLeftTab === 'description' && (
                    <div className="space-y-8">
                      {/* Problem Description Card */}
                      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 shadow-xl">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                            <FiFileText className="w-3 h-3 text-white" />
                          </div>
                          Problem Statement
                        </h2>
                        <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {problem.description}
                        </div>
                      </div>

                      {/* Examples Section */}
                      <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-white flex items-center">
                          <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mr-3">
                            <FiZap className="w-3 h-3 text-white" />
                          </div>
                          Examples
                        </h2>
                        {problem.visibleTestCases.map((example, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl overflow-hidden shadow-xl"
                          >
                            <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-3 border-b border-slate-700/50">
                              <h3 className="font-semibold text-white flex items-center">
                                <span className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-xs mr-3 text-white">
                                  {index + 1}
                                </span>
                                Example {index + 1}
                              </h3>
                            </div>
                            <div className="p-6 space-y-4">
                              <div className="grid gap-4">
                                <div className="bg-slate-950/50 border border-slate-700/30 rounded-xl p-4">
                                  <div className="flex items-center mb-2">
                                    <span className="text-emerald-400 text-sm font-medium">Input</span>
                                  </div>
                                  <code className="text-emerald-300 font-mono text-sm">{example.input}</code>
                                </div>
                                <div className="bg-slate-950/50 border border-slate-700/30 rounded-xl p-4">
                                  <div className="flex items-center mb-2">
                                    <span className="text-blue-400 text-sm font-medium">Output</span>
                                  </div>
                                  <code className="text-blue-300 font-mono text-sm">{example.output}</code>
                                </div>
                                <div className="bg-slate-950/50 border border-slate-700/30 rounded-xl p-4">
                                  <div className="flex items-center mb-2">
                                    <span className="text-amber-400 text-sm font-medium">Explanation</span>
                                  </div>
                                  <p className="text-slate-300 text-sm">{example.explanation}</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* {activeLeftTab === 'editorial' && (
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg flex items-center justify-center mr-3">
           <FiBook className="w-3 h-3 text-white" />
        </div>
        Editorial
      </h2>
       <div className="text-slate-300 leading-relaxed">
        {problem?.secureUrl ? (
        <Editorial 
          secureUrl={problem.secureUrl} 
          thumbnailUrl={problem.thumbnailUrl} 
          duration={problem.duration} 
        />
      ) : (
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiBook className="w-8 h-8 text-slate-400" />
          </div>
          <h4 className="text-white font-semibold mb-2">No Editorial Available</h4>
          <p className="text-slate-400">Editorial video hasn't been uploaded yet for this problem.</p>
        </div>
      )}
    </div>
  </div>
)} */}

                 {activeLeftTab === 'editorial' && (
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 shadow-xl">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
       <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg flex items-center justify-center mr-3">
        <FiBook className="w-3 h-3 text-white" />
       </div>
      Editorial
    </h2>
    <div className="text-slate-300 leading-relaxed">
      {problem?.secureUrl ? (
        <Editorial 
          secureUrl={problem.secureUrl} 
          thumbnailUrl={problem.thumbnailUrl} 
          duration={problem.duration}
          videoType={problem.videoType} // Add this
        />
      ) : (
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiBook className="w-8 h-8 text-slate-400" />
          </div>
          <h4 className="text-white font-semibold mb-2">No Editorial Available</h4>
          <p className="text-slate-400">Editorial video hasn't been uploaded yet for this problem.</p>
        </div>
      )}
    </div>
  </div>
)}

                  
                  {activeLeftTab === 'solutions' && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                          <FiCode className="w-3 h-3 text-white" />
                        </div>
                        Reference Solutions
                      </h2>
                      {problem.referenceSolution?.map((solution, index) => (
                        <div key={index} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl overflow-hidden shadow-xl">
                          <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-3 border-b border-slate-700/50">
                            <h3 className="font-semibold text-white">{solution?.language}</h3>
                          </div>
                          <div className="p-6">
                            <pre className="bg-slate-950/70 border border-slate-700/30 p-4 rounded-xl text-sm overflow-x-auto text-slate-300">
                              <code>{solution?.completeCode}</code>
                            </pre>
                          </div>
                        </div>
                      )) || (
                        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-8 text-center shadow-xl">
                          <p className="text-slate-400">Solutions will be available after you solve the problem.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeLeftTab === 'submissions' && (
                    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 shadow-xl">
                      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mr-3">
                          <FiUsers className="w-3 h-3 text-white" />
                        </div>
                        Submission History
                      </h2>
                      <div className="text-slate-400">
                        <SubmissionHistory problemId={problemId} />
                      </div>
                    </div>
                  )}

                  {activeLeftTab === 'chatAI' && (
                    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 shadow-xl">
                      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                          <FiMessageSquare className="w-3 h-3 text-white" />
                        </div>
                        AI Assistant
                      </h2>
                      <ChatAi problem={problem} />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col">
          {/* Enhanced Right Tabs */}
          <div className="flex bg-slate-900/30 backdrop-blur-sm border-b border-slate-800/50 overflow-x-auto">
            {rightTabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveRightTab(tab.id)}
                whileHover={{ y: -1 }}
                className={`flex items-center space-x-2 px-4 py-3 transition-all duration-300 relative whitespace-nowrap ${
                  activeRightTab === tab.id
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
                {activeRightTab === tab.id && (
                  <motion.div
                    layoutId="rightActiveTab"
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${tab.color}`}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Enhanced Right Content */}
          <div className="flex-1 flex flex-col bg-slate-950/50">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRightTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col"
              >
                {activeRightTab === 'code' && (
                  <div className="flex-1 flex flex-col">
                    {/* Enhanced Language Selector */}
                    <div className="flex justify-between items-center p-4 border-b border-slate-800/50 bg-slate-900/30">
                      <div className="flex space-x-2">
                        {['javascript', 'java', 'cpp'].map((lang) => (
                          <motion.button
                            key={lang}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                              selectedLanguage === lang
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                            }`}
                            onClick={() => handleLanguageChange(lang)}
                          >
                            {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : 'Java'}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Monaco Editor with enhanced styling */}
                    <div className="flex-1 bg-slate-900 border border-slate-800/50">
                      <Editor
                        height="100%"
                        language={getLanguageForMonaco(selectedLanguage)}
                        value={code}
                        onChange={handleEditorChange}
                        onMount={handleEditorDidMount}
                        theme="vs-dark"
                        options={{
                          fontSize: 15,
                          fontFamily: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace',
                          minimap: { enabled: false },
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                          tabSize: 2,
                          insertSpaces: true,
                          wordWrap: 'on',
                          lineNumbers: 'on',
                          glyphMargin: false,
                          folding: true,
                          lineDecorationsWidth: 10,
                          lineNumbersMinChars: 3,
                          renderLineHighlight: 'line',
                          selectOnLineNumbers: true,
                          roundedSelection: false,
                          readOnly: false,
                          cursorStyle: 'line',
                          mouseWheelZoom: true,
                          padding: { top: 16, bottom: 16 },
                          smoothScrolling: true,
                          cursorBlinking: 'smooth',
                          contextmenu: false,
                        }}
                      />
                    </div>

                    {/* Enhanced Action Buttons */}
                    <div className="p-4 border-t border-slate-800/50 bg-slate-900/30 flex justify-between items-center">
                      <div className="flex items-center space-x-2 text-slate-400 text-sm">
                        <FiActivity className="w-4 h-4" />
                        <span>Ready to execute</span>
                      </div>
                      <div className="flex space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center space-x-2 px-6 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl hover:bg-slate-700 transition-all duration-200 shadow-lg ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          onClick={handleRun}
                          disabled={loading}
                        >
                          {loading ? (
                            <FiLoader className="w-4 h-4 animate-spin" />
                          ) : (
                            <FiPlay className="w-4 h-4" />
                          )}
                          <span className="font-medium">Run</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-500 hover:to-green-500 transition-all duration-200 shadow-lg shadow-emerald-500/25 ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          onClick={handleSubmitCode}
                          disabled={loading}
                        >
                          {loading ? (
                            <FiLoader className="w-4 h-4 animate-spin" />
                          ) : (
                            <FiSend className="w-4 h-4" />
                          )}
                          <span className="font-medium">Submit</span>
                          <FiArrowRight className="w-3 h-3" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Test Results */}
                {activeRightTab === 'testcase' && (
                  <div className="flex-1 p-6 overflow-y-auto">
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-white flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mr-3">
                          <FiTarget className="w-3 h-3 text-white" />
                        </div>
                        Test Results
                      </h3>
                      {runResult ? (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`backdrop-blur-sm border rounded-2xl p-6 shadow-xl ${
                            runResult.success 
                              ? 'bg-emerald-500/10 border-emerald-500/30' 
                              : 'bg-rose-500/10 border-rose-500/30'
                          }`}
                        >
                          {runResult.success ? (
                            <div className="space-y-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                                  <FiCheckCircle className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <h4 className="text-lg font-bold text-emerald-400">All test cases passed!</h4>
                                  <p className="text-slate-400 text-sm">Great job! Your solution is working correctly.</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-900/50 border border-slate-700/30 p-4 rounded-xl">
                                  <div className="flex items-center space-x-2 text-sm text-slate-400 mb-2">
                                    <FiClock className="w-4 h-4" />
                                    <span>Execution Time</span>
                                  </div>
                                  <div className="text-white font-semibold text-lg">{runResult.runtime} sec</div>
                                </div>
                                <div className="bg-slate-900/50 border border-slate-700/30 p-4 rounded-xl">
                                  <div className="flex items-center space-x-2 text-sm text-slate-400 mb-2">
                                    <FiCpu className="w-4 h-4" />
                                    <span>Memory Used</span>
                                  </div>
                                  <div className="text-white font-semibold text-lg">{runResult.memory} KB</div>
                                </div>
                              </div>
                              <div className="space-y-3">
                                {runResult.testCases.map((tc, i) => (
                                  <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-4"
                                  >
                                    <div className="flex items-center justify-between mb-3">
                                      <span className="text-sm font-medium text-slate-300">Test Case {i + 1}</span>
                                      <div className="flex items-center space-x-1 text-emerald-400 text-sm">
                                        <FiCheckCircle className="w-4 h-4" />
                                        <span>Passed</span>
                                      </div>
                                    </div>
                                    <div className="grid gap-3 text-sm font-mono">
                                      <div className="grid grid-cols-3 gap-3">
                                        <div>
                                          <span className="text-slate-400 block mb-1">Input:</span>
                                          <div className="bg-slate-950/50 p-2 rounded text-emerald-300">{tc.stdin}</div>
                                        </div>
                                        <div>
                                          <span className="text-slate-400 block mb-1">Expected:</span>
                                          <div className="bg-slate-950/50 p-2 rounded text-blue-300">{tc.expected_output}</div>
                                        </div>
                                        <div>
                                          <span className="text-slate-400 block mb-1">Output:</span>
                                          <div className="bg-slate-950/50 p-2 rounded text-white">{tc.stdout}</div>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                                  <FiXCircle className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <h4 className="text-lg font-bold text-rose-400">Test Failed</h4>
                                  <p className="text-slate-400 text-sm">Some test cases didn't pass. Review your code.</p>
                                </div>
                              </div>
                              <div className="space-y-3">
                                {runResult.testCases.map((tc, i) => (
                                  <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-4"
                                  >
                                    <div className="flex items-center justify-between mb-3">
                                      <span className="text-sm font-medium text-slate-300">Test Case {i + 1}</span>
                                      <div className={`flex items-center space-x-1 text-sm ${
                                        tc.status_id === 3 ? 'text-emerald-400' : 'text-rose-400'
                                      }`}>
                                        {tc.status_id === 3 ? (
                                          <>
                                            <FiCheckCircle className="w-4 h-4" />
                                            <span>Passed</span>
                                          </>
                                        ) : (
                                          <>
                                            <FiXCircle className="w-4 h-4" />
                                            <span>Failed</span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                    <div className="grid gap-3 text-sm font-mono">
                                      <div className="grid grid-cols-3 gap-3">
                                        <div>
                                          <span className="text-slate-400 block mb-1">Input:</span>
                                          <div className="bg-slate-950/50 p-2 rounded text-emerald-300">{tc.stdin}</div>
                                        </div>
                                        <div>
                                          <span className="text-slate-400 block mb-1">Expected:</span>
                                          <div className="bg-slate-950/50 p-2 rounded text-blue-300">{tc.expected_output}</div>
                                        </div>
                                        <div>
                                          <span className="text-slate-400 block mb-1">Output:</span>
                                          <div className="bg-slate-950/50 p-2 rounded text-white">{tc.stdout}</div>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ) : (
                        <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-12 text-center shadow-xl">
                          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <FiPlay className="w-8 h-8 text-slate-400" />
                          </div>
                          <h4 className="text-white font-semibold mb-2">Ready to Test</h4>
                          <p className="text-slate-400">Click "Run" to test your code with the example test cases.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Enhanced Submission Results */}
                {activeRightTab === 'result' && (
                  <div className="flex-1 p-6 overflow-y-auto">
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-white flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg flex items-center justify-center mr-3">
                          <FiAward className="w-3 h-3 text-white" />
                        </div>
                        Submission Result
                      </h3>
                      {submitResult ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`backdrop-blur-sm border rounded-2xl p-8 shadow-2xl ${
                            submitResult.accepted 
                              ? 'bg-emerald-500/10 border-emerald-500/30' 
                              : 'bg-rose-500/10 border-rose-500/30'
                          }`}
                        >
                          {submitResult.accepted ? (
                            <div className="space-y-8 text-center">
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring' }}
                                className="relative"
                              >
                                <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/25">
                                  <FiCheckCircle className="w-12 h-12 text-white" />
                                </div>
                                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 rounded-full blur opacity-20 animate-pulse"></div>
                              </motion.div>
                              <div>
                                <h4 className="text-3xl font-bold text-emerald-400 mb-2">🎉 Accepted!</h4>
                                <p className="text-slate-300 text-lg">Congratulations! Your solution is correct.</p>
                              </div>
                              <div className="grid grid-cols-3 gap-6">
                                <div className="bg-slate-900/50 border border-slate-700/30 p-6 rounded-2xl text-center">
                                  <div className="text-3xl font-bold text-white mb-1">{submitResult.passedTestCases}</div>
                                  <div className="text-slate-400 text-sm">/ {submitResult.totalTestCases} Passed</div>
                                  <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
                                    <div 
                                      className="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full"
                                      style={{ width: `${(submitResult.passedTestCases / submitResult.totalTestCases) * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                                <div className="bg-slate-900/50 border border-slate-700/30 p-6 rounded-2xl text-center">
                                  <div className="text-3xl font-bold text-white mb-1">{submitResult.runtime}</div>
                                  <div className="text-slate-400 text-sm">sec Runtime</div>
                                  <div className="flex items-center justify-center mt-3">
                                    <FiTrendingUp className="w-4 h-4 text-emerald-400" />
                                  </div>
                                </div>
                                <div className="bg-slate-900/50 border border-slate-700/30 p-6 rounded-2xl text-center">
                                  <div className="text-3xl font-bold text-white mb-1">{submitResult.memory}</div>
                                  <div className="text-slate-400 text-sm">KB Memory</div>
                                  <div className="flex items-center justify-center mt-3">
                                    <FiCpu className="w-4 h-4 text-blue-400" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-8 text-center">
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring' }}
                                className="relative"
                              >
                                <div className="w-24 h-24 bg-gradient-to-r from-rose-500 via-red-500 to-rose-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-rose-500/25">
                                  <FiXCircle className="w-12 h-12 text-white" />
                                </div>
                                <div className="absolute -inset-4 bg-gradient-to-r from-rose-500 via-red-500 to-rose-600 rounded-full blur opacity-20 animate-pulse"></div>
                              </motion.div>
                              <div>
                                <h4 className="text-3xl font-bold text-rose-400 mb-2">{submitResult.error}</h4>
                                <p className="text-slate-300 text-lg">Don't give up! Review your code and try again.</p>
                              </div>
                              <div className="bg-slate-900/50 border border-slate-700/30 p-8 rounded-2xl">
                                <div className="text-4xl font-bold text-white mb-2">{submitResult.passedTestCases}</div>
                                <div className="text-slate-400 mb-3">/ {submitResult.totalTestCases} Test Cases Passed</div>
                                <div className="w-full bg-slate-700 rounded-full h-3">
                                  <div 
                                    className="bg-gradient-to-r from-rose-500 to-red-600 h-3 rounded-full"
                                    style={{ width: `${(submitResult.passedTestCases / submitResult.totalTestCases) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ) : (
                        <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-12 text-center shadow-xl">
                          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <FiSend className="w-8 h-8 text-slate-400" />
                          </div>
                          <h4 className="text-white font-semibold mb-2">Ready to Submit</h4>
                          <p className="text-slate-400">Click "Submit" to submit your solution for evaluation.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
