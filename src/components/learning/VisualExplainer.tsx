import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';

interface VisualExplainerProps {
  explanation: string;
  show: boolean;
  code: string;
}

function extractVariables(code: string): { name: string; value: string }[] {
  const vars: { name: string; value: string }[] = [];
  const patterns = [
    /(?:let|const|var)\s+(\w+)\s*=\s*([^;,\n]+)/g,
  ];
  for (const pattern of patterns) {
    let m;
    while ((m = pattern.exec(code)) !== null) {
      vars.push({ name: m[1], value: m[2].trim() });
    }
  }
  return vars.slice(0, 6);
}

export default function VisualExplainer({ explanation, show, code }: VisualExplainerProps) {
  const { colors, isDark } = useTheme();
  const variables = extractVariables(code);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ duration: 0.4 }}
          className={`rounded-xl overflow-hidden border ${colors.border} ${isDark ? 'bg-white/5' : 'bg-white/80'} mt-4`}
        >
          <div className={`px-4 py-2 border-b ${colors.border} flex items-center gap-2`}>
            <span className="text-sm font-semibold">🔍</span>
            <span className={`text-sm font-semibold ${colors.text}`}>What happened?</span>
          </div>

          <div className="p-4">
            {/* Explanation text */}
            <p className={`text-sm leading-relaxed mb-4 ${colors.muted}`}>{explanation}</p>

            {/* Variable flow diagram */}
            {variables.length > 0 && (
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${colors.muted}`}>Variables in memory</p>
                <div className="flex flex-wrap gap-2">
                  {variables.map((v, i) => (
                    <motion.div
                      key={v.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className={`relative flex flex-col rounded-lg overflow-hidden border ${colors.border} shadow-sm`}
                    >
                      <div className={`px-3 py-1 text-xs font-mono font-bold bg-gradient-to-r ${colors.accent} text-white`}>
                        {v.name}
                      </div>
                      <div className={`px-3 py-2 text-xs font-mono ${isDark ? 'bg-slate-800 text-green-400' : 'bg-gray-50 text-gray-800'}`}>
                        {v.value.length > 20 ? v.value.slice(0, 20) + '...' : v.value}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
