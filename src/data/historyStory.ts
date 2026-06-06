export interface HistoryScene {
  id: string;
  year: string;
  title: string;
  background: string;
  character: string;
  dialogue: string[];
  choices?: { text: string; next: string; effect?: string }[];
  next?: string;
}

export const historyScenes: HistoryScene[] = [
  {
    id: 'intro',
    year: '1995',
    title: 'The Internet Explosion',
    background: 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900',
    character: 'Narrator',
    dialogue: [
      'It\'s 1995. The World Wide Web is barely 4 years old.',
      'Websites are static pages — text, images, no interactivity.',
      'Netscape Navigator controls 80% of the browser market.',
      'But something is missing. The web feels... dead.',
    ],
    choices: [
      { text: 'What happens next?', next: 'netscape' },
      { text: 'Who fixes this?', next: 'brendan-intro' },
    ],
  },
  {
    id: 'brendan-intro',
    year: '1995',
    title: 'Meet Brendan Eich',
    background: 'bg-gradient-to-br from-gray-900 via-zinc-900 to-gray-900',
    character: 'Brendan Eich',
    dialogue: [
      '"I\'m Brendan Eich. I just joined Netscape Communications."',
      '"My job? Make the web interactive."',
      '"Oh, and they want it done... in 10 days."',
      '"Most people build languages over years. I had 10 days."',
    ],
    choices: [
      { text: '"10 days?! That\'s impossible!"', next: 'deadline', effect: 'Brendan smiles...' },
      { text: '"Tell me more about the deadline."', next: 'deadline' },
    ],
  },
  {
    id: 'netscape',
    year: '1995',
    title: 'Netscape\'s Vision',
    background: 'bg-gradient-to-br from-blue-950 via-indigo-950 to-blue-950',
    character: 'Netscape Executive',
    dialogue: [
      '"The web needs a scripting language."',
      '"Something simple. Something beginners can use."',
      '"We need it for our next browser release."',
      '"Find someone. Give them 10 days. Make it happen."',
    ],
    next: 'brendan-intro',
  },
  {
    id: 'deadline',
    year: 'May 1995',
    title: 'The 10-Day Sprint',
    background: 'bg-gradient-to-br from-amber-950 via-orange-950 to-amber-950',
    character: 'Brendan Eich',
    dialogue: [
      '"I worked day and night. Coffee. Code. Repeat."',
      '"I borrowed ideas from Java, Scheme, and Self."',
      '"But I made it feel approachable — like English."',
      '"On Day 10... I had something. I called it Mocha."',
    ],
    choices: [
      { text: '"Mocha? I thought it was JavaScript?"', next: 'naming' },
      { text: '"What did it look like?"', next: 'first-code' },
    ],
  },
  {
    id: 'naming',
    year: '1995',
    title: 'A Marketing Decision',
    background: 'bg-gradient-to-br from-yellow-950 via-amber-950 to-yellow-950',
    character: 'Narrator',
    dialogue: [
      'Mocha became LiveScript. Then... JavaScript.',
      'Java was the hottest language in 1995.',
      'Netscape called it "JavaScript" for marketing buzz.',
      'Brendan jokes: "It\'s like calling a cat a catfish."',
    ],
    next: 'legacy',
  },
  {
    id: 'first-code',
    year: '1995',
    title: 'The First JavaScript',
    background: 'bg-gradient-to-br from-green-950 via-emerald-950 to-green-950',
    character: 'Brendan Eich',
    dialogue: [
      '"Here — I\'ll show you the very first JS program."',
      '"alert(\'Hello, World!\');"',
      '"One line. It made the browser show a popup."',
      '"That was magic in 1995. The web could REACT."',
    ],
    next: 'legacy',
  },
  {
    id: 'legacy',
    year: '2024',
    title: 'JavaScript Today',
    background: 'bg-gradient-to-br from-violet-950 via-purple-950 to-violet-950',
    character: 'Narrator',
    dialogue: [
      '10 days. One language. 30 years later...',
      'JavaScript runs on 98% of all websites.',
      'It powers React, Node.js, VS Code, and Netflix.',
      'The most popular language in the world — born from a deadline.',
    ],
    choices: [
      { text: 'Start my own sprint!', next: 'end', effect: 'ready-to-learn' },
      { text: 'Amazing. Let\'s begin!', next: 'end', effect: 'ready-to-learn' },
    ],
  },
  {
    id: 'end',
    year: 'Now',
    title: 'Your Turn',
    background: 'bg-gradient-to-br from-rose-950 via-pink-950 to-rose-950',
    character: 'Brendan Eich',
    dialogue: [
      '"He had 10 days. You have 5."',
      '"Same language. Better tools. Infinite possibilities."',
      '"Ready to write your first line of JavaScript?"',
    ],
    next: 'done',
  },
];
