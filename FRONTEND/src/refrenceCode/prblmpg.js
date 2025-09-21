// // import { useState, useEffect, useRef } from 'react';
// // import { useForm } from 'react-hook-form';
// // import Editor from '@monaco-editor/react';
// // import { useParams } from 'react-router';
// // import axiosClient from "../utils/axiosClient"


// // const ProblemPage = () => {
// //   const [problem, setProblem] = useState(null);
// //   const [selectedLanguage, setSelectedLanguage] = useState('javascript');
// //   const [code, setCode] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [runResult, setRunResult] = useState(null);
// //   const [submitResult, setSubmitResult] = useState(null);
// //   const [activeLeftTab, setActiveLeftTab] = useState('description');
// //   const [activeRightTab, setActiveRightTab] = useState('code');
// //   const editorRef = useRef(null);
// //   let {problemId}  = useParams();

// //   const { handleSubmit } = useForm();


// // //     _id: '507f1f77bcf86cd799439011',
// // //     title: 'Two Sum',
// // //     description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

// // // You may assume that each input would have exactly one solution, and you may not use the same element twice.

// // // You can return the answer in any order.

// // // Example 1:
// // // Input: nums = [2,7,11,15], target = 9
// // // Output: [0,1]
// // // Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

// // // Example 2:
// // // Input: nums = [3,2,4], target = 6
// // // Output: [1,2]

// // // Example 3:
// // // Input: nums = [3,3], target = 6
// // // Output: [0,1]

// // // Constraints:
// // // - 2 <= nums.length <= 10^4
// // // - -10^9 <= nums[i] <= 10^9
// // // - -10^9 <= target <= 10^9
// // // - Only one valid answer exists.`,
// // //     difficulty: 'easy',
// // //     tags: 'array',
// // //     visibleTestCases: [
// // //       {
// // //         input: 'nums = [2,7,11,15], target = 9',
// // //         output: '[0,1]',
// // //         explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
// // //       },
// // //       {
// // //         input: 'nums = [3,2,4], target = 6',
// // //         output: '[1,2]',
// // //         explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
// // //       }
// // //     ],
// // //     startCode: [
// // //       {
// // //         language: 'javascript',
// // //         initialCode: `/**
// // //  * @param {number[]} nums
// // //  * @param {number} target
// // //  * @return {number[]}
// // //  */
// // // var twoSum = function(nums, target) {
    
// // // };`
// // //       },
// // //       {
// // //         language: 'java',
// // //         initialCode: `class Solution {
// // //     public int[] twoSum(int[] nums, int target) {
        
// // //     }
// // // }`
// // //       },
// // //       {
// // //         language: 'cpp',
// // //         initialCode: `class Solution {
// // // public:
// // //     vector<int> twoSum(vector<int>& nums, int target) {
        
// // //     }
// // // };`
// // //       }
// // //     ],
// // //     editorial: {
// // //       content: `## Approach 1: Brute Force

// // // The brute force approach is simple. Loop through each element x and find if there is another value that equals to target - x.

// // // **Algorithm:**
// // // 1. For each element in the array
// // // 2. Check if target - current element exists in the rest of the array
// // // 3. If found, return the indices

// // // **Complexity Analysis:**
// // // - Time complexity: O(n²)
// // // - Space complexity: O(1)

// // // ## Approach 2: Hash Table

// // // To improve our runtime complexity, we need a more efficient way to check if the complement exists in the array. If the complement exists, we need to get its index. What is the best way to maintain a mapping of each element in the array to its index? A hash table.

// // // **Algorithm:**
// // // 1. Create a hash table to store elements and their indices
// // // 2. For each element, calculate complement = target - current element
// // // 3. If complement exists in hash table, return indices
// // // 4. Otherwise, add current element to hash table

// // // **Complexity Analysis:**
// // // - Time complexity: O(n)
// // // - Space complexity: O(n)`
// // //     },
// // //     solutions: [
// // //       {
// // //         language: 'javascript',
// // //         title: 'Hash Table Approach',
// // //         code: `var twoSum = function(nums, target) {
// // //     const map = new Map();
    
// // //     for (let i = 0; i < nums.length; i++) {
// // //         const complement = target - nums[i];
        
// // //         if (map.has(complement)) {
// // //             return [map.get(complement), i];
// // //         }
        
// // //         map.set(nums[i], i);
// // //     }
    
// // //     return [];
// // // };`
// // //       },
// // //       {
// // //         language: 'java',
// // //         title: 'Hash Table Approach',
// // //         code: `class Solution {
// // //     public int[] twoSum(int[] nums, int target) {
// // //         Map<Integer, Integer> map = new HashMap<>();
        
// // //         for (int i = 0; i < nums.length; i++) {
// // //             int complement = target - nums[i];
            
// // //             if (map.containsKey(complement)) {
// // //                 return new int[] { map.get(complement), i };
// // //             }
            
// // //             map.put(nums[i], i);
// // //         }
        
// // //         return new int[0];
// // //     }
// // // }`
// // //       }
// // //     ]
// // //   };

// //   // Fetch problem data
// //   useEffect(() => {
// //     const fetchProblem = async () => {
// //       setLoading(true);
// //       try {
        
// //         const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        
// //         const initialCode = response.data.startCode.find((sc) => {
        
// //         if (sc.language == "C++" && selectedLanguage == 'cpp')
// //         return true;
// //         else if (sc.language == "Java" && selectedLanguage == 'java')
// //         return true;
// //         else if (sc.language == "Javascript" && selectedLanguage == 'javascript')
// //         return true;

