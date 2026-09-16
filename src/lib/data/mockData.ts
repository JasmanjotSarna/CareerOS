import {
  StudentProfile,
  TargetRole,
  AptitudeQuestion,
  FacultyStudentSummary,
  CohortKPIs,
  ReadinessScoreBreakdown,
  ResumeData,
  TechnicalInterviewQuestion,
  HRInterviewQuestion
} from '@/types';

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  id: 'std-jasmanjot-01',
  userId: 'usr-jasmanjot-01',
  fullName: 'Jasmanjot Singh',
  email: 'jasmanjot.singh@jecrc.ac.in',
  university: 'JECRC University',
  degree: 'B.Tech Computer Science & Engineering',
  branch: 'CSE (AI & Machine Learning)',
  graduationYear: 2026,
  cgpa: 8.64,
  targetRoleId: 'role-sde-1',
  targetRoleTitle: 'Software Engineer — SDE-1',
  phone: '+91 98765 43210',
  linkedinUrl: 'https://linkedin.com/in/jasmanjot-singh',
  githubUrl: 'https://github.com/jasmanjot-singh',
  portfolioUrl: 'https://jasmanjot.dev',
  skills: [
    { id: 'sk-1', name: 'Python', category: 'Programming', currentProficiency: 85, verified: true, lastAssessed: '2026-09-10' },
    { id: 'sk-2', name: 'Data Structures', category: 'Programming', currentProficiency: 80, verified: true, lastAssessed: '2026-09-12' },
    { id: 'sk-3', name: 'SQL', category: 'Data', currentProficiency: 55, verified: false, lastAssessed: '2026-09-08' },
    { id: 'sk-4', name: 'Git', category: 'Programming', currentProficiency: 85, verified: true, lastAssessed: '2026-09-01' },
    { id: 'sk-5', name: 'REST APIs', category: 'Backend', currentProficiency: 75, verified: true, lastAssessed: '2026-09-05' },
    { id: 'sk-6', name: 'FastAPI', category: 'Backend', currentProficiency: 70, verified: true, lastAssessed: '2026-09-04' },
    { id: 'sk-7', name: 'React', category: 'Frontend', currentProficiency: 60, verified: false, lastAssessed: '2026-08-28' },
    { id: 'sk-8', name: 'System Design', category: 'Backend', currentProficiency: 35, verified: false, lastAssessed: '2026-09-02' },
    { id: 'sk-9', name: 'SQL Indexing', category: 'Data', currentProficiency: 40, verified: false, lastAssessed: '2026-09-01' },
    { id: 'sk-10', name: 'Advanced DSA', category: 'Programming', currentProficiency: 58, verified: false, lastAssessed: '2026-09-07' },
    { id: 'sk-11', name: 'Docker', category: 'Backend', currentProficiency: 50, verified: true, lastAssessed: '2026-08-25' },
    { id: 'sk-12', name: 'Communication', category: 'Communication', currentProficiency: 64, verified: false, lastAssessed: '2026-09-11' },
    { id: 'sk-13', name: 'Behavioral Framing', category: 'Interview Skills', currentProficiency: 65, verified: false, lastAssessed: '2026-09-09' },
    { id: 'sk-14', name: 'Object-Oriented Design', category: 'CS Fundamentals', currentProficiency: 78, verified: true, lastAssessed: '2026-09-03' },
    { id: 'sk-15', name: 'Operating Systems', category: 'CS Fundamentals', currentProficiency: 72, verified: true, lastAssessed: '2026-08-30' },
  ],
  createdAt: '2026-08-01T00:00:00Z',
  updatedAt: '2026-09-16T12:00:00Z',
};

