import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
  readOnly?: boolean;
}

export default function CodeEditor({ value, onChange, height = '280px', readOnly = false }: CodeEditorProps) {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-700/50 shadow-lg">
      <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 border-b border-gray-700/50">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-2 text-xs text-gray-400 font-mono">script.js</span>
      </div>
      <Editor
        height={height}
        defaultLanguage="javascript"
        value={value}
        onChange={(val) => onChange(val || '')}
        theme="vs-dark"
        options={{
          fontSize: 14,
          fontFamily: '"Fira Code", "Cascadia Code", monospace',
          fontLigatures: true,
          minimap: { enabled: false },
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          padding: { top: 12, bottom: 12 },
          readOnly,
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          tabSize: 2,
        }}
      />
    </div>
  );
}
