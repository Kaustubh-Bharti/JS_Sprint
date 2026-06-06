export interface Lesson {
  id: string;
  title: string;
  objective: string;
  explanation: string;
  hint: string;
  starterCode: string;
  solutionCode: string;
  expectedOutput: string;
  afterExplanation: string;
  xpReward: number;
}

export interface Day {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  lessons: Lesson[];
}

export const curriculum: Day[] = [
  {
    id: 1,
    title: 'Variables & Data Types',
    subtitle: 'Day 1 — The Building Blocks',
    icon: '📦',
    color: 'from-blue-500 to-cyan-500',
    lessons: [
      {
        id: 'day1-lesson1',
        title: 'Your First Variable',
        objective: 'Declare and use a variable with let',
        explanation: 'Variables are named containers that hold data. Use `let` to create one.',
        hint: 'Try: let name = "Alex"; console.log(name);',
        starterCode: `// Declare a variable called "name" and set it to your name
// Then print it using console.log

let name = "World";
console.log("Hello, " + name + "!");`,
        solutionCode: `let name = "Alex";
console.log("Hello, " + name + "!");`,
        expectedOutput: 'Hello,',
        afterExplanation: '`let` creates a box. The = sign puts data inside. `console.log` shows it on screen.',
        xpReward: 20,
      },
      {
        id: 'day1-lesson2',
        title: 'Numbers & Math',
        objective: 'Perform basic arithmetic with variables',
        explanation: 'JavaScript handles math naturally. Store numbers and calculate!',
        hint: 'Try: let a = 10; let b = 5; console.log(a + b);',
        starterCode: `// Calculate the area of a rectangle
// width = 8, height = 5

let width = 8;
let height = 5;
let area = width * height;
console.log("Area:", area);`,
        solutionCode: `let width = 8;
let height = 5;
let area = width * height;
console.log("Area:", area);`,
        expectedOutput: 'Area: 40',
        afterExplanation: 'Numbers don\'t need quotes. `*` multiplies. Variables can store results of calculations.',
        xpReward: 20,
      },
      {
        id: 'day1-lesson3',
        title: 'String Magic',
        objective: 'Combine strings using template literals',
        explanation: 'Template literals use backticks and ${} to embed variables cleanly.',
        hint: 'Use backticks: `Hello ${name}!`',
        starterCode: `let firstName = "Ada";
let lastName = "Lovelace";
let age = 36;

// Use a template literal to print:
// "Ada Lovelace is 36 years old"
console.log(\`\${firstName} \${lastName} is \${age} years old\`);`,
        solutionCode: `let firstName = "Ada";
let lastName = "Lovelace";
let age = 36;
console.log(\`\${firstName} \${lastName} is \${age} years old\`);`,
        expectedOutput: 'Ada Lovelace is 36 years old',
        afterExplanation: 'Backtick strings are "template literals". `${}` injects any variable right into the text.',
        xpReward: 25,
      },
      {
        id: 'day1-lesson4',
        title: 'True or False',
        objective: 'Understand boolean values',
        explanation: 'Booleans are just true or false — the simplest data type.',
        hint: 'let isLoggedIn = true; let isEmpty = false;',
        starterCode: `let isRaining = true;
let isSunny = false;

console.log("Is it raining?", isRaining);
console.log("Is it sunny?", isSunny);

// Flip the boolean!
isRaining = !isRaining;
console.log("After flipping, is it raining?", isRaining);`,
        solutionCode: `let isRaining = true;
let isSunny = false;
console.log("Is it raining?", isRaining);
console.log("Is it sunny?", isSunny);
isRaining = !isRaining;
console.log("After flipping, is it raining?", isRaining);`,
        expectedOutput: 'Is it raining? true',
        afterExplanation: '`true` and `false` are booleans. The `!` operator flips them — like a light switch.',
        xpReward: 20,
      },
    ],
  },
  {
    id: 2,
    title: 'Conditions & Loops',
    subtitle: 'Day 2 — Making Decisions',
    icon: '🔀',
    color: 'from-emerald-500 to-teal-500',
    lessons: [
      {
        id: 'day2-lesson1',
        title: 'If / Else',
        objective: 'Use if/else to make decisions',
        explanation: '`if` runs code when a condition is true. `else` handles everything else.',
        hint: 'if (score >= 60) { ... } else { ... }',
        starterCode: `let score = 75;

if (score >= 60) {
  console.log("You passed!");
} else {
  console.log("Try again!");
}

// Change score to 45 and run again`,
        solutionCode: `let score = 75;
if (score >= 60) {
  console.log("You passed!");
} else {
  console.log("Try again!");
}`,
        expectedOutput: 'You passed!',
        afterExplanation: 'JavaScript reads the condition in `()`. If true, the first `{}` block runs. If false, `else` runs.',
        xpReward: 25,
      },
      {
        id: 'day2-lesson2',
        title: 'For Loops',
        objective: 'Repeat actions using a for loop',
        explanation: 'Loops repeat code without copy-pasting. The `for` loop has 3 parts: start, condition, step.',
        hint: 'for (let i = 1; i <= 5; i++) { ... }',
        starterCode: `// Print numbers 1 to 5 using a loop

for (let i = 1; i <= 5; i++) {
  console.log("Count:", i);
}`,
        solutionCode: `for (let i = 1; i <= 5; i++) {
  console.log("Count:", i);
}`,
        expectedOutput: 'Count: 1',
        afterExplanation: '`i = 1` starts the count. `i <= 5` is when to stop. `i++` adds 1 each round.',
        xpReward: 25,
      },
      {
        id: 'day2-lesson3',
        title: 'While Loops',
        objective: 'Use while loops for uncertain repetition',
        explanation: '`while` keeps looping as long as a condition stays true.',
        hint: 'while (fuel > 0) { fuel--; }',
        starterCode: `let fuel = 5;

while (fuel > 0) {
  console.log("Fuel remaining:", fuel);
  fuel--;
}

console.log("Out of fuel!");`,
        solutionCode: `let fuel = 5;
while (fuel > 0) {
  console.log("Fuel remaining:", fuel);
  fuel--;
}
console.log("Out of fuel!");`,
        expectedOutput: 'Fuel remaining: 5',
        afterExplanation: '`while` checks its condition before each loop. When fuel hits 0, the loop stops.',
        xpReward: 25,
      },
    ],
  },
  {
    id: 3,
    title: 'Functions & Arrays',
    subtitle: 'Day 3 — Power Tools',
    icon: '⚡',
    color: 'from-amber-500 to-orange-500',
    lessons: [
      {
        id: 'day3-lesson1',
        title: 'Your First Function',
        objective: 'Define and call a function',
        explanation: 'Functions are reusable code blocks. Define once, call many times.',
        hint: 'function greet(name) { return "Hello " + name; }',
        starterCode: `function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("Alice"));
console.log(greet("Bob"));
console.log(greet("World"));`,
        solutionCode: `function greet(name) {
  return "Hello, " + name + "!";
}
console.log(greet("Alice"));
console.log(greet("Bob"));`,
        expectedOutput: 'Hello, Alice!',
        afterExplanation: '`function` defines it. `name` is a parameter (input). `return` sends the result back.',
        xpReward: 30,
      },
      {
        id: 'day3-lesson2',
        title: 'Arrays',
        objective: 'Create and access array elements',
        explanation: 'Arrays store lists of items. Access them by index (starting at 0).',
        hint: 'let fruits = ["apple", "banana"]; console.log(fruits[0]);',
        starterCode: `let colors = ["red", "green", "blue", "yellow"];

console.log("First color:", colors[0]);
console.log("Last color:", colors[colors.length - 1]);
console.log("Total colors:", colors.length);

// Add a new color
colors.push("purple");
console.log("After adding:", colors.length, "colors");`,
        solutionCode: `let colors = ["red", "green", "blue", "yellow"];
console.log("First color:", colors[0]);
console.log("Last color:", colors[colors.length - 1]);
console.log("Total colors:", colors.length);
colors.push("purple");
console.log("After adding:", colors.length, "colors");`,
        expectedOutput: 'First color: red',
        afterExplanation: 'Arrays use `[]`. Index starts at 0. `.length` gives the count. `.push()` adds to the end.',
        xpReward: 30,
      },
      {
        id: 'day3-lesson3',
        title: 'Loop Through Arrays',
        objective: 'Use forEach to iterate over an array',
        explanation: '`forEach` calls a function for every item in an array — cleaner than a for loop.',
        hint: 'arr.forEach(item => console.log(item));',
        starterCode: `let planets = ["Mercury", "Venus", "Earth", "Mars"];

planets.forEach(function(planet) {
  console.log("Planet:", planet);
});`,
        solutionCode: `let planets = ["Mercury", "Venus", "Earth", "Mars"];
planets.forEach(function(planet) {
  console.log("Planet:", planet);
});`,
        expectedOutput: 'Planet: Mercury',
        afterExplanation: '`forEach` loops through every item. The function gets each item as its argument.',
        xpReward: 30,
      },
    ],
  },
  {
    id: 4,
    title: 'Objects & DOM',
    subtitle: 'Day 4 — Real World Code',
    icon: '🌐',
    color: 'from-violet-500 to-purple-500',
    lessons: [
      {
        id: 'day4-lesson1',
        title: 'JavaScript Objects',
        objective: 'Create and use objects with properties',
        explanation: 'Objects group related data together using key-value pairs.',
        hint: 'let person = { name: "Alice", age: 30 };',
        starterCode: `let car = {
  brand: "Toyota",
  model: "Camry",
  year: 2023,
  isElectric: false
};

console.log(car.brand, car.model);
console.log("Year:", car.year);
console.log("Electric?", car.isElectric);

// Add a new property
car.color = "silver";
console.log("Color:", car.color);`,
        solutionCode: `let car = { brand: "Toyota", model: "Camry", year: 2023, isElectric: false };
console.log(car.brand, car.model);
console.log("Year:", car.year);
car.color = "silver";
console.log("Color:", car.color);`,
        expectedOutput: 'Toyota Camry',
        afterExplanation: 'Objects use `{}` with `key: value` pairs. Access properties with `.` (dot notation).',
        xpReward: 35,
      },
      {
        id: 'day4-lesson2',
        title: 'DOM Basics',
        objective: 'Understand how JavaScript interacts with HTML',
        explanation: 'The DOM is the live HTML tree. JavaScript can read and change it.',
        hint: 'document.getElementById("title").textContent = "New Title";',
        starterCode: `// Simulating DOM manipulation (in a real browser):

// document.getElementById("title").textContent = "Hello JS!";
// document.getElementById("box").style.background = "coral";

// Here's what it looks like as an object simulation:
let fakeDom = {
  title: { textContent: "Old Title" },
  box: { style: { background: "white" } }
};

fakeDom.title.textContent = "Hello JS!";
fakeDom.box.style.background = "coral";

console.log("Title:", fakeDom.title.textContent);
console.log("Box color:", fakeDom.box.style.background);`,
        solutionCode: `let fakeDom = {
  title: { textContent: "Old Title" },
  box: { style: { background: "white" } }
};
fakeDom.title.textContent = "Hello JS!";
fakeDom.box.style.background = "coral";
console.log("Title:", fakeDom.title.textContent);
console.log("Box color:", fakeDom.box.style.background);`,
        expectedOutput: 'Title: Hello JS!',
        afterExplanation: 'The DOM is a tree of objects. JS can change any element\'s text, style, or attributes in real-time.',
        xpReward: 35,
      },
    ],
  },
  {
    id: 5,
    title: 'Mini Project',
    subtitle: 'Day 5 — Build Something Real',
    icon: '🚀',
    color: 'from-rose-500 to-pink-500',
    lessons: [
      {
        id: 'day5-lesson1',
        title: 'Quiz App Logic',
        objective: 'Build a simple quiz using everything you learned',
        explanation: 'Combine variables, arrays, objects, loops, and functions in one program.',
        hint: 'Create a questions array with objects, loop through them, track score.',
        starterCode: `let questions = [
  { q: "What keyword declares a variable?", a: "let" },
  { q: "What does // do in JavaScript?", a: "comment" },
  { q: "How do you print to console?", a: "console.log" }
];

let score = 0;
let userAnswers = ["let", "comment", "console.log"]; // simulated user input

questions.forEach(function(question, index) {
  let userAnswer = userAnswers[index];
  let isCorrect = userAnswer === question.a;

  if (isCorrect) {
    score++;
    console.log("Q" + (index+1) + ": Correct!");
  } else {
    console.log("Q" + (index+1) + ": Wrong. Answer was: " + question.a);
  }
});

console.log("\\nFinal score:", score + "/" + questions.length);`,
        solutionCode: `let questions = [
  { q: "What keyword declares a variable?", a: "let" },
  { q: "What does // do in JavaScript?", a: "comment" }
];
let score = 0;
let userAnswers = ["let", "comment"];
questions.forEach(function(question, index) {
  let userAnswer = userAnswers[index];
  if (userAnswer === question.a) { score++; console.log("Q"+(index+1)+": Correct!"); }
  else { console.log("Q"+(index+1)+": Wrong."); }
});
console.log("Score:", score+"/"+questions.length);`,
        expectedOutput: 'Correct!',
        afterExplanation: 'You just used arrays, objects, loops, functions, and conditions together — that\'s real programming!',
        xpReward: 50,
      },
    ],
  },
];