export const TARGET_ROLES: TargetRole[] = [
  {
    id: 'role-sde-1',
    title: 'Software Engineer — SDE-1',
    category: 'Software Engineering',
    description: 'Build backend microservices, write clean maintainable code, optimize database queries, and contribute to scalable distributed systems.',
    salaryRange: '₹12 LPA — ₹24 LPA',
    marketDemand: 'Very High',
    experienceLevel: 'Entry Level (0-2 yrs)',
    educationExpectations: 'B.Tech/B.E. in Computer Science, IT, or related technical disciplines with CGPA ≥ 7.0.',
    experienceExpectations: '1-2 production projects or internships demonstrating REST APIs, database schemas, and clean code.',
    softSkills: ['Analytical Problem Solving', 'STAR Behavioral Framing', 'Active Code Review Communication', 'Technical Articulation'],
    interviewAreas: ['Round 1: DSA (Arrays, Hashmaps, Two-Pointer)', 'Round 2: System Design & Databases', 'Round 3: Core CS & HR Culture Fit'],
    aptitudeAreas: ['Quantitative (Work & Time, Probability)', 'Logical Series & Deduction', 'Abstract Code Tracing'],
    communicationExpectations: 'Target 125-145 WPM speaking cadence with minimal verbal fillers during design explanation.',
    requiredSkills: [
      { name: 'Python', category: 'Programming', requiredProficiency: 85, weight: 0.9, critical: true, benchmarkDescription: 'Idiomatic code, generator functions, memory model' },
      { name: 'Data Structures', category: 'Programming', requiredProficiency: 85, weight: 1.0, critical: true, benchmarkDescription: 'Arrays, Hashmaps, Linked Lists, Trees, Graphs' },
      { name: 'SQL', category: 'Data', requiredProficiency: 80, weight: 0.85, critical: true, benchmarkDescription: 'Multi-table joins, aggregations, subqueries' },
      { name: 'SQL Indexing', category: 'Data', requiredProficiency: 75, weight: 0.7, critical: false, benchmarkDescription: 'B-tree index, clustered vs non-clustered, EXPLAIN' },
      { name: 'System Design', category: 'Backend', requiredProficiency: 70, weight: 0.8, critical: true, benchmarkDescription: 'Load balancers, caching, microservice separation' },
      { name: 'REST APIs', category: 'Backend', requiredProficiency: 80, weight: 0.8, critical: true, benchmarkDescription: 'Stateless endpoints, idempotency, status codes' },
      { name: 'Git', category: 'Programming', requiredProficiency: 75, weight: 0.6, critical: false, benchmarkDescription: 'Branching, PR reviews, merge conflict resolution' },
      { name: 'Advanced DSA', category: 'Programming', requiredProficiency: 80, weight: 0.9, critical: true, benchmarkDescription: 'Dynamic programming, sliding window, topological sort' },
      { name: 'Docker', category: 'Backend', requiredProficiency: 65, weight: 0.6, critical: false, benchmarkDescription: 'Containerization, Dockerfile optimization, ports' },
      { name: 'Object-Oriented Design', category: 'CS Fundamentals', requiredProficiency: 80, weight: 0.75, critical: false, benchmarkDescription: 'SOLID principles, factory patterns, composition' },
      { name: 'Operating Systems', category: 'CS Fundamentals', requiredProficiency: 75, weight: 0.7, critical: false, benchmarkDescription: 'Processes vs threads, concurrency, deadlocks' },
      { name: 'Communication', category: 'Communication', requiredProficiency: 75, weight: 0.7, critical: false, benchmarkDescription: 'Clear technical explanation of code complexity' },
      { name: 'Behavioral Framing', category: 'Interview Skills', requiredProficiency: 75, weight: 0.7, critical: false, benchmarkDescription: 'STAR structure with quantified impact' },
      { name: 'React', category: 'Frontend', requiredProficiency: 65, weight: 0.5, critical: false, benchmarkDescription: 'Component hierarchy, state hooks, fetch integration' },
    ]
  },
  {
    id: 'role-data-analyst',
    title: 'Data Analyst',
    category: 'Data & Analytics',
    description: 'Transform raw data into business intelligence, build interactive PowerBI/Tableau dashboards, and write complex statistical SQL queries.',
    salaryRange: '₹8 LPA — ₹16 LPA',
    marketDemand: 'High',
    experienceLevel: 'Entry Level (0-2 yrs)',
    educationExpectations: 'B.Tech/BCA/B.Sc in CS, IT, Statistics, Mathematics or Data Science with strong quantitative baseline.',
    experienceExpectations: 'Portfolio of end-to-end data cleaning, EDA, and dashboard storytelling projects.',
    softSkills: ['Business Acumen', 'Data Storytelling', 'Executive Presentation', 'Curiosity'],
    interviewAreas: ['Round 1: Complex SQL Queries & Window Functions', 'Round 2: Data Cleaning & Visualization Case Study', 'Round 3: Business Metrics & Culture Fit'],
    aptitudeAreas: ['Data Interpretation (Tables, Charts)', 'Probability & Statistics', 'Logical Deduction'],
    communicationExpectations: 'Ability to translate statistical observations into non-technical business recommendations.',
    requiredSkills: [
      { name: 'SQL', category: 'Data', requiredProficiency: 90, weight: 1.0, critical: true, benchmarkDescription: 'Window functions, CTEs, self-joins, ranking' },
      { name: 'Python', category: 'Programming', requiredProficiency: 80, weight: 0.85, critical: true, benchmarkDescription: 'Data manipulation, automated script reporting' },
      { name: 'Pandas & NumPy', category: 'Data', requiredProficiency: 85, weight: 0.9, critical: true, benchmarkDescription: 'DataFrames, merging, groupby, imputation' },
      { name: 'Data Visualization', category: 'Frontend', requiredProficiency: 80, weight: 0.8, critical: true, benchmarkDescription: 'Tableau, PowerBI, Seaborn, interactive visuals' },
      { name: 'Communication', category: 'Communication', requiredProficiency: 85, weight: 0.8, critical: true, benchmarkDescription: 'Presenting data narratives to stakeholders' },
      { name: 'Statistics', category: 'Data', requiredProficiency: 75, weight: 0.75, critical: false, benchmarkDescription: 'Distributions, hypothesis testing, correlation' }
    ]
  },
  {
    id: 'role-ml-engineer',
    title: 'Machine Learning Engineer',
    category: 'AI / Machine Learning',
    description: 'Train, evaluate, and deploy machine learning and LLM pipeline models into production infrastructure with low inference latencies.',
    salaryRange: '₹14 LPA — ₹28 LPA',
    marketDemand: 'Very High',
    experienceLevel: 'Entry Level (0-2 yrs)',
    educationExpectations: 'B.Tech/M.Tech in CSE with AI/ML specialization or Data Science with strong linear algebra foundation.',
    experienceExpectations: 'GitHub repositories showing trained PyTorch/TensorFlow models with deployment containerization.',
    softSkills: ['Experimental Rigor', 'Model Explainability', 'Research Translation', 'System Thinking'],
    interviewAreas: ['Round 1: ML Fundamentals & Linear Algebra', 'Round 2: Model Architecture & Evaluation Metrics', 'Round 3: ML System Design & Serving'],
    aptitudeAreas: ['Multivariate Calculus & Linear Algebra', 'Probability Distributions', 'Algorithmic Problem Solving'],
    communicationExpectations: 'Explaining trade-offs between precision, recall, latency, and compute cost.',
    requiredSkills: [
      { name: 'Python', category: 'Programming', requiredProficiency: 90, weight: 1.0, critical: true, benchmarkDescription: 'Advanced Python, vectorized operations, concurrency' },
      { name: 'Machine Learning', category: 'AI/ML', requiredProficiency: 85, weight: 1.0, critical: true, benchmarkDescription: 'Supervised, unsupervised, feature engineering, cross-validation' },
      { name: 'Deep Learning / PyTorch', category: 'AI/ML', requiredProficiency: 80, weight: 0.9, critical: true, benchmarkDescription: 'CNNs, Transformers, autograd, GPU acceleration' },
      { name: 'Data Structures', category: 'Programming', requiredProficiency: 80, weight: 0.8, critical: true, benchmarkDescription: 'Graph traversals, matrix manipulation, hash structures' },
      { name: 'System Design', category: 'Backend', requiredProficiency: 75, weight: 0.8, critical: false, benchmarkDescription: 'Model serving, batch vs stream inference, caching' },
      { name: 'Docker', category: 'Backend', requiredProficiency: 75, weight: 0.7, critical: false, benchmarkDescription: 'Containerized deployment of Triton/TorchServe engines' }
    ]
  },
  {
    id: 'role-data-scientist',
    title: 'Data Scientist',
    category: 'Data & Analytics',
    description: 'Apply advanced statistical modeling, predictive algorithms, and hypothesis testing to solve core business problems.',
    salaryRange: '₹12 LPA — ₹22 LPA',
    marketDemand: 'High',
    experienceLevel: 'Entry Level (0-2 yrs)',
    educationExpectations: 'B.Tech or M.Sc in CS, Applied Math, Statistics, or Data Science.',
    experienceExpectations: 'Kaggle or research projects with thorough documentation of feature engineering and validation.',
    softSkills: ['Scientific Skepticism', 'Strategic Reasoning', 'Stakeholder Communication'],
    interviewAreas: ['Round 1: Probability & Hypothesis Testing', 'Round 2: Predictive Modeling Case Study', 'Round 3: Business Translation'],
    aptitudeAreas: ['Advanced Probability & Combinatorics', 'Statistical Significance', 'Logical Inference'],
    communicationExpectations: 'Presenting technical conclusions to business teams with clear actionable next steps.',
    requiredSkills: [
      { name: 'Python', category: 'Programming', requiredProficiency: 85, weight: 0.9, critical: true, benchmarkDescription: 'Scikit-learn, statsmodels, NumPy' },
      { name: 'Statistics', category: 'Data', requiredProficiency: 90, weight: 1.0, critical: true, benchmarkDescription: 'A/B testing, Bayesian inference, regression' },
      { name: 'Machine Learning', category: 'AI/ML', requiredProficiency: 80, weight: 0.85, critical: true, benchmarkDescription: 'Gradient boosting, clustering, dimension reduction' },
      { name: 'SQL', category: 'Data', requiredProficiency: 85, weight: 0.85, critical: true, benchmarkDescription: 'Aggregating large historical event tables' },
      { name: 'Communication', category: 'Communication', requiredProficiency: 80, weight: 0.8, critical: false, benchmarkDescription: 'Translating statistical confidence intervals' }
    ]
  },
  {
    id: 'role-business-analyst',
    title: 'Business Analyst',
    category: 'Product & Business',
    description: 'Bridge business strategy and technical requirements, document user stories, analyze process flows, and evaluate ROI.',
    salaryRange: '₹8 LPA — ₹15 LPA',
    marketDemand: 'High',
    experienceLevel: 'Entry Level (0-2 yrs)',
    educationExpectations: 'B.Tech/BBA/BCA with demonstrated analytical and communication aptitude.',
    experienceExpectations: 'Projects documenting functional requirements, BPMN workflows, and financial cost-benefit models.',
    softSkills: ['Stakeholder Interviewing', 'Cross-Functional Empathy', 'Negotiation', 'Documentation Clarity'],
    interviewAreas: ['Round 1: Business Case Studies & Guesstimates', 'Round 2: Requirement Gathering & Flowcharts', 'Round 3: Behavioral Fit'],
    aptitudeAreas: ['Logical Deductive Reasoning', 'Critical Reading Comprehension', 'Data Sufficiency'],
    communicationExpectations: 'Crisp verbal facilitation and written functional requirements documentation.',
    requiredSkills: [
      { name: 'Communication', category: 'Communication', requiredProficiency: 90, weight: 1.0, critical: true, benchmarkDescription: 'Executive presentations and conflict resolution' },
      { name: 'SQL', category: 'Data', requiredProficiency: 70, weight: 0.75, critical: true, benchmarkDescription: 'Ad-hoc data extraction and validation' },
      { name: 'Data Visualization', category: 'Frontend', requiredProficiency: 75, weight: 0.8, critical: true, benchmarkDescription: 'PowerBI/Excel dashboarding and trend tracking' },
      { name: 'Behavioral Framing', category: 'Interview Skills', requiredProficiency: 85, weight: 0.9, critical: true, benchmarkDescription: 'Scenario handling and stakeholder alignment' }
    ]
  },
  {
    id: 'role-product-analyst',
    title: 'Product Analyst',
    category: 'Product & Business',
    description: 'Define product metrics, analyze cohort retention, conduct A/B test experiments, and drive user feature adoption.',
    salaryRange: '₹10 LPA — ₹18 LPA',
    marketDemand: 'Very High',
    experienceLevel: 'Entry Level (0-2 yrs)',
    educationExpectations: 'B.Tech in CS/IT or quantitative degree with product curiosity.',
    experienceExpectations: 'Case study work analyzing retention curves, funnel drop-offs, and onboarding teardowns.',
    softSkills: ['User Empathy', 'Hypothesis-Driven Thinking', 'Product Sense'],
    interviewAreas: ['Round 1: Product Sense & Metric Definition', 'Round 2: A/B Testing & Funnel Diagnostics', 'Round 3: Behavioral'],
    aptitudeAreas: ['Analytical Reasoning', 'Probabilistic Thinking', 'Data Interpretation'],
    communicationExpectations: 'Synthesizing funnel metrics into compelling product design recommendations.',
    requiredSkills: [
      { name: 'SQL', category: 'Data', requiredProficiency: 85, weight: 0.9, critical: true, benchmarkDescription: 'Funnel analytics, retention cohorts, session tracking' },
      { name: 'Data Visualization', category: 'Frontend', requiredProficiency: 80, weight: 0.8, critical: true, benchmarkDescription: 'Plotting user funnels and retention heatmaps' },
      { name: 'Communication', category: 'Communication', requiredProficiency: 85, weight: 0.9, critical: true, benchmarkDescription: 'Aligning designers and engineers on product specs' },
      { name: 'Python', category: 'Programming', requiredProficiency: 70, weight: 0.7, critical: false, benchmarkDescription: 'Automated telemetry data wrangling' }
    ]
  }
];

