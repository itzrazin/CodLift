export const arenaChallenges = [
  {
    id: 'fix-the-counter',
    exercises: [
      {
        id: 'fix-the-counter',
        test_cases: {
          expected_output: '1',
          solution: 'function increment(count, setCount) {\n  setCount(count + 1);\n}'
        }
      }
    ]
  },
  {
    id: 'array-compressor',
    exercises: [
      {
        id: 'array-compressor',
        test_cases: {
          expected_output: '[1,3,9]',
          solution: 'function compress(arr) { return [...new Set(arr)].filter(n => n % 2 !== 0).sort((a,b) => a-b); }'
        }
      }
    ]
  },
  {
    id: 'auth-logic-101',
    exercises: [
      {
        id: 'auth-logic-101',
        test_cases: {
          expected_output: 'true',
          solution: 'function authorize(user, requiredRole) { return !!(user && user.is_verified && (user.role === "admin" || user.role === requiredRole)); }'
        }
      }
    ]
  },
  {
    id: 'algorithm-duel',
    exercises: [
      {
        id: 'algorithm-duel',
        test_cases: {
          expected_output: '2',
          solution: 'function singleNonDuplicate(nums) { let l = 0, r = nums.length - 1; while (l < r) { let m = l + Math.floor((r - l) / 2); if (m % 2 === 1) m--; if (nums[m] === nums[m + 1]) l = m + 2; else r = m; } return nums[l]; }'
        }
      }
    ]
  }
];
