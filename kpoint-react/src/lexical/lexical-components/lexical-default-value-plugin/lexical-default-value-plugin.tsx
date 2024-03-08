import { $generateNodesFromDOM } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, LexicalEditor } from 'lexical';
import { FC, useEffect } from 'react';

const LexicalDefaultValuePlugin: FC<{ value: string | null }> = ({ value }) => {
  const [editor] = useLexicalComposerContext();

  const updateHTML = (editor: LexicalEditor, value: string, clear: boolean): void => {
    const root = $getRoot();
    const parser = new DOMParser();
    const dom = parser.parseFromString(value, 'text/html');
    const nodes = $generateNodesFromDOM(editor, dom);

    if (clear) {
      root.clear();
    }
    root.append(...nodes);
  };

  useEffect(() => {
    if (editor && value) {
      editor.update(() => {
        updateHTML(editor, value, true);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return null;
};

export { LexicalDefaultValuePlugin };