export const TECHNICAL_QUESTIONS: TechnicalInterviewQuestion[] = [
  {
    id: 'tech-q1',
    title: 'Find First Duplicate Element in an Array',
    role: 'Software Engineer — SDE-1',
    difficulty: 'Medium',
    topic: 'Hash Set / Arrays',
    description: 'Given an array of integers nums, find and return the first element that appears more than once. If no duplicate exists, return -1. An element is considered the first duplicate if its second occurrence has the smallest index.',
    examples: [
      {
        input: 'nums = [2, 1, 3, 5, 3, 2]',
        output: '3',
        explanation: 'There are two duplicates: 2 and 3. The second occurrence of 3 is at index 4, while the second occurrence of 2 is at index 5. Hence, 3 is the first duplicate.'
      },
      {
        input: 'nums = [1, 2, 3, 4]',
        output: '-1',
        explanation: 'All elements are unique.'
      }
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '1 <= nums[i] <= 10^5'
    ],
    starterCode: {
      python: `def first_duplicate(nums: list[int]) -> int:\n    # Write your solution here\n    pass\n`,
      javascript: `function firstDuplicate(nums) {\n    // Write your solution here\n    return -1;\n}\n`,
      cpp: `#include <vector>\nusing namespace std;\n\nint firstDuplicate(vector<int>& nums) {\n    // Write your solution here\n    return -1;\n}\n`,
      java: `class Solution {\n    public int firstDuplicate(int[] nums) {\n        // Write your solution here\n        return -1;\n    }\n}\n`
    },
    hints: [
      'A brute-force comparison takes O(n^2) time. Can you trade space for speed?',
      'Think about what data structure lets you check if you have seen an item before in O(1) time.'
    ]
  },
  {
    id: 'tech-q2',
    title: 'Two Sum II — Input Array Is Sorted',
    role: 'Software Engineer — SDE-1',
    difficulty: 'Medium',
    topic: 'Two Pointers / Arrays',
    description: 'Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number. Return the indices of the two numbers [index1, index2] added by one as an integer array [index1, index2] of length 2.',
    examples: [
      {
        input: 'numbers = [2, 7, 11, 15], target = 9',
        output: '[1, 2]',
        explanation: 'The sum of 2 and 7 is 9. Therefore, index1 = 1, index2 = 2. We return [1, 2].'
      },
      {
        input: 'numbers = [2, 3, 4], target = 6',
        output: '[1, 3]',
        explanation: 'The sum of 2 and 4 is 6. Therefore index1 = 1, index2 = 3. We return [1, 3].'
      }
    ],
    constraints: [
      '2 <= numbers.length <= 3 * 10^4',
      '-1000 <= numbers[i] <= 1000',
      'numbers is sorted in non-decreasing order'
    ],
    starterCode: {
      python: `def two_sum(numbers: list[int], target: int) -> list[int]:\n    # Write your solution here\n    left, right = 0, len(numbers) - 1\n    while left < right:\n        curr_sum = numbers[left] + numbers[right]\n        if curr_sum == target:\n            return [left + 1, right + 1]\n        elif curr_sum < target:\n            left += 1\n        else:\n            right -= 1\n    return []\n`,
      javascript: `function twoSum(numbers, target) {\n    let left = 0, right = numbers.length - 1;\n    while (left < right) {\n        let sum = numbers[left] + numbers[right];\n        if (sum === target) return [left + 1, right + 1];\n        else if (sum < target) left++;\n        else right--;\n    }\n    return [];\n}\n`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& numbers, int target) {\n    int l = 0, r = numbers.size() - 1;\n    while(l < r){\n        int s = numbers[l] + numbers[r];\n        if (s == target) return {l+1, r+1};\n        else if (s < target) l++;\n        else r--;\n    }\n    return {};\n}\n`,
      java: `class Solution {\n    public int[] twoSum(int[] numbers, int target) {\n        int l = 0, r = numbers.length - 1;\n        while (l < r) {\n            int sum = numbers[l] + numbers[r];\n            if (sum == target) return new int[]{l + 1, r + 1};\n            else if (sum < target) l++;\n            else r--;\n        }\n        return new int[]{};\n    }\n}\n`
    },
    hints: [
      'Since the array is sorted, can you use two pointers starting from both ends?',
      'If the sum is too small, move the left pointer forward. If too large, move the right pointer backward.'
    ]
  },
  {
    id: 'tech-q3',
    title: 'Valid Parentheses & Bracket Matching',
    role: 'Software Engineer — SDE-1',
    difficulty: 'Easy',
    topic: 'Stack / Strings',
    description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid. Open brackets must be closed by the same type of brackets and in the correct order.',
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' }
    ],
    constraints: ['1 <= s.length <= 10^4'],
    starterCode: {
      python: `def is_valid(s: str) -> bool:\n    stack = []\n    mapping = {")": "(", "}": "{", "]": "["}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[char] != top: return False\n        else:\n            stack.append(char)\n    return not stack\n`,
      javascript: `function isValid(s) {\n    const stack = [];\n    const map = { ')': '(', '}': '{', ']': '[' };\n    for (let char of s) {\n        if (map[char]) {\n            if (stack.pop() !== map[char]) return false;\n        } else stack.push(char);\n    }\n    return stack.length === 0;\n}\n`,
      cpp: `#include <string>\n#include <stack>\nusing namespace std;\nbool isValid(string s) { return true; }\n`,
      java: `class Solution { public boolean isValid(String s) { return true; } }\n`
    },
    hints: [
      'Use a Last-In, First-Out (LIFO) stack to match the most recent open bracket.'
    ]
  }
];