// //         return false;
// //         })?.initialCode || 'Hello';

// //         console.log(initialCode);
// //         setProblem(response.data);
// //         // console.log(response.data.startCode);
        

// //         console.log(initialCode);
// //         setCode(initialCode);
// //         setLoading(false);
        
// //       } catch (error) {
// //         console.error('Error fetching problem:', error);
// //         setLoading(false);
// //       }
// //     };

// //     fetchProblem();
// //   }, [problemId]);

// //   // Update code when language changes
// //   useEffect(() => {
// //     if (problem) {
// //       const initialCode = problem.startCode.find(sc => sc.language === selectedLanguage)?.initialCode || '';
// //       setCode(initialCode);
// //     }
// //   }, [selectedLanguage, problem]);

// //   const handleEditorChange = (value) => {
// //     setCode(value || '');
// //   };

// //   const handleEditorDidMount = (editor) => {
// //     editorRef.current = editor;
// //   };

// //   const handleLanguageChange = (language) => {
// //     setSelectedLanguage(language);
// //   };

// //   const handleRun = async () => {
// //     setLoading(true);
// //     setRunResult(null);
    
// //     try {
// //       const response = await axiosClient.post(`/submission/run/${problemId}`, {
// //         code,
// //         language: selectedLanguage
// //       });

// //       setRunResult(response.data);
// //       setLoading(false);
// //       setActiveRightTab('testcase');
      
// //     } catch (error) {
// //       console.error('Error running code:', error);
// //       setRunResult({
// //         success: false,
// //         error: 'Internal server error'
// //       });
// //       setLoading(false);
// //       setActiveRightTab('testcase');
// //     }
// //   };

// //   const handleSubmitCode = async () => {
// //     setLoading(true);
// //     setSubmitResult(null);
    
// //     try {
// //         const response = await axiosClient.post(`/submission/submit/${problemId}`, {
// //         code:code,
// //         language: selectedLanguage
// //       });

// //        setSubmitResult(response.data);
// //        setLoading(false);
// //        setActiveRightTab('result');
      
// //     } catch (error) {
// //       console.error('Error submitting code:', error);
// //       setSubmitResult(null);
// //       setLoading(false);
// //       setActiveRightTab('result');
// //     }
// //   };

// //   const getLanguageForMonaco = (lang) => {
// //     switch (lang) {
// //       case 'javascript': return 'javascript';
// //       case 'java': return 'java';
// //       case 'cpp': return 'cpp';
// //       default: return 'javascript';
// //     }
// //   };

// //   const getDifficultyColor = (difficulty) => {
// //     switch (difficulty) {
// //       case 'easy': return 'text-green-500';
// //       case 'medium': return 'text-yellow-500';
// //       case 'hard': return 'text-red-500';
// //       default: return 'text-gray-500';
// //     }
// //   };

// //   if (loading && !problem) {
// //     return (
// //       <div className="flex justify-center items-center min-h-screen">
// //         <span className="loading loading-spinner loading-lg"></span>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="h-screen flex bg-base-100">
// //       {/* Left Panel */}
// //       <div className="w-1/2 flex flex-col border-r border-base-300">
// //         {/* Left Tabs */}
// //         <div className="tabs tabs-bordered bg-base-200 px-4">
// //           <button 
// //             className={`tab ${activeLeftTab === 'description' ? 'tab-active' : ''}`}
// //             onClick={() => setActiveLeftTab('description')}
// //           >
// //             Description
// //           </button>
// //           <button 
// //             className={`tab ${activeLeftTab === 'editorial' ? 'tab-active' : ''}`}
// //             onClick={() => setActiveLeftTab('editorial')}
// //           >
// //             Editorial
// //           </button>
// //           <button 
// //             className={`tab ${activeLeftTab === 'solutions' ? 'tab-active' : ''}`}
// //             onClick={() => setActiveLeftTab('solutions')}
// //           >
// //             Solutions
// //           </button>
// //           <button 
// //             className={`tab ${activeLeftTab === 'submissions' ? 'tab-active' : ''}`}
// //             onClick={() => setActiveLeftTab('submissions')}
// //           >
// //             Submissions
// //           </button>
// //         </div>

// //         {/* Left Content */}
// //         <div className="flex-1 overflow-y-auto p-6">
// //           {problem && (
// //             <>
// //               {activeLeftTab === 'description' && (
// //                 <div>
// //                   <div className="flex items-center gap-4 mb-6">
// //                     <h1 className="text-2xl font-bold">{problem.title}</h1>
// //                     <div className={`badge badge-outline ${getDifficultyColor(problem.difficulty)}`}>
// //                       {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
// //                     </div>
// //                     <div className="badge badge-primary">{problem.tags}</div>
// //                   </div>

// //                   <div className="prose max-w-none">
// //                     <div className="whitespace-pre-wrap text-sm leading-relaxed">
// //                       {problem.description}
// //                     </div>
// //                   </div>

// //                   <div className="mt-8">
// //                     <h3 className="text-lg font-semibold mb-4">Examples:</h3>
// //                     <div className="space-y-4">
// //                       {problem.visibleTestCases.map((example, index) => (
// //                         <div key={index} className="bg-base-200 p-4 rounded-lg">
// //                           <h4 className="font-semibold mb-2">Example {index + 1}:</h4>
// //                           <div className="space-y-2 text-sm font-mono">
// //                             <div><strong>Input:</strong> {example.input}</div>
// //                             <div><strong>Output:</strong> {example.output}</div>
// //                             <div><strong>Explanation:</strong> {example.explanation}</div>
// //                           </div>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}

