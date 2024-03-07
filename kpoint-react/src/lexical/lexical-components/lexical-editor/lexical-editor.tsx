
import { $generateHtmlFromNodes } from '@lexical/html';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { EditorRefPlugin } from '@lexical/react/LexicalEditorRefPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { EditorState, LexicalEditor } from 'lexical';
import { lexicalEditorConfig } from 'lexical/config/lexical-editor-config';
import { FC, useRef, useState } from 'react';

import { LexicalAutoLinkPlugin } from '../auto-link-plugin/auto-link-plugin';
import { LexicalDefaultValuePlugin } from '../lexical-default-value-plugin/lexical-default-value-plugin';
import { FloatingLinkEditorPlugin } from '../lexical-floating-text-format-plugin/lexical-floating-text-format-plugin';
import { ToolbarPlugin } from '../lexical-toolbar-plugin/lexical-toolbar-plugin';
import { TreeViewPlugin } from '../lexical-treeview-pluign/lexical-treeview-plugin';

const Placeholder: FC = () => {
  return <div className="editor-placeholder">Enter some rich text...</div>;
};

const Editor:FC<{ onChange: (htmlString: string) => void, description: string }> = ({ onChange, description }) => {
  const editor = useRef<LexicalEditor>(null);
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);

  const onRef = (_floatingAnchorElem: HTMLDivElement): void => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const transformNodesToHTMLString = (editorState: EditorState): void => {
    editorState.read(() => {
  
      onChange(($generateHtmlFromNodes(editor.current as LexicalEditor, null)));
    });
  };

  return (
    <LexicalComposer initialConfig={lexicalEditorConfig}>
      <div className="editor-container">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={
              <div className="editor-scroller">
                <div className="editor" ref={onRef}>
                  <ContentEditable className="editor-input" />
                </div>
              </div>
            }
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={transformNodesToHTMLString}/>
          <HistoryPlugin />
          <AutoFocusPlugin />
          <LexicalAutoLinkPlugin />
          <TreeViewPlugin />
          <LexicalDefaultValuePlugin value={description}/>
          <EditorRefPlugin editorRef={editor} />
          {floatingAnchorElem && (
            <FloatingLinkEditorPlugin
              anchorElem={floatingAnchorElem}
              isLinkEditMode={isLinkEditMode}
              setIsLinkEditMode={setIsLinkEditMode}
            />
          )}
          <ListPlugin />
          <LinkPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
};

export { Editor };