export const HR_QUESTIONS: HRInterviewQuestion[] = [
  {
    id: 'hr-q1',
    question: 'Tell me about a time you faced a difficult technical problem or unexpected blocker in a project. How did you resolve it?',
    category: 'Problem Solving',
    contextTip: 'Focus on root-cause analysis, specific engineering actions you took, and quantified resolution metrics.'
  },
  {
    id: 'hr-q2',
    question: 'Describe a situation where you had a major technical disagreement with a team member or peer. How did you handle it?',
    category: 'Conflict Resolution',
    contextTip: 'Emphasize data-driven evaluation, active listening, and finding a win-win consensus for project delivery.'
  },
  {
    id: 'hr-q3',
    question: 'Tell me about a time you stepped up and took leadership on an initiative when the requirements were ambiguous.',
    category: 'Leadership',
    contextTip: 'Highlight how you defined milestones, aligned the team, and delivered despite incomplete specifications.'
  },
  {
    id: 'hr-q4',
    question: 'Tell me about a project that failed or missed its delivery deadline. What did you learn?',
    category: 'Failure & Adaptability',
    contextTip: 'Show accountability without blaming others, explain the post-mortem, and detail how you prevented recurrence.'
  }
];

export const INITIAL_READINESS_SCORES: ReadinessScoreBreakdown = {
  overall: 72,
  technical: 78,
  aptitude: 71,
  communication: 64,
  hr: 69,
  interview: 67,
  weeklyDelta: 8,
  lastUpdated: '2026-09-16T12:00:00Z',
};