// //               {activeLeftTab === 'editorial' && (
// //                 <div className="prose max-w-none">
// //                   <h2 className="text-xl font-bold mb-4">Editorial</h2>
// //                   <div className="whitespace-pre-wrap text-sm leading-relaxed">
// //                     {'Editorial is here for the problem'}
// //                   </div>
// //                 </div>
// //               )}

// //               {activeLeftTab === 'solutions' && (
// //                 <div>
// //                   <h2 className="text-xl font-bold mb-4">Solutions</h2>
// //                   <div className="space-y-6">
// //                     {problem.referenceSolution?.map((solution, index) => (
// //                       <div key={index} className="border border-base-300 rounded-lg">
// //                         <div className="bg-base-200 px-4 py-2 rounded-t-lg">
// //                           <h3 className="font-semibold">{problem?.title} - {solution?.language}</h3>
// //                         </div>
// //                         <div className="p-4">
// //                           <pre className="bg-base-300 p-4 rounded text-sm overflow-x-auto">
// //                             <code>{solution?.completeCode}</code>
// //                           </pre>
// //                         </div>
// //                       </div>
// //                     )) || <p className="text-gray-500">Solutions will be available after you solve the problem.</p>}
// //                   </div>
// //                 </div>
// //               )}

// //               {activeLeftTab === 'submissions' && (
// //                 <div>
// //                   <h2 className="text-xl font-bold mb-4">My Submissions</h2>
// //                   <div className="text-gray-500">
// //                     Your submission history will appear here.
// //                   </div>
// //                 </div>
// //               )}
// //             </>
// //           )}
// //         </div>
// //       </div>

// //       {/* Right Panel */}
// //       <div className="w-1/2 flex flex-col">
// //         {/* Right Tabs */}
// //         <div className="tabs tabs-bordered bg-base-200 px-4">
// //           <button 
// //             className={`tab ${activeRightTab === 'code' ? 'tab-active' : ''}`}
// //             onClick={() => setActiveRightTab('code')}
// //           >
// //             Code
// //           </button>
// //           <button 
// //             className={`tab ${activeRightTab === 'testcase' ? 'tab-active' : ''}`}
// //             onClick={() => setActiveRightTab('testcase')}
// //           >
// //             Testcase
// //           </button>
// //           <button 
// //             className={`tab ${activeRightTab === 'result' ? 'tab-active' : ''}`}
// //             onClick={() => setActiveRightTab('result')}
// //           >
// //             Result
// //           </button>
// //         </div>

// //         {/* Right Content */}
// //         <div className="flex-1 flex flex-col">
// //           {activeRightTab === 'code' && (
// //             <div className="flex-1 flex flex-col">
// //               {/* Language Selector */}
// //               <div className="flex justify-between items-center p-4 border-b border-base-300">
// //                 <div className="flex gap-2">
// //                   {['javascript', 'java', 'cpp'].map((lang) => (
// //                     <button
// //                       key={lang}
// //                       className={`btn btn-sm ${selectedLanguage === lang ? 'btn-primary' : 'btn-ghost'}`}
// //                       onClick={() => handleLanguageChange(lang)}
// //                     >
// //                       {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : 'Java'}
// //                     </button>
// //                   ))}
// //                 </div>
// //               </div>

// //               {/* Monaco Editor */}
// //               <div className="flex-1">
// //                 <Editor
// //                   height="100%"
// //                   language={getLanguageForMonaco(selectedLanguage)}
// //                   value={code}
// //                   onChange={handleEditorChange}
// //                   onMount={handleEditorDidMount}
// //                   theme="vs-dark"
// //                   options={{
// //                     fontSize: 14,
// //                     minimap: { enabled: false },
// //                     scrollBeyondLastLine: false,
// //                     automaticLayout: true,
// //                     tabSize: 2,
// //                     insertSpaces: true,
// //                     wordWrap: 'on',
// //                     lineNumbers: 'on',
// //                     glyphMargin: false,
// //                     folding: true,
// //                     lineDecorationsWidth: 10,
// //                     lineNumbersMinChars: 3,
// //                     renderLineHighlight: 'line',
// //                     selectOnLineNumbers: true,
// //                     roundedSelection: false,
// //                     readOnly: false,
// //                     cursorStyle: 'line',
// //                     mouseWheelZoom: true,
// //                   }}
// //                 />
// //               </div>

