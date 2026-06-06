import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';

const features = [
  {
    icon: '🎮',
    title: 'Learn Like a Game',
    desc: 'XP, levels, streaks, badges. Every lesson rewards you. Every challenge unlocks something new.',
  },
  {
    icon: '⚡',
    title: 'Run Code Instantly',
    desc: 'Write code and see output in real-time. No setup, no terminal, no confusion.',
  },
  {
    icon: '🧠',
    title: 'Tiny Explanations',
    desc: 'Max 50 words per concept. No walls of text. Just the essential idea, then practice it.',
  },
  {
    icon: '🏆',
    title: 'Practice Arena',
    desc: 'LeetCode-style challenges with real scenarios. Easy, medium, hard. Auto-graded.',
  },
  {
    icon: '🎬',
    title: 'JS History Story',
    desc: 'Interactive cinematic experience. Meet Brendan Eich. Live through the 10-day creation.',
  },
  {
    icon: '🌟',
    title: 'Visual Feedback',
    desc: 'After running code, watch animated diagrams show exactly what happened.',
  },
];

export default function FeaturesSection() {
  const { colors, isDark } = useTheme();

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className={`text-4xl font-extrabold mb-3 ${colors.text}`}>Why JS Sprint?</h2>
          <p className={`text-lg ${colors.muted}`}>Because tutorials are boring. This isn't a tutorial.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white/70 border-white/50'} border rounded-2xl p-6 backdrop-blur-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.02]`}
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className={`text-lg font-bold mb-2 ${colors.text}`}>{f.title}</h3>
              <p className={`text-sm leading-relaxed ${colors.muted}`}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