export const INITIAL_RESUME_DATA: ResumeData = {
  fileName: 'Jasmanjot_Singh_SDE1_Resume.pdf',
  uploadedAt: '2026-09-15T18:42:00Z',
  atsScore: 74,
  scores: {
    keywordMatch: 72,
    impactStatements: 68,
    formatting: 91,
    roleAlignment: 79,
  },
  parsedSkills: ['Python', 'SQL', 'Data Structures', 'Git', 'REST APIs', 'FastAPI', 'Pandas', 'Docker', 'Linux', 'PostgreSQL'],
  extractedProjects: [
    {
      title: 'Order Processing Microservice',
      description: 'Engineered REST backend handling high-volume order submissions with connection pooling.',
      technologies: ['FastAPI', 'PostgreSQL', 'Docker', 'Redis']
    },
    {
      title: 'Campus Placement Recommendation Engine',
      description: 'Built collaborative filtering model predicting student role suitability across historical cohorts.',
      technologies: ['Python', 'PyTorch', 'Pandas', 'Scikit-Learn']
    }
  ],
  missingKeywords: ['System Design', 'SQL Indexing', 'Distributed Caching', 'Microservices', 'Kafka'],
  suggestedImprovements: [
    {
      id: 'imp-1',
      section: 'Projects: E-Commerce Microservice',
      original: 'Developed an order processing system using Python, FastAPI and PostgreSQL.',
      improved: 'Architected high-throughput order processing service using FastAPI & PostgreSQL; implemented database connection pooling and B-tree indexing to handle 1,200 requests/sec with sub-45ms latency.',
      explanation: 'Quantified system throughput and explicitly highlights database indexing keywords favored by SDE-1 ATS filters.',
      applied: false
    },
    {
      id: 'imp-2',
      section: 'Work Experience: Software Intern',
      original: 'Helped the team fix bugs and write database queries for client reports.',
      improved: 'Refactored 15+ complex multi-table SQL queries and built automated schema migration scripts, accelerating weekly reporting pipeline turnaround by 40%.',
      explanation: 'Replaces passive assisting phrasing with active leadership verbs and measurable business velocity.',
      applied: false
    },
    {
      id: 'imp-3',
      section: 'Technical Skills Header',
      original: 'Skills: Python, SQL, C++, HTML, CSS, Databases, Git.',
      improved: 'Languages: Python, C++, SQL (PostgreSQL) | Frameworks: FastAPI, React | Core: Data Structures & Algorithms, System Design, REST APIs, Git, Docker.',
      explanation: 'Organizes flat skill lists into ATS-parseable taxonomy categories.',
      applied: false
    }
  ],
  summaryFeedback: 'Jasmanjot\'s resume has a high-tier visual hierarchy (91% formatting). Elevating impact statements with concrete concurrency metrics and adding system design keywords will push your ATS score into the top 5th percentile.'
};