// //               {/* Action Buttons */}
// //               <div className="p-4 border-t border-base-300 flex justify-between">
// //                 <div className="flex gap-2">
// //                   <button 
// //                     className="btn btn-ghost btn-sm"
// //                     onClick={() => setActiveRightTab('testcase')}
// //                   >
// //                     Console
// //                   </button>
// //                 </div>
// //                 <div className="flex gap-2">
// //                   <button
// //                     className={`btn btn-outline btn-sm ${loading ? 'loading' : ''}`}
// //                     onClick={handleRun}
// //                     disabled={loading}
// //                   >
// //                     Run
// //                   </button>
// //                   <button
// //                     className={`btn btn-primary btn-sm ${loading ? 'loading' : ''}`}
// //                     onClick={handleSubmitCode}
// //                     disabled={loading}
// //                   >
// //                     Submit
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           {activeRightTab === 'testcase' && (
// //             <div className="flex-1 p-4 overflow-y-auto">
// //               <h3 className="font-semibold mb-4">Test Results</h3>
// //               {runResult ? (
// //                 <div className={`alert ${runResult.success ? 'alert-success' : 'alert-error'} mb-4`}>
// //                   <div>
// //                     {runResult.success ? (
// //                       <div>
// //                         <h4 className="font-bold">✅ All test cases passed!</h4>
// //                         <p className="text-sm mt-2">Runtime: {runResult.runtime+" sec"}</p>
// //                         <p className="text-sm">Memory: {runResult.memory+" KB"}</p>
                        
// //                         <div className="mt-4 space-y-2">
// //                           {runResult.testCases.map((tc, i) => (
// //                             <div key={i} className="bg-base-100 p-3 rounded text-xs">
// //                               <div className="font-mono">
// //                                 <div><strong>Input:</strong> {tc.stdin}</div>
// //                                 <div><strong>Expected:</strong> {tc.expected_output}</div>
// //                                 <div><strong>Output:</strong> {tc.stdout}</div>
// //                                 <div className={'text-green-600'}>
// //                                   {'✓ Passed'}
// //                                 </div>
// //                               </div>
// //                             </div>
// //                           ))}
// //                         </div>
// //                       </div>
// //                     ) : (
// //                       <div>
// //                         <h4 className="font-bold">❌ Error</h4>
// //                         <div className="mt-4 space-y-2">
// //                           {runResult.testCases.map((tc, i) => (
// //                             <div key={i} className="bg-base-100 p-3 rounded text-xs">
// //                               <div className="font-mono">
// //                                 <div><strong>Input:</strong> {tc.stdin}</div>
// //                                 <div><strong>Expected:</strong> {tc.expected_output}</div>
// //                                 <div><strong>Output:</strong> {tc.stdout}</div>
// //                                 <div className={tc.status_id==3 ? 'text-green-600' : 'text-red-600'}>
// //                                   {tc.status_id==3 ? '✓ Passed' : '✗ Failed'}
// //                                 </div>
// //                               </div>
// //                             </div>
// //                           ))}
// //                         </div>
// //                       </div>
// //                     )}
// //                   </div>
// //                 </div>
// //               ) : (
// //                 <div className="text-gray-500">
// //                   Click "Run" to test your code with the example test cases.
// //                 </div>
// //               )}
// //             </div>
// //           )}

// //           {activeRightTab === 'result' && (
// //             <div className="flex-1 p-4 overflow-y-auto">
// //               <h3 className="font-semibold mb-4">Submission Result</h3>
// //               {submitResult ? (
// //                 <div className={`alert ${submitResult.accepted ? 'alert-success' : 'alert-error'}`}>
// //                   <div>
// //                     {submitResult.accepted ? (
// //                       <div>
// //                         <h4 className="font-bold text-lg">🎉 Accepted</h4>
// //                         <div className="mt-4 space-y-2">
// //                           <p>Test Cases Passed: {submitResult.passedTestCases}/{submitResult.totalTestCases}</p>
// //                           <p>Runtime: {submitResult.runtime + " sec"}</p>
// //                           <p>Memory: {submitResult.memory + "KB"} </p>
// //                         </div>
// //                       </div>
// //                     ) : (
// //                       <div>
// //                         <h4 className="font-bold text-lg">❌ {submitResult.error}</h4>
// //                         <div className="mt-4 space-y-2">
// //                           <p>Test Cases Passed: {submitResult.passedTestCases}/{submitResult.totalTestCases}</p>
// //                         </div>
// //                       </div>
// //                     )}
// //                   </div>
// //                 </div>
// //               ) : (
// //                 <div className="text-gray-500">
// //                   Click "Submit" to submit your solution for evaluation.
// //                 </div>
// //               )}
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProblemPage;



// import { useState, useEffect, useRef } from 'react';
// import { useForm } from 'react-hook-form';
// import Editor from '@monaco-editor/react';
// import { useParams } from 'react-router';
// import { motion, AnimatePresence } from 'framer-motion';
// import axiosClient from "../utils/axiosClient";
// import { 
//   FiCode, 
//   FiPlay, 
//   FiCheck, 
//   FiX, 
//   FiClock, 
//   FiZap, 
//   FiTrendingUp,
//   FiBook,
//   FiEye,
//   FiSettings,
//   FiMaximize2,
//   FiMinimize2,
//   FiRefreshCw,
//   FiAward,
//   FiStar
// } from 'react-icons/fi';

// // Fireworks component for celebrations
// const Fireworks = ({ show, onComplete }) => {
//   useEffect(() => {
//     if (show) {
//       const timer = setTimeout(() => {
//         onComplete();
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [show, onComplete]);

//   if (!show) return null;

//   return (
//     <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
//       {[...Array(6)].map((_, i) => (
//         <motion.div
//           key={i}
//           className="absolute"
//           style={{
//             left: `${20 + i * 15}%`,
//             top: `${30 + (i % 2) * 20}%`,
//           }}
//           initial={{ scale: 0, rotate: 0 }}
//           animate={{ 
//             scale: [0, 1.5, 0],
//             rotate: [0, 180, 360],
//             opacity: [0, 1, 0]
//           }}
//           transition={{ 
//             duration: 2,
//             delay: i * 0.2,
//             ease: "easeOut"
//           }}
//         >
//           <div className="relative">
//             {[...Array(8)].map((_, j) => (
//               <motion.div
//                 key={j}
//                 className="absolute w-2 h-2 rounded-full"
//                 style={{
//                   background: `hsl(${j * 45}, 100%, 60%)`,
//                 }}
//                 initial={{ x: 0, y: 0 }}
//                 animate={{
//                   x: Math.cos(j * 45 * Math.PI / 180) * 50,
//                   y: Math.sin(j * 45 * Math.PI / 180) * 50,
//                   opacity: [1, 0]
//                 }}
//                 transition={{ duration: 1.5, delay: i * 0.2 }}
//               />
//             ))}
//           </div>
//         </motion.div>
//       ))}
//     </div>
//   );
// };

// const ProblemPage = () => {
//   const [problem, setProblem] = useState(null);
//   const [selectedLanguage, setSelectedLanguage] = useState('javascript');
//   const [code, setCode] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [runResult, setRunResult] = useState(null);
//   const [submitResult, setSubmitResult] = useState(null);
//   const [activeLeftTab, setActiveLeftTab] = useState('description');
//   const [activeRightTab, setActiveRightTab] = useState('code');
//   const [isEditorMaximized, setIsEditorMaximized] = useState(false);
//   const [showFireworks, setShowFireworks] = useState(false);
//   const [submissionCount, setSubmissionCount] = useState(0);
//   const editorRef = useRef(null);
//   let { problemId } = useParams();

//   const { handleSubmit } = useForm();

//   // Fetch problem data
//   useEffect(() => {
//     const fetchProblem = async () => {
//       setLoading(true);
//       try {
//         const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        
//         const initialCode = response.data.startCode.find((sc) => {
//           if (sc.language == "C++" && selectedLanguage == 'cpp')
//             return true;
//           else if (sc.language == "Java" && selectedLanguage == 'java')
//             return true;
//           else if (sc.language == "Javascript" && selectedLanguage == 'javascript')
//             return true;
//           return false;
//         })?.initialCode || 'Hello';

//         setProblem(response.data);
//         setCode(initialCode);
//         setLoading(false);
        
//       } catch (error) {
//         console.error('Error fetching problem:', error);
//         setLoading(false);
//       }
//     };

//     fetchProblem();
//   }, [problemId]);

//   // Update code when language changes
//   useEffect(() => {
//     if (problem) {
//       const initialCode = problem.startCode.find(sc => sc.language === selectedLanguage)?.initialCode || '';
//       setCode(initialCode);
//     }
//   }, [selectedLanguage, problem]);

//   const handleEditorChange = (value) => {
//     setCode(value || '');
//   };

//   const handleEditorDidMount = (editor) => {
//     editorRef.current = editor;
//   };

//   const handleLanguageChange = (language) => {
//     setSelectedLanguage(language);
//   };

//   const handleRun = async () => {
//     setLoading(true);
//     setRunResult(null);
    
//     try {
//       const response = await axiosClient.post(`/submission/run/${problemId}`, {
//         code,
//         language: selectedLanguage
//       });

//       // setRunResult(response.data);
//       setRunResult({
//       ...response.data,
//       testCases: response.data.testCases || [],
//     });

//       setLoading(false);
//       setActiveRightTab('testcase');
      
//     } catch (error) {
//       console.error('Error running code:', error);
//       setRunResult({
//         success: false,
//         error: 'Internal server error'
//       });
//       setLoading(false);
//       setActiveRightTab('testcase');
//     }
//   };

//   const handleSubmitCode = async () => {
//     setLoading(true);
//     setSubmitResult(null);
//     setSubmissionCount(prev => prev + 1);
    
//     try {
//       const response = await axiosClient.post(`/submission/submit/${problemId}`, {
//         code: code,
//         language: selectedLanguage
//       });

//       setSubmitResult(response.data);
//       setLoading(false);
//       setActiveRightTab('result');
      
//       // Show fireworks if accepted
//       if (response.data.accepted) {
//         setShowFireworks(true);
//       }
      
//     } catch (error) {
//       console.error('Error submitting code:', error);
//       setSubmitResult(null);
//       setLoading(false);
//       setActiveRightTab('result');
//     }
//   };

//   const getLanguageForMonaco = (lang) => {
//     switch (lang) {
//       case 'javascript': return 'javascript';
//       case 'java': return 'java';
//       case 'cpp': return 'cpp';
//       default: return 'javascript';
//     }
//   };

//   const getDifficultyColor = (difficulty) => {
//     switch (difficulty) {
//       case 'easy': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
//       case 'medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
//       case 'hard': return 'text-red-500 bg-red-500/10 border-red-500/30';
//       default: return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
//     }
//   };

//   const getLanguageColor = (lang) => {
//     switch (lang) {
//       case 'javascript': return 'from-yellow-400 to-orange-500';
//       case 'java': return 'from-red-400 to-red-600';
//       case 'cpp': return 'from-blue-400 to-blue-600';
//       default: return 'from-gray-400 to-gray-600';
//     }
//   };

//   if (loading && !problem) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//           className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
//         />
//       </div>
//     );
//   }

//   return (
//     <div className="h-screen flex bg-gradient-to-br from-slate-900 to-gray-900 text-white overflow-hidden">
//       <Fireworks show={showFireworks} onComplete={() => setShowFireworks(false)} />
      
//       {/* Left Panel */}
//       <motion.div 
//         className={`${isEditorMaximized ? 'hidden' : 'w-1/2'} flex flex-col border-r border-gray-700/50 backdrop-blur-sm`}
//         initial={{ x: -20, opacity: 0 }}
//         animate={{ x: 0, opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         {/* Left Tabs */}
//         <div className="flex bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50">
//           {[
//             { id: 'description', label: 'Problem', icon: FiBook },
//             { id: 'editorial', label: 'Editorial', icon: FiEye },
//             { id: 'solutions', label: 'Solutions', icon: FiStar },
//             { id: 'submissions', label: 'History', icon: FiTrendingUp }
//           ].map((tab) => (
//             <motion.button
//               key={tab.id}
//               whileHover={{ y: -2 }}
//               whileTap={{ scale: 0.95 }}
//               className={`flex items-center space-x-2 px-4 py-3 font-medium transition-all duration-200 ${
//                 activeLeftTab === tab.id
//                   ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/10'
//                   : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
//               }`}
//               onClick={() => setActiveLeftTab(tab.id)}
//             >
//               <tab.icon className="w-4 h-4" />
//               <span>{tab.label}</span>
//             </motion.button>
//           ))}
//         </div>

//         {/* Left Content */}
//         <div className="flex-1 overflow-y-auto">
//           <AnimatePresence mode="wait">
//             {problem && (
//               <motion.div
//                 key={activeLeftTab}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3 }}
//                 className="p-6"
//               >
//                 {activeLeftTab === 'description' && (
//                   <div className="space-y-6">
//                     {/* Problem Header */}
//                     <div className="space-y-4">
//                       <motion.h1 
//                         initial={{ scale: 0.9 }}
//                         animate={{ scale: 1 }}
//                         className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
//                       >
//                         {problem.title}
//                       </motion.h1>
                      
//                       <div className="flex items-center space-x-4">
//                         <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(problem.difficulty)}`}>
//                           {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
//                         </span>
//                         <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">
//                           {problem.tags}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Problem Description */}
//                     <motion.div 
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       transition={{ delay: 0.2 }}
//                       className="prose prose-invert max-w-none"
//                     >
//                       <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
//                         {problem.description}
//                       </div>
//                     </motion.div>

//                     {/* Examples */}
//                     <motion.div
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: 0.4 }}
//                       className="space-y-4"
//                     >
//                       <h3 className="text-xl font-bold text-white">Examples</h3>
//                       <div className="space-y-4">
//                         {problem.visibleTestCases.map((example, index) => (
//                           <motion.div
//                             key={index}
//                             whileHover={{ scale: 1.02 }}
//                             className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 hover:border-purple-500/30 transition-all duration-200"
//                           >
//                             <h4 className="font-semibold text-purple-300 mb-3">Example {index + 1}</h4>
//                             <div className="space-y-2 font-mono text-sm">
//                               <div className="text-gray-300">
//                                 <span className="text-blue-400 font-semibold">Input:</span> 
//                                 <span className="ml-2 text-green-300">{example.input}</span>
//                               </div>
//                               <div className="text-gray-300">
//                                 <span className="text-orange-400 font-semibold">Output:</span> 
//                                 <span className="ml-2 text-yellow-300">{example.output}</span>
//                               </div>
//                               <div className="text-gray-400 mt-2">
//                                 <span className="text-purple-400 font-semibold">Explanation:</span> 
//                                 <span className="ml-2">{example.explanation}</span>
//                               </div>
//                             </div>
//                           </motion.div>
//                         ))}
//                       </div>
//                     </motion.div>
//                   </div>
//                 )}

