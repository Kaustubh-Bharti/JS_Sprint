import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';

const JS_SYMBOLS = ['{ }', '=>', '( )', '===', '[]', '++', 'let', 'const', 'fn()', '&&', '||', '!', ';', '//'];

function FloatingSymbol({ symbol }: { symbol: string; index: number }) {
  const x = Math.random() * 90 + 5;
  const delay = Math.random() * 5;
  const duration = 8 + Math.random() * 12;
  const size = 14 + Math.random() * 14;

  return (
    <motion.div
      className="absolute font-mono font-bold select-none pointer-events-none opacity-20"
      style={{ left: `${x}%`, bottom: '-10%', fontSize: size, color: '#f59e0b' }}
      initial={{ y: 0, opacity: 0 }}
      animate={{
        y: [0, -window.innerHeight - 100],
        opacity: [0, 0.2, 0.2, 0],
        rotate: [0, (Math.random() - 0.5) * 40],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {symbol}
    </motion.div>
  );
}

interface HeroProps {
  onStart: () => void;
  onSkillTest: () => void;
}

export default function Hero({ onStart, onSkillTest }: HeroProps) {
  const { colors } = useTheme();

  const symbols = [...JS_SYMBOLS, ...JS_SYMBOLS, ...JS_SYMBOLS];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Floating symbols */}
      <div className="absolute inset-0 overflow-hidden">
        {symbols.map((s, i) => (
          <FloatingSymbol key={i} symbol={s} index={i} />
        ))}
      </div>

      {/* Gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }}
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15"
        style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }}
        animate={{ scale: [1, 1.3, 1], x: [0, -25, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-24">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-6"
        >
          <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${colors.badgeBg} ${colors.badgeText} border ${colors.badgeBorder}`}>
            <span className="mr-1">⚡</span> Learn JavaScript in 5 days — not 6 months
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className={`text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4 ${colors.text}`}
        >
          Brendan Eich created{' '}
          <span className={`bg-gradient-to-r ${colors.accent} bg-clip-text text-transparent`}>
            JavaScript
          </span>
          {' '}in only{' '}
          <span className={`bg-gradient-to-r ${colors.highlight} bg-clip-text text-transparent`}>
            10 days.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className={`text-2xl sm:text-3xl font-bold mb-3 ${colors.text}`}
        >
          You don't need 6 months to learn it.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className={`text-lg sm:text-xl mb-4 ${colors.muted} max-w-2xl mx-auto`}
        >
          Learn the fundamentals in just{' '}
          <strong className={colors.text}>5 days.</strong>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className={`text-base sm:text-lg mb-10 ${colors.muted} max-w-xl mx-auto italic`}
        >
          "Learn by experimenting, not reading."
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={onStart}
            className={`group relative px-8 py-4 rounded-2xl text-lg font-bold text-white bg-gradient-to-r ${colors.accent} shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200`}
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Learning
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </span>
          </button>

          <button
            onClick={onSkillTest}
            className={`px-8 py-4 rounded-2xl text-lg font-bold border-2 ${colors.border} ${colors.text} hover:scale-105 transition-all duration-200 hover:bg-black/5`}
          >
            Take a 2-Minute Skill Test
          </button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto"
        >
          {[
            { value: '5', label: 'Days' },
            { value: '15+', label: 'Lessons' },
            { value: '8+', label: 'Challenges' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className={`text-3xl font-extrabold bg-gradient-to-r ${colors.accent} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
              <div className={`text-sm ${colors.muted}`}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 ${colors.muted}`}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-1 text-xs">
          <span>Scroll</span>
          <span>↓</span>
        </div>
      </motion.div>
    </section>
  );
}