export const APTITUDE_QUESTIONS: AptitudeQuestion[] = [
  {
    id: 'apt-1',
    category: 'Quantitative',
    topic: 'Time and Work',
    question: 'A can complete a software module in 12 days, and B can complete the same module in 18 days. If they work together for 4 days, what fraction of the module remains unfinished?',
    options: ['5/9', '4/9', '1/3', '7/18'],
    correctOptionIndex: 1,
    explanation: 'A\'s 1-day work = 1/12, B\'s 1-day work = 1/18. Together in 1 day = (3 + 2)/36 = 5/36. In 4 days, they complete 4 * (5/36) = 20/36 = 5/9. Remaining work = 1 - 5/9 = 4/9.',
    difficulty: 'Medium'
  },
  {
    id: 'apt-2',
    category: 'Quantitative',
    topic: 'Probability',
    question: 'Two fair dice are thrown simultaneously. What is the probability that the sum of the numbers appearing on top is a prime number greater than 5?',
    options: ['2/9', '5/12', '7/36', '1/4'],
    correctOptionIndex: 0,
    explanation: 'Prime sums greater than 5 are 7 and 11. Sum 7 has 6 pairs: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1). Sum 11 has 2 pairs: (5,6),(6,5). Total favorable pairs = 8. Total outcomes = 36. Probability = 8/36 = 2/9.',
    difficulty: 'Medium'
  },
  {
    id: 'apt-3',
    category: 'Logical Reasoning',
    topic: 'Number Series',
    question: 'Identify the next number in the sequence: 3, 7, 15, 31, 63, ?',
    options: ['127', '125', '120', '128'],
    correctOptionIndex: 0,
    explanation: 'The pattern is multiply by 2 and add 1: 3*2+1 = 7, 7*2+1 = 15, 15*2+1 = 31, 31*2+1 = 63, 63*2+1 = 127 (or 2^(n+1) - 1).',
    difficulty: 'Easy'
  },
  {
    id: 'apt-4',
    category: 'DSA',
    topic: 'Hashmaps & Complexity',
    question: 'What is the worst-case time complexity of searching an element in a Hash Table with separate chaining if all elements hash to the same bucket index?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
    correctOptionIndex: 2,
    explanation: 'In the worst case, all n keys collide into the same bucket, turning that bucket into a linked list of length n. Searching through this linked list takes linear O(n) time.',
    difficulty: 'Easy'
  },
  {
    id: 'apt-5',
    category: 'DSA',
    topic: 'Binary Search Trees',
    question: 'In a balanced Binary Search Tree (AVL or Red-Black) with N nodes, what is the height of the tree?',
    options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
    correctOptionIndex: 1,
    explanation: 'A balanced binary search tree maintains self-balancing invariants such that the maximum depth never exceeds c * log2(N), giving height O(log N).',
    difficulty: 'Easy'
  },
  {
    id: 'apt-6',
    category: 'Verbal',
    topic: 'Sentence Correction',
    question: 'Choose the grammatically correct option: "Neither the team lead nor the developers ______ aware of the production outage until the telemetry alerts triggered."',
    options: ['was', 'were', 'is', 'are'],
    correctOptionIndex: 1,
    explanation: 'With "Neither... nor...", the verb agrees with the subject closest to it. "Developers" is plural, hence the past tense plural verb "were" is correct.',
    difficulty: 'Medium'
  }
];