//                 {activeLeftTab === 'editorial' && (
//                   <div className="text-center py-12">
//                     <FiEye className="w-16 h-16 text-gray-600 mx-auto mb-4" />
//                     <h3 className="text-xl font-semibold text-gray-400 mb-2">Editorial Coming Soon</h3>
//                     <p className="text-gray-500">Detailed explanations and approaches will be available here.</p>
//                   </div>
//                 )}

//                 {activeLeftTab === 'solutions' && (
//                   <div className="space-y-6">
//                     <h2 className="text-2xl font-bold text-white">Reference Solutions</h2>
//                     <div className="space-y-4">
//                       {problem.referenceSolution?.map((solution, index) => (
//                         <motion.div
//                           key={index}
//                           initial={{ opacity: 0, y: 20 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ delay: index * 0.1 }}
//                           className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden"
//                         >
//                           <div className={`bg-gradient-to-r ${getLanguageColor(solution.language)} px-4 py-3`}>
//                             <h3 className="font-semibold text-white">{solution.language} Solution</h3>
//                           </div>
//                           <div className="p-4">
//                             <pre className="bg-gray-900/50 p-4 rounded-lg text-sm overflow-x-auto border border-gray-700/30">
//                               <code className="text-gray-300">{solution.completeCode}</code>
//                             </pre>
//                           </div>
//                         </motion.div>
//                       )) || (
//                         <div className="text-center py-12">
//                           <FiStar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
//                           <p className="text-gray-500">Solutions will be available after you solve the problem.</p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {activeLeftTab === 'submissions' && (
//                   <div className="text-center py-12">
//                     <FiTrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
//                     <h3 className="text-xl font-semibold text-gray-400 mb-2">Submission History</h3>
//                     <p className="text-gray-500">Your past submissions will appear here.</p>
//                     {submissionCount > 0 && (
//                       <div className="mt-4 text-purple-400">
//                         Attempts: {submissionCount}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </motion.div>

