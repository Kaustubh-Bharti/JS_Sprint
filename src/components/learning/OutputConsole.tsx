import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, AlertTriangle } from 'lucide-react';

interface OutputConsoleProps {
  output: string[];
  error: string | null;
  running: boolean;
}

export default function OutputConsole({ output, error, running }: OutputConsoleProps) {
  const lineCount = output.length + (error ? 1 : 0);
  const contentMinHeight = output.length === 0 && !error && !running ? 120 : undefined;

  return (
    <div className="rounded-xl overflow-hidden border border-gray-700/50 shadow-lg flex flex-col bg-gray-950">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-900 border-b border-gray-700/50 shrink-0">
        <Terminal size={14} className="text-green-400" />
        <span className="text-xs text-gray-400 font-mono">Output</span>
        {running && (
          <span className="ml-auto flex items-center gap-1 text-xs text-yellow-400">
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-yellow-400 inline-block"
            />
            Running...
          </span>
        )}
      </div>

      <div
        className="bg-gray-950 p-4 font-mono text-sm overflow-auto"
        style={{ minHeight: contentMinHeight, maxHeight: lineCount > 8 ? 320 : undefined }}
      >
        <AnimatePresence>
          {output.length === 0 && !error && !running && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-600 italic text-xs"
            >
              // Run your code to see output here
            </motion.div>
          )}

          {output.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="text-green-400 mb-0.5 leading-relaxed"
            >
              <span className="text-gray-600 mr-2 select-none text-xs">{String(i + 1).padStart(2, ' ')} |</span>
              {line}
            </motion.div>
          ))}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-2 text-red-400 mt-1"
            >
              <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
              <span className="text-xs leading-relaxed">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
