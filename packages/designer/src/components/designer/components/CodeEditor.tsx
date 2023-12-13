import MonacoEditor, { type EditorProps } from '@monaco-editor/react'

type CodeEditorProps = Pick<
  EditorProps,
  'height' | 'width' | 'language' | 'value' | 'options'
> & {
  onChange?: (v?: string) => void
}

const defaultOptions: EditorProps['options'] = {
  automaticLayout: true,
  folding: true,
  lineNumbers: 'on',
  wordWrap: 'off',
  formatOnPaste: true,
  fontSize: 12,
  tabSize: 2,
  autoIndent: 'full',
  scrollBeyondLastLine: false,
  snippetSuggestions: 'top',
  minimap: {
    enabled: false,
  },
  scrollbar: {
    vertical: 'auto',
    horizontal: 'auto',
  },
}

export function CodeEditor({
  height = '100%',
  width = '100%',
  language = 'js',
  value,
  options = {},
  onChange = (_?: string) => void 0,
}: CodeEditorProps) {
  return (
    <MonacoEditor
      height={height}
      width={width}
      language={language}
      options={{
        ...defaultOptions,
        ...options,
      }}
      value={value}
      onChange={onChange}
    />
  )
}