//       {/* Right Panel */}
//       <motion.div 
//         className={`${isEditorMaximized ? 'w-full' : 'w-1/2'} flex flex-col transition-all duration-300`}
//         initial={{ x: 20, opacity: 0 }}
//         animate={{ x: 0, opacity: 1 }}
//         transition={{ duration: 0.5, delay: 0.2 }}
//       >
//         {/* Right Tabs */}
//         <div className="flex bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50">
//           {[
//             { id: 'code', label: 'Code Editor', icon: FiCode },
//             { id: 'testcase', label: 'Test Results', icon: FiPlay },
//             { id: 'result', label: 'Submission', icon: FiCheck }
//           ].map((tab) => (
//             <motion.button
//               key={tab.id}
//               whileHover={{ y: -2 }}
//               whileTap={{ scale: 0.95 }}
//               className={`flex items-center space-x-2 px-4 py-3 font-medium transition-all duration-200 ${
//                 activeRightTab === tab.id
//                   ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/10'
//                   : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
//               }`}
//               onClick={() => setActiveRightTab(tab.id)}
//             >
//               <tab.icon className="w-4 h-4" />
//               <span>{tab.label}</span>
//             </motion.button>
//           ))}
          
//           <div className="ml-auto flex items-center px-4">
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={() => setIsEditorMaximized(!isEditorMaximized)}
//               className="text-gray-400 hover:text-white transition-colors"
//             >
//               {isEditorMaximized ? <FiMinimize2 /> : <FiMaximize2 />}
//             </motion.button>
//           </div>
//         </div>

