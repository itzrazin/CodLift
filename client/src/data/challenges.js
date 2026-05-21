import { Bug, Scissors, Rocket, Sword } from 'lucide-react';

export const arenaChallenges = [
  {
    id: 'fix-the-counter',
    title: 'Fix the Counter',
    level: 'arena',
    language: 'javascript',
    difficulty: 'BEGINNER',
    type: 'Fix the Bug',
    icon: Bug,
    color: 'text-red-400 bg-red-400',
    description: 'Fix a broken React-style counter function that is incrementing by 10 instead of 1.',
    exercises: [
      {
        id: 'fix-the-counter',
        title: 'Fix the React Counter',
        number: 1,
        total: 1,
        instruction: `
<h3>Bug Squashing: The React Counter</h3>
<p>In modern web applications, ensuring correct state updates is crucial. Our React counter has a bug. Instead of incrementing by <strong>1</strong> when clicked, it increases by <strong>10</strong>!</p>
<p>Your goal is to inspect the code and correct the increment logic so that it adds exactly 1 to the count.</p>
        `,
        task: 'Fix the increment function so that it calls setCount with the count plus 1.',
        initial_code: `// Fix this broken counter increment function
function increment(count, setCount) {
  // BUG: It adds 10 instead of 1!
  setCount(count + 10);
}`,
        test_cases: {
          expected_output: '1',
          solution: 'setCount(count + 1)'
        }
      }
    ]
  },
  {
    id: 'array-compressor',
    title: 'Array Compressor',
    level: 'arena',
    language: 'javascript',
    difficulty: 'PRO',
    type: 'Code Golf',
    icon: Scissors,
    color: 'text-yellow bg-yellow',
    description: 'Write a short array compressor function that filters out duplicate numbers and keeps only unique odd integers.',
    exercises: [
      {
        id: 'array-compressor',
        title: 'Unique Odd Integers',
        number: 1,
        total: 1,
        instruction: `
<h3>Code Golf: Array Compressor</h3>
<p>Write a high-efficiency JavaScript function named <code>compress</code> that takes an array of numbers, filters it to keep only <strong>unique, odd integers</strong>, and returns the sorted result in ascending order.</p>
<p>Example: <code>compress([4, 1, 3, 3, 2, 9, 4, 1])</code> should return <code>[1, 3, 9]</code>.</p>
        `,
        task: 'Implement the compress(arr) function.',
        initial_code: `function compress(arr) {
  // Write your code here
  
}`,
        test_cases: {
          expected_output: '[1,3,9]',
          solution: 'filter'
        }
      }
    ]
  },
  {
    id: 'auth-logic-101',
    title: 'Auth Logic 101',
    level: 'arena',
    language: 'javascript',
    difficulty: 'MASTER',
    type: 'Build in 15',
    icon: Rocket,
    color: 'text-purple bg-purple',
    description: 'Implement a basic token validation and user authentication authorization helper function.',
    exercises: [
      {
        id: 'auth-logic-101',
        title: 'Verify JWT and Scope',
        number: 1,
        total: 1,
        instruction: `
<h3>Build in 15: Auth Validator</h3>
<p>Implement an authorization utility function named <code>authorize(user, requiredRole)</code>. It must verify that:</p>
<ul>
  <li>The <code>user</code> object is defined.</li>
  <li>The user has <code>is_verified: true</code>.</li>
  <li>The user's <code>role</code> matches the <code>requiredRole</code> (or the user is an <code>'admin'</code>, who bypasses role restrictions).</li>
</ul>
<p>Return <code>true</code> if authorized, and <code>false</code> otherwise.</p>
        `,
        task: 'Implement the authorize(user, requiredRole) function.',
        initial_code: `function authorize(user, requiredRole) {
  // Write your auth validation logic here
  
}`,
        test_cases: {
          expected_output: 'true',
          solution: 'role'
        }
      }
    ]
  },
  {
    id: 'algorithm-duel',
    title: 'Algorithm Duel',
    level: 'arena',
    language: 'javascript',
    difficulty: 'MASTER',
    type: 'Coding Battle',
    icon: Sword,
    color: 'text-purple-400 bg-purple-400',
    description: 'Solve a high-performance search algorithm problem: find the single non-duplicate number in a sorted O(log n) time array.',
    exercises: [
      {
        id: 'algorithm-duel',
        title: 'Single Non-Duplicate Number',
        number: 1,
        total: 1,
        instruction: `
<h3>Algorithm Duel: O(log n) Single Element Search</h3>
<p>Write a high-performance function named <code>singleNonDuplicate(nums)</code>. You are given a sorted array <code>nums</code> where every element appears exactly twice, except for one element which appears exactly once.</p>
<p>Your algorithm MUST run in **O(log n)** time complexity using binary search!</p>
<p>Example: <code>singleNonDuplicate([1,1,2,3,3,4,4,8,8])</code> should return <code>2</code>.</p>
        `,
        task: 'Implement the singleNonDuplicate(nums) function.',
        initial_code: `function singleNonDuplicate(nums) {
  // Implement binary search O(log n) here
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    let mid = Math.floor((left + right) / 2);
    if (mid % 2 === 1) mid--;
    if (nums[mid] === nums[mid + 1]) {
      left = mid + 2;
    } else {
      right = mid;
    }
  }
  return nums[left];
}`,
        test_cases: {
          expected_output: '2',
          solution: 'while'
        }
      }
    ]
  }
];