export const COHORT_KPIS: CohortKPIs = {
  totalStudents: 842,
  overallReadiness: 58,
  technicalReadiness: 61,
  aptitudeReadiness: 66,
  communicationReadiness: 49,
  interviewReadiness: 55,
  studentsAtRiskCount: 113,
  readyPercentage: 28,
  developingPercentage: 59,
  atRiskPercentage: 13,
  topCohortSkillGaps: [
    { skill: 'System Design & Architecture', deficitPercentage: 72 },
    { skill: 'SQL Indexing & Advanced Joins', deficitPercentage: 61 },
    { skill: 'Communication Pacing & Flow', deficitPercentage: 58 },
    { skill: 'Behavioral / STAR Framing', deficitPercentage: 44 },
    { skill: 'Core DSA Hashmap Patterns', deficitPercentage: 37 }
  ]
};

export const FACULTY_STUDENTS_MOCK: FacultyStudentSummary[] = [
  {
    id: 'std-jasmanjot-01',
    name: 'Jasmanjot Singh',
    email: 'jasmanjot.singh@jecrc.ac.in',
    rollNumber: '22JECRC042',
    branch: 'CSE (AI & ML)',
    degree: 'B.Tech',
    targetRole: 'Software Engineer — SDE-1',
    overallReadiness: 72,
    technicalReadiness: 78,
    aptitudeReadiness: 71,
    communicationReadiness: 64,
    interviewReadiness: 67,
    mainGap: 'SQL Joins & System Design',
    daysToDrive: 42,
    status: 'Developing',
    requiresIntervention: false,
    resumeAtsScore: 74,
    roadmapProgress: 42,
    aiRecommendedAction: 'Assign Week 2 System Design module and schedule 1 behavioral STAR drill.',
    lastActive: '12m ago'
  },
  {
    id: 'std-rahul-02',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@jecrc.ac.in',
    rollNumber: '22JECRC118',
    branch: 'CSE',
    degree: 'B.Tech',
    targetRole: 'Software Engineer — SDE-1',
    overallReadiness: 38,
    technicalReadiness: 42,
    aptitudeReadiness: 45,
    communicationReadiness: 32,
    interviewReadiness: 35,
    mainGap: 'DSA Hashmaps & Communication',
    daysToDrive: 28,
    status: 'At-Risk',
    requiresIntervention: true,
    resumeAtsScore: 52,
    roadmapProgress: 15,
    aiRecommendedAction: 'URGENT: Enroll in mandatory DSA boot-camp and conduct 1-on-1 mock interview.',
    lastActive: '2h ago'
  },
  {
    id: 'std-priya-03',
    name: 'Priya Verma',
    email: 'priya.verma@jecrc.ac.in',
    rollNumber: '22JECRC204',
    branch: 'Information Technology',
    degree: 'B.Tech',
    targetRole: 'Data Analyst',
    overallReadiness: 36,
    technicalReadiness: 39,
    aptitudeReadiness: 50,
    communicationReadiness: 34,
    interviewReadiness: 30,
    mainGap: 'SQL Aggregations & Python Pandas',
    daysToDrive: 35,
    status: 'At-Risk',
    requiresIntervention: true,
    resumeAtsScore: 48,
    roadmapProgress: 18,
    aiRecommendedAction: 'Assign remedial SQL exercises and PowerBI project sprint.',
    lastActive: '1d ago'
  },
  {
    id: 'std-ananya-04',
    name: 'Ananya Sharma',
    email: 'ananya.s@jecrc.ac.in',
    rollNumber: '22JECRC019',
    branch: 'CSE (AI & ML)',
    degree: 'B.Tech',
    targetRole: 'Machine Learning Engineer',
    overallReadiness: 84,
    technicalReadiness: 89,
    aptitudeReadiness: 85,
    communicationReadiness: 78,
    interviewReadiness: 82,
    mainGap: 'Docker Deployment',
    daysToDrive: 42,
    status: 'Ready',
    requiresIntervention: false,
    resumeAtsScore: 88,
    roadmapProgress: 85,
    aiRecommendedAction: 'Nominate for Tier-1 Super Dream placements (₹20+ LPA shortlist).',
    lastActive: '5m ago'
  },
  {
    id: 'std-rohan-05',
    name: 'Rohan Joshi',
    email: 'rohan.j@jecrc.ac.in',
    rollNumber: '22JECRC305',
    branch: 'ECE',
    degree: 'B.Tech',
    targetRole: 'Software Engineer — SDE-1',
    overallReadiness: 39,
    technicalReadiness: 35,
    aptitudeReadiness: 55,
    communicationReadiness: 41,
    interviewReadiness: 33,
    mainGap: 'Data Structures & OOP',
    daysToDrive: 42,
    status: 'At-Risk',
    requiresIntervention: true,
    resumeAtsScore: 56,
    roadmapProgress: 20,
    aiRecommendedAction: 'Assign non-CS transition pathway: C++ OOP + LeetCode Top 50.',
    lastActive: '4h ago'
  },
  {
    id: 'std-aarav-06',
    name: 'Aarav Patel',
    email: 'aarav.p@jecrc.ac.in',
    rollNumber: '22JECRC089',
    branch: 'CSE',
    degree: 'B.Tech',
    targetRole: 'Software Engineer — SDE-1',
    overallReadiness: 76,
    technicalReadiness: 80,
    aptitudeReadiness: 75,
    communicationReadiness: 70,
    interviewReadiness: 74,
    mainGap: 'System Design Scaling',
    daysToDrive: 42,
    status: 'Ready',
    requiresIntervention: false,
    resumeAtsScore: 81,
    roadmapProgress: 68,
    aiRecommendedAction: 'Invite to advanced system design mock interview round.',
    lastActive: '30m ago'
  },
  {
    id: 'std-sneha-07',
    name: 'Sneha Reddy',
    email: 'sneha.r@jecrc.ac.in',
    rollNumber: '22JECRC167',
    branch: 'Information Technology',
    degree: 'B.Tech',
    targetRole: 'Cloud & DevOps Engineer',
    overallReadiness: 62,
    technicalReadiness: 65,
    aptitudeReadiness: 68,
    communicationReadiness: 58,
    interviewReadiness: 56,
    mainGap: 'Kubernetes & CI/CD Pipelines',
    daysToDrive: 55,
    status: 'Developing',
    requiresIntervention: false,
    resumeAtsScore: 68,
    roadmapProgress: 52,
    aiRecommendedAction: 'Provide AWS Cloud Practitioner voucher and Linux lab assessment.',
    lastActive: '3h ago'
  },
  {
    id: 'std-vikram-08',
    name: 'Vikram Mehta',
    email: 'vikram.m@jecrc.ac.in',
    rollNumber: '22JECRC412',
    branch: 'CSE',
    degree: 'B.Tech',
    targetRole: 'Software Engineer — SDE-1',
    overallReadiness: 34,
    technicalReadiness: 38,
    aptitudeReadiness: 40,
    communicationReadiness: 28,
    interviewReadiness: 32,
    mainGap: 'Core DSA & Speaking Fluency',
    daysToDrive: 18,
    status: 'At-Risk',
    requiresIntervention: true,
    resumeAtsScore: 44,
    roadmapProgress: 10,
    aiRecommendedAction: 'CRITICAL ALERT: Drive in 18 days. Schedule urgent counseling with placement mentor.',
    lastActive: '2d ago'
  },
  {
    id: 'std-tanvi-09',
    name: 'Tanvi Agarwal',
    email: 'tanvi.a@jecrc.ac.in',
    rollNumber: '22JECRC056',
    branch: 'CSE',
    degree: 'B.Tech',
    targetRole: 'Product Analyst',
    overallReadiness: 78,
    technicalReadiness: 75,
    aptitudeReadiness: 82,
    communicationReadiness: 85,
    interviewReadiness: 76,
    mainGap: 'A/B Testing Funnel Metrics',
    daysToDrive: 42,
    status: 'Ready',
    requiresIntervention: false,
    resumeAtsScore: 82,
    roadmapProgress: 72,
    aiRecommendedAction: 'Assign product case study teardown on FinTech onboarding.',
    lastActive: '1h ago'
  },
  {
    id: 'std-aditya-10',
    name: 'Aditya Kulkarni',
    email: 'aditya.k@jecrc.ac.in',
    rollNumber: '22JECRC288',
    branch: 'Information Technology',
    degree: 'B.Tech',
    targetRole: 'Business Analyst',
    overallReadiness: 66,
    technicalReadiness: 62,
    aptitudeReadiness: 72,
    communicationReadiness: 74,
    interviewReadiness: 68,
    mainGap: 'BPMN Process Modeling',
    daysToDrive: 42,
    status: 'Developing',
    requiresIntervention: false,
    resumeAtsScore: 71,
    roadmapProgress: 55,
    aiRecommendedAction: 'Assign functional specification drafting workshop.',
    lastActive: '6h ago'
  }
];