//         {/* Right Content */}
//         <div className="flex-1 flex flex-col">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={activeRightTab}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               transition={{ duration: 0.2 }}
//               className="flex-1 flex flex-col"
//             >
//               {activeRightTab === 'code' && (
//                 <div className="flex-1 flex flex-col">
//                   {/* Language Selector & Actions */}
//                   <div className="flex justify-between items-center p-4 bg-gray-800/30 border-b border-gray-700/50">
//                     <div className="flex space-x-2">
//                       {['javascript', 'java', 'cpp'].map((lang) => (
//                         <motion.button
//                           key={lang}
//                           whileHover={{ scale: 1.05 }}
//                           whileTap={{ scale: 0.95 }}
//                           className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
//                             selectedLanguage === lang
//                               ? `bg-gradient-to-r ${getLanguageColor(lang)} text-white shadow-lg`
//                               : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
//                           }`}
//                           onClick={() => handleLanguageChange(lang)}
//                         >
//                           {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : 'Java'}
//                         </motion.button>
//                       ))}
//                     </div>
                    
//                     <div className="flex items-center space-x-2">
//                       <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700/30"
//                       >
//                         <FiSettings className="w-4 h-4" />
//                       </motion.button>
//                     </div>
//                   </div>

//                   {/* Monaco Editor */}
//                   <div className="flex-1 relative">
//                     <Editor
//                       height="100%"
//                       language={getLanguageForMonaco(selectedLanguage)}
//                       value={code}
//                       onChange={handleEditorChange}
//                       onMount={handleEditorDidMount}
//                       theme="vs-dark"
//                       options={{
//                         fontSize: 14,
//                         minimap: { enabled: false },
//                         scrollBeyondLastLine: false,
//                         automaticLayout: true,
//                         tabSize: 2,
//                         insertSpaces: true,
//                         wordWrap: 'on',
//                         lineNumbers: 'on',
//                         glyphMargin: false,
//                         folding: true,
//                         lineDecorationsWidth: 10,
//                         lineNumbersMinChars: 3,
//                         renderLineHighlight: 'line',
//                         selectOnLineNumbers: true,
//                         roundedSelection: false,
//                         readOnly: false,
//                         cursorStyle: 'line',
//                         mouseWheelZoom: true,
//                         fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, 'Courier New', monospace",
//                       }}
//                     />
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="p-4 bg-gray-800/30 border-t border-gray-700/50 flex justify-between items-center">
//                     <div className="flex items-center space-x-4 text-sm text-gray-400">
//                       <div className="flex items-center space-x-1">
//                         <FiZap className="w-4 h-4" />
//                         <span>Auto-save enabled</span>
//                       </div>
//                     </div>
                    
//                     <div className="flex space-x-3">
//                       <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         onClick={handleRun}
//                         disabled={loading}
//                         className="flex items-center space-x-2 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed"
//                       >
//                         {loading ? <FiRefreshCw className="w-4 h-4 animate-spin" /> : <FiPlay className="w-4 h-4" />}
//                         <span>Run Code</span>
//                       </motion.button>
                      
//                       <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         onClick={handleSubmitCode}
//                         disabled={loading}
//                         className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed shadow-lg"
//                       >
//                         {loading ? <FiRefreshCw className="w-4 h-4 animate-spin" /> : <FiCheck className="w-4 h-4" />}
//                         <span>Submit</span>
//                       </motion.button>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {activeRightTab === 'testcase' && (
//                 <div className="flex-1 p-6 overflow-y-auto">
//                   <h3 className="text-xl font-bold text-white mb-6 flex items-center">
//                     <FiPlay className="w-5 h-5 mr-2 text-green-400" />
//                     Test Results
//                   </h3>
                  
//                   {runResult ? (
//                     <motion.div
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       className="space-y-4"
//                     >
//                       <div className={`p-6 rounded-xl border-2 ${
//                         runResult.success 
//                           ? 'bg-green-500/10 border-green-500/30 text-green-300' 
//                           : 'bg-red-500/10 border-red-500/30 text-red-300'
//                       }`}>
//                         <div className="flex items-center space-x-2 mb-4">
//                           {runResult.success ? <FiCheck className="w-6 h-6" /> : <FiX className="w-6 h-6" />}
//                           <h4 className="text-lg font-bold">
//                             {runResult.success ? 'All Tests Passed!' : 'Tests Failed'}
//                           </h4>
//                         </div>
                        
