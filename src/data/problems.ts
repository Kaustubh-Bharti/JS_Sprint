export interface Challenge {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  day: number;
  scenario: string;
  description: string;
  starterCode: string;
  testCases: { input: string; expected: string; hidden?: boolean }[];
  hints: string[];
  xpReward: number;
  tags: string[];
}

export const challenges: Challenge[] = [
  {
    id: 'c1',
    title: 'Temperature Converter',
    difficulty: 'easy',
    day: 1,
    scenario: "You're building a weather app. Your API gives Celsius, but users want Fahrenheit.",
    description: 'Write a function `celsiusToFahrenheit(c)` that converts Celsius to Fahrenheit. Formula: F = (C × 9/5) + 32',
    starterCode: `function celsiusToFahrenheit(c) {
  // Your code here
}

console.log(celsiusToFahrenheit(0));   // Should print 32
console.log(celsiusToFahrenheit(100)); // Should print 212
console.log(celsiusToFahrenheit(37));  // Should print 98.6`,
    testCases: [
      { input: 'celsiusToFahrenheit(0)', expected: '32' },
      { input: 'celsiusToFahrenheit(100)', expected: '212' },
      { input: 'celsiusToFahrenheit(37)', expected: '98.6', hidden: true },
    ],
    hints: ['Multiply c by 9, divide by 5, then add 32', 'return (c * 9/5) + 32;'],
    xpReward: 30,
    tags: ['functions', 'math', 'variables'],
  },
  {
    id: 'c2',
    title: 'Grade Calculator',
    difficulty: 'easy',
    day: 2,
    scenario: "A teacher needs a quick grader. Scores map to letter grades.",
    description: 'Write `getGrade(score)` that returns "A" (90+), "B" (80+), "C" (70+), "D" (60+), or "F" (below 60).',
    starterCode: `function getGrade(score) {
  // Use if/else if to return the right grade
}

console.log(getGrade(95));  // A
console.log(getGrade(83));  // B
console.log(getGrade(72));  // C
console.log(getGrade(55));  // F`,
    testCases: [
      { input: 'getGrade(95)', expected: 'A' },
      { input: 'getGrade(83)', expected: 'B' },
      { input: 'getGrade(72)', expected: 'C' },
      { input: 'getGrade(55)', expected: 'F', hidden: true },
    ],
    hints: ['Start with the highest grade first', 'Use else if for each grade range'],
    xpReward: 35,
    tags: ['conditions', 'if/else'],
  },
  {
    id: 'c3',
    title: 'FizzBuzz Classic',
    difficulty: 'easy',
    day: 2,
    scenario: "Every programmer faces FizzBuzz. Can you solve it?",
    description: 'Print numbers 1-15. But print "Fizz" for multiples of 3, "Buzz" for multiples of 5, and "FizzBuzz" for both.',
    starterCode: `for (let i = 1; i <= 15; i++) {
  // Your logic here
  // Hint: use % (modulo) operator to check divisibility
}`,
    testCases: [
      { input: 'line 3', expected: 'Fizz' },
      { input: 'line 5', expected: 'Buzz' },
      { input: 'line 15', expected: 'FizzBuzz' },
    ],
    hints: ['Check FizzBuzz FIRST (both divisible)', 'Use % 3 === 0 to check for multiples of 3'],
    xpReward: 40,
    tags: ['loops', 'conditions', 'modulo'],
  },
  {
    id: 'c4',
    title: 'Array Sum',
    difficulty: 'easy',
    day: 3,
    scenario: "Your e-commerce site needs to total up cart prices.",
    description: 'Write `sumArray(arr)` that returns the sum of all numbers in an array.',
    starterCode: `function sumArray(arr) {
  // Loop through arr and add up all values
}

console.log(sumArray([1, 2, 3, 4, 5]));     // 15
console.log(sumArray([10, 20, 30]));          // 60
console.log(sumArray([100, 200, 50, 25]));    // 375`,
    testCases: [
      { input: 'sumArray([1,2,3,4,5])', expected: '15' },
      { input: 'sumArray([10,20,30])', expected: '60' },
      { input: 'sumArray([100,200,50,25])', expected: '375', hidden: true },
    ],
    hints: ['Create a total = 0 variable', 'Use a for loop or forEach to add each number'],
    xpReward: 35,
    tags: ['arrays', 'loops', 'functions'],
  },
  {
    id: 'c5',
    title: 'Find the Longest Word',
    difficulty: 'medium',
    day: 3,
    scenario: "You're building a word analysis tool for a writing app.",
    description: 'Write `longestWord(words)` that returns the longest string in an array.',
    starterCode: `function longestWord(words) {
  // Find and return the longest word
}

console.log(longestWord(["cat", "elephant", "dog"])); // "elephant"
console.log(longestWord(["hi", "hello", "hey"]));      // "hello"`,
    testCases: [
      { input: 'longestWord(["cat","elephant","dog"])', expected: 'elephant' },
      { input: 'longestWord(["hi","hello","hey"])', expected: 'hello' },
      { input: 'longestWord(["a","bb","ccc","d"])', expected: 'ccc', hidden: true },
    ],
    hints: ['Start with longest = words[0]', 'Compare each word.length to longest.length'],
    xpReward: 50,
    tags: ['arrays', 'loops', 'strings'],
  },
  {
    id: 'c6',
    title: 'Object Inspector',
    difficulty: 'medium',
    day: 4,
    scenario: "You're debugging a user profile system and need to extract info from objects.",
    description: 'Write `describeUser(user)` that takes a user object and returns a formatted description string.',
    starterCode: `function describeUser(user) {
  // Return: "Name: Alice, Age: 25, Role: admin"
  // Use template literals!
}

let user1 = { name: "Alice", age: 25, role: "admin" };
let user2 = { name: "Bob", age: 30, role: "user" };

console.log(describeUser(user1));
console.log(describeUser(user2));`,
    testCases: [
      { input: 'describeUser({name:"Alice",age:25,role:"admin"})', expected: 'Name: Alice, Age: 25, Role: admin' },
      { input: 'describeUser({name:"Bob",age:30,role:"user"})', expected: 'Name: Bob, Age: 30, Role: user' },
    ],
    hints: ['Use template literals with ${user.name}', 'The format should be: `Name: ${user.name}, Age: ${user.age}, Role: ${user.role}`'],
    xpReward: 45,
    tags: ['objects', 'template literals', 'functions'],
  },
  {
    id: 'c7',
    title: 'Palindrome Check',
    difficulty: 'medium',
    day: 3,
    scenario: "A kids spelling app needs to detect palindromes to make learning fun.",
    description: 'Write `isPalindrome(str)` that returns true if the string reads the same forwards and backwards.',
    starterCode: `function isPalindrome(str) {
  // "racecar" reversed is still "racecar" — that's a palindrome!
  // Hint: str.split("").reverse().join("")
}

console.log(isPalindrome("racecar")); // true
console.log(isPalindrome("hello"));   // false
console.log(isPalindrome("level"));   // true`,
    testCases: [
      { input: 'isPalindrome("racecar")', expected: 'true' },
      { input: 'isPalindrome("hello")', expected: 'false' },
      { input: 'isPalindrome("level")', expected: 'true', hidden: true },
    ],
    hints: ['Reverse the string and compare to original', 'str.split("").reverse().join("") reverses a string'],
    xpReward: 55,
    tags: ['strings', 'arrays', 'functions'],
  },
  {
    id: 'c8',
    title: 'Score Leaderboard',
    difficulty: 'hard',
    day: 4,
    scenario: "A game needs to show the top 3 players from a list of scores.",
    description: 'Write `topThree(players)` that returns the top 3 player objects sorted by score (highest first).',
    starterCode: `function topThree(players) {
  // Sort players by score (descending) and return top 3
  // Hint: use .sort() with a compare function, then .slice()
}

let players = [
  { name: "Alice", score: 340 },
  { name: "Bob", score: 520 },
  { name: "Carol", score: 180 },
  { name: "Dave", score: 420 },
  { name: "Eve", score: 290 }
];

let top = topThree(players);
top.forEach(p => console.log(p.name + ": " + p.score));`,
    testCases: [
      { input: 'topThree(players)[0].name', expected: 'Bob' },
      { input: 'topThree(players)[1].name', expected: 'Dave' },
      { input: 'topThree(players).length', expected: '3', hidden: true },
    ],
    hints: ['Use .sort((a, b) => b.score - a.score)', 'Then use .slice(0, 3) to get only the first 3'],
    xpReward: 70,
    tags: ['objects', 'arrays', 'sorting'],
  },
];
