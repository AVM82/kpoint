
import { $generateHtmlFromNodes } from '@lexical/html';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { EditorRefPlugin } from '@lexical/react/LexicalEditorRefPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { Box } from '@mui/material';
import { EditorState, LexicalEditor } from 'lexical';
import { lexicalEditorConfig } from 'lexical/config/lexical-editor-config';
import { FC, useRef, useState } from 'react';

import { LexicalAutoLinkPlugin } from '../auto-link-plugin/auto-link-plugin';
import { LexicalDefaultValuePlugin } from '../lexical-default-value-plugin/lexical-default-value-plugin';
import { FloatingLinkEditorPlugin } from '../lexical-floating-text-format-plugin/lexical-floating-text-format-plugin';
import { ToolbarPlugin } from '../lexical-toolbar-plugin/lexical-toolbar-plugin';
import { MuiContentEditable } from './editorStyle';

const Placeholder: FC = () => {
  return <Box sx={{
    color: '#999',
    overflow: 'hidden',
    position: 'absolute',
    textOverflow: 'ellipsis',
    top: '15px',
    left: '10px',
    fontSize: '15px',
    userSelect: 'none',
    display: 'inline-block',
    pointerEvents: 'none',
  }}>
    Почніть писати опис проєкту
  </Box>;
};

interface EditorProps {
  onChange?: (htmlString: string) => void,
  onCreate?: (field: string, value: string | File) => void,
  description: string;
}

const Editor:FC<EditorProps> = ({ onChange, onCreate, description }) => {
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
  
      if (onChange) onChange(($generateHtmlFromNodes(editor.current as LexicalEditor, null)));
      else if (onCreate) onCreate('description', ($generateHtmlFromNodes(editor.current as LexicalEditor, null)));
    });
  };

  return (
    <LexicalComposer initialConfig={lexicalEditorConfig}>
      <Box sx={{
        margin: '20px auto 20px auto',
        borderRadius: '2px',
        color: '#000',
        position: 'relative',
        lineHeight: '20px',
        fontWeight: '400',
        textAlign: 'left',
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px',
      }}>
        <ToolbarPlugin />
        <Box sx={{
          background: '#fff',
          position: 'relative',
          border: '1px solid gray',
        }}>
          <RichTextPlugin
            contentEditable={
              <div className="editor-scroller">
                <div className="editor" ref={onRef}>
                  <MuiContentEditable />
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
        </Box>
      </Box>
    </LexicalComposer>
  );
};

export { Editor };