//                         {runResult.success && (
//                           <div className="flex space-x-6 text-sm">
//                             <div className="flex items-center space-x-1">
//                               <FiClock className="w-4 h-4" />
//                               <span>Runtime: {runResult.runtime} sec</span>
//                             </div>
//                             <div className="flex items-center space-x-1">
//                               <FiZap className="w-4 h-4" />
//                               <span>Memory: {runResult.memory} KB</span>
//                             </div>
//                           </div>
//                         )}
//                       </div>
                      
//                       <div className="space-y-3">
//                         {runResult?.testCases?.map((tc, i) => (
//                           <motion.div
//                             key={i}
//                             initial={{ opacity: 0, x: -20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ delay: i * 0.1 }}
//                             className={`p-4 rounded-lg border ${
//                               tc.status_id === 3 
//                                 ? 'bg-green-500/5 border-green-500/20' 
//                                 : 'bg-red-500/5 border-red-500/20'
//                             }`}
//                           >
//                             <div className="flex items-center justify-between mb-2">
//                               <span className="font-semibold">Test Case {i + 1}</span>
//                               <span className={`flex items-center space-x-1 ${
//                                 tc.status_id === 3 ? 'text-green-400' : 'text-red-400'
//                               }`}>
//                                 {tc.status_id === 3 ? <FiCheck className="w-4 h-4" /> : <FiX className="w-4 h-4" />}
//                                 <span>{tc.status_id === 3 ? 'Passed' : 'Failed'}</span>
//                               </span>
//                             </div>
//                             <div className="space-y-1 font-mono text-sm text-gray-300">
//                               <div><span className="text-blue-400">Input:</span> {tc.stdin}</div>
//                               <div><span className="text-orange-400">Expected:</span> {tc.expected_output}</div>
//                               <div><span className="text-green-400">Output:</span> {tc.stdout}</div>
//                             </div>
//                           </motion.div>
//                         ))}
//                       </div>
//                     </motion.div>
//                   ) : (
//                     <div className="text-center py-12">
//                       <FiPlay className="w-16 h-16 text-gray-600 mx-auto mb-4" />
//                       <p className="text-gray-400 mb-2">Ready to test your code?</p>
//                       <p className="text-gray-500 text-sm">Click "Run Code" to test with example cases</p>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {activeRightTab === 'result' && (
//                 <div className="flex-1 p-6 overflow-y-auto">
//                   <h3 className="text-xl font-bold text-white mb-6 flex items-center">
//                     <FiAward className="w-5 h-5 mr-2 text-purple-400" />
//                     Submission Result
//                   </h3>
                  
//                   {submitResult ? (
//                     <motion.div
//                       initial={{ opacity: 0, scale: 0.95 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       className="space-y-6"
//                     >
//                       <div className={`p-8 rounded-2xl border-2 ${
//                         submitResult.accepted 
//                           ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30' 
//                           : 'bg-gradient-to-br from-red-500/20 to-pink-500/20 border-red-500/30'
//                       }`}>
//                         <div className="text-center">
//                           <motion.div
//                             initial={{ scale: 0 }}
//                             animate={{ scale: 1 }}
//                             transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
//                             className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
//                               submitResult.accepted ? 'bg-green-500' : 'bg-red-500'
//                             }`}
//                           >
//                             {submitResult.accepted ? (
//                               <FiCheck className="w-10 h-10 text-white" />
//                             ) : (
//                               <FiX className="w-10 h-10 text-white" />
//                             )}
//                           </motion.div>
                          
//                           <h4 className={`text-2xl font-bold mb-2 ${
//                             submitResult.accepted ? 'text-green-300' : 'text-red-300'
//                           }`}>
//                             {submitResult.accepted ? '🎉 Accepted!' : `❌ ${submitResult.error}`}
//                           </h4>
                          
//                           <div className="space-y-2 text-gray-300">
//                             <p>Test Cases: {submitResult.passedTestCases}/{submitResult.totalTestCases}</p>
//                             {submitResult.accepted && (
//                               <>
//                                 <p>Runtime: {submitResult.runtime} sec</p>
//                                 <p>Memory: {submitResult.memory} KB</p>
//                               </>
//                             )}
//                           </div>
                          
//                           {submitResult.accepted && (
//                             <motion.div
//                               initial={{ opacity: 0, y: 20 }}
//                               animate={{ opacity: 1, y: 0 }}
//                               transition={{ delay: 0.5 }}
//                               className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg"
//                             >
//                               <p className="text-purple-300 font-medium">
//                                 Congratulations! Your solution has been accepted.
//                               </p>
//                             </motion.div>
//                           )}
//                         </div>
//                       </div>
//                     </motion.div>
//                   ) : (
//                     <div className="text-center py-12">
//                       <FiAward className="w-16 h-16 text-gray-600 mx-auto mb-4" />
//                       <p className="text-gray-400 mb-2">Ready to submit your solution?</p>
//                       <p className="text-gray-500 text-sm">Your submission results will appear here</p>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </motion.div>
//           </AnimatePresence>
//         </div>
//       </motion.div>
//     </div>
//   );
// };
// export default ProblemPage;
