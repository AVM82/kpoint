/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  $createCodeNode,
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  CODE_LANGUAGE_MAP,
  getLanguageFriendlyName,
} from '@lexical/code';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
  $isListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  HeadingTagType,
} from '@lexical/rich-text';
import {
  $getSelectionStyleValueForProperty,
  $isParentElementRTL,
  $patchStyleText,
  $selectAll,
  $setBlocksType,
} from '@lexical/selection';
import {
  $findMatchingParent,
  $getNearestBlockElementAncestorOrThrow,
  $getNearestNodeOfType,
  mergeRegister,
} from '@lexical/utils';
import { FormatAlignCenterOutlined, FormatListBulletedOutlined, FormatListNumberedOutlined,
  FormatQuoteOutlined, SegmentOutlined } from '@mui/icons-material';
import CodeIcon from '@mui/icons-material/Code';
import FormatAlignJustifyOutlined from '@mui/icons-material/FormatAlignJustifyOutlined';
import FormatAlignLeftOutlined from '@mui/icons-material/FormatAlignLeftOutlined';
import FormatAlignRightOutlined from '@mui/icons-material/FormatAlignRightOutlined';
import FormatBoldOutlinedIcon from '@mui/icons-material/FormatBoldOutlined';
import FormatItalicOutlinedIcon from '@mui/icons-material/FormatItalicOutlined';
import FormatUnderlinedOutlinedIcon from '@mui/icons-material/FormatUnderlinedOutlined';
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';
import RedoOutlinedIcon from '@mui/icons-material/RedoOutlined';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import {
  $createParagraphNode,
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $isTextNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  LexicalEditor,
  NodeKey,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import { FormatHeader1, FormatHeader2, FormatHeader3, FormatListChecks } from 'mdi-material-ui';
import { FC, useCallback, useEffect, useState } from 'react';

import { getSelectedNode } from '../../utils/get-select-node';
import { sanitizeUrl } from '../../utils/url';
import { DropDown,DropDownItem } from '../dropdown/dropdown';

const blockTypeToBlockName = {
  bullet: 'Bulleted List',
  check: 'Check List',
  code: 'Code Block',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  number: 'Numbered List',
  paragraph: 'Normal',
  quote: 'Quote',
};

function getCodeLanguageOptions(): [string, string][] {
  const options: [string, string][] = [];

  for (const [lang, friendlyName] of Object.entries(
    CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  )) {
    options.push([lang, friendlyName]);
  }

  return options;
}

const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();

const FONT_FAMILY_OPTIONS: [string, string][] = [
  ['Arial', 'Arial'],
  ['Courier New', 'Courier New'],
  ['Georgia', 'Georgia'],
  ['Times New Roman', 'Times New Roman'],
  ['Trebuchet MS', 'Trebuchet MS'],
  ['Verdana', 'Verdana'],
];

const FONT_SIZE_OPTIONS: [string, string][] = [
  ['10px', '10px'],
  ['11px', '11px'],
  ['12px', '12px'],
  ['13px', '13px'],
  ['14px', '14px'],
  ['15px', '15px'],
  ['16px', '16px'],
  ['17px', '17px'],
  ['18px', '18px'],
  ['19px', '19px'],
  ['20px', '20px'],
];

function dropDownActiveClass(active: boolean): string {
  if (active) return 'active dropdown-item-active';

  return '';
}

interface BlockFormatDropDownProps {
    blockType: keyof typeof blockTypeToBlockName;
  editor: LexicalEditor;
  disabled?: boolean;
}

interface FontDropDownProps {
    editor: LexicalEditor;
  value: string;
  style: string;
  disabled?: boolean;
}

const BlockFormatDropDown: FC<BlockFormatDropDownProps> = ({
  editor,
  blockType,
  disabled = false,
}) => {
  const formatParagraph = (): void => {
    editor.update(() => {
      const selection = $getSelection();

      if (
        $isRangeSelection(selection)
      ) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize: HeadingTagType): void => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();

        if (
          $isRangeSelection(selection)
        ) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
  };

  const formatBulletList = (): void => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatCheckList = (): void => {
    if (blockType !== 'check') {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = (): void => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatQuote = (): void => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();

        if (
          $isRangeSelection(selection)
        ) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const formatCode = (): void => {
    if (blockType !== 'code') {
      editor.update(() => {
        let selection = $getSelection();

        if (
          $isRangeSelection(selection)
        ) {
          if (selection?.isCollapsed()) {
            $setBlocksType(selection, () => $createCodeNode());
          } else {
            const textContent = selection?.getTextContent();
            const codeNode = $createCodeNode();
            selection?.insertNodes([codeNode]);
            selection = $getSelection();

            if ($isRangeSelection(selection))
              selection.insertRawText(textContent as string);
          }
        }
      });
    }
  };

  return (
    <DropDown
      disabled={disabled}
      buttonClassName="toolbar-item block-controls style-dropdown"
      buttonLabel={blockTypeToBlockName[blockType]}
      buttonAriaLabel="Formatting options for text style"
    >
      <DropDownItem
        className={'item ' + dropDownActiveClass(blockType === 'paragraph')}
        onClick={formatParagraph}
      >
        <SegmentOutlined fontSize="small"/>
        <span className="text">Normal</span>
      </DropDownItem>
      <DropDownItem
        className={'item ' + dropDownActiveClass(blockType === 'h1')}
        onClick={(): void => formatHeading('h1')}
      >
        <FormatHeader1 fontSize="small"/>
        <span className="text">Heading 1</span>
      </DropDownItem>
      <DropDownItem
        className={'item ' + dropDownActiveClass(blockType === 'h2')}
        onClick={(): void => formatHeading('h2')}
      >
        <FormatHeader2 fontSize="small"/>
        <span className="text">Heading 2</span>
      </DropDownItem>
      <DropDownItem
        className={'item ' + dropDownActiveClass(blockType === 'h3')}
        onClick={(): void => formatHeading('h3')}
      >
        <FormatHeader3 fontSize="small"/>
        <span className="text">Heading 3</span>
      </DropDownItem>
      <DropDownItem
        className={'item ' + dropDownActiveClass(blockType === 'bullet')}
        onClick={formatBulletList}
      >
        <FormatListBulletedOutlined fontSize="small"/>
        <span className="text">Bullet List</span>
      </DropDownItem>
      <DropDownItem
        className={'item ' + dropDownActiveClass(blockType === 'number')}
        onClick={formatNumberedList}
      >
        <FormatListNumberedOutlined fontSize="small"/>
        <span className="text">Numbered List</span>
      </DropDownItem>
      <DropDownItem
        className={'item ' + dropDownActiveClass(blockType === 'check')}
        onClick={formatCheckList}
      >
        <FormatListChecks fontSize="small"/>
        <span className="text">Check List</span>
      </DropDownItem>
      <DropDownItem
        className={'item ' + dropDownActiveClass(blockType === 'quote')}
        onClick={formatQuote}
      >
        <FormatQuoteOutlined fontSize="small"/>
        <span className="text">Quote</span>
      </DropDownItem>
      <DropDownItem
        className={'item ' + dropDownActiveClass(blockType === 'code')}
        onClick={formatCode}
      >
        <CodeIcon fontSize="small"/>
        <span className="text">Code Block</span>
      </DropDownItem>
    </DropDown>
  );
};

const Divider: FC = () => {
  return <div className="divider" />;
};

const FontDropDown: FC<FontDropDownProps> = ({
  editor,
  value,
  style,
  disabled = false,
}) => {
  const handleClick = useCallback(
    (option: string) => {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, {
            [style]: option,
          });
        }
      });
    },
    [editor, style],
  );

  const buttonAriaLabel =
    style === 'font-family'
      ? 'Formatting options for font family'
      : 'Formatting options for font size';

  return (
    <DropDown
      disabled={disabled}
      buttonClassName={'toolbar-item ' + style + ' font-dropdown'}
      buttonLabel={value}
      buttonAriaLabel={buttonAriaLabel}
    >
      {(style === 'font-family' ? FONT_FAMILY_OPTIONS : FONT_SIZE_OPTIONS).map(
        ([option, text]) => (
          <DropDownItem
            className={`item ${dropDownActiveClass(value === option)} ${
              style === 'font-size' ? 'fontsize-item' : ''
            }`}
            onClick={(): void => handleClick(option)}
            key={option}
          >
            <span className="text">{text}</span>
          </DropDownItem>
        ),
      )}
    </DropDown>
  );
};

const ToolbarPlugin: FC = () => {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [blockType, setBlockType] =
    useState<keyof typeof blockTypeToBlockName>('paragraph');
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(
    null,
  );
  const [fontSize, setFontSize] = useState<string>('15px');
  const [, setFontColor] = useState<string>('#000');
  const [, setBgColor] = useState<string>('#fff');
  const [fontFamily, setFontFamily] = useState<string>('Arial');
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [, setIsStrikethrough] = useState(false);
  const [, setIsSubscript] = useState(false);
  const [, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [, setIsRTL] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState<string>('');
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const IS_APPLE = false;

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
            const parent = e.getParent();

            return parent !== null && $isRootOrShadowRoot(parent);
          });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsSubscript(selection.hasFormat('subscript'));
      setIsSuperscript(selection.hasFormat('superscript'));
      setIsCode(selection.hasFormat('code'));
      setIsRTL($isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();

      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);

        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode,
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();

          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName);
          }

          if ($isCodeNode(element)) {
            const language =
              element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
            setCodeLanguage(
              language ? CODE_LANGUAGE_MAP[language] || language : '',
            );

            return;
          }
        }
      }
      // Handle buttons
      setFontSize(
        $getSelectionStyleValueForProperty(selection, 'font-size', '15px'),
      );
      setFontColor(
        $getSelectionStyleValueForProperty(selection, 'color', '#000'),
      );
      setBgColor(
        $getSelectionStyleValueForProperty(
          selection,
          'background-color',
          '#fff',
        ),
      );
      setFontFamily(
        $getSelectionStyleValueForProperty(selection, 'font-family', 'Arial'),
      );
    }
  }, [activeEditor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        updateToolbar();
        setActiveEditor(newEditor);

        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);

          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);

          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  }, [activeEditor, editor, updateToolbar]);

  const onCodeLanguageSelect = useCallback(
    (value: string) => {
      activeEditor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);

          if ($isCodeNode(node)) {
            node.setLanguage(value);
          }
        }
      });
    },
    [activeEditor, selectedElementKey],
  );

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl('https://'));
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  return (
    <div className="toolbar proj-create-page">
      <button
        disabled={!canUndo || !isEditable}
        onClick={(): void => {
          activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        title={IS_APPLE ? 'Undo (⌘Z)' : 'Undo (Ctrl+Z)'}
        type="button"
        className="toolbar-item spaced undo"
        aria-label="Undo"
      >
        <UndoOutlinedIcon fontSize="small"/>
      </button>
      <button
        disabled={!canRedo || !isEditable}
        onClick={(): void => {
          activeEditor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        title={IS_APPLE ? 'Redo (⌘Y)' : 'Redo (Ctrl+Y)'}
        type="button"
        className="toolbar-item redo"
        aria-label="Redo"
      >
        <RedoOutlinedIcon fontSize="small"/>
      </button>
      {blockType in blockTypeToBlockName && activeEditor === editor && (
        <>
          <BlockFormatDropDown
            disabled={!isEditable}
            blockType={blockType}
            editor={editor}
          />
        </>
      )}
      {blockType === 'code' ? (
        <>
          <DropDown
            disabled={!isEditable}
            buttonClassName="toolbar-item code-language"
            buttonLabel={getLanguageFriendlyName(codeLanguage)}
            buttonAriaLabel="Select language"
          >
            {CODE_LANGUAGE_OPTIONS.map(([value, name]) => {
              return (
                <DropDownItem
                  className={`item ${dropDownActiveClass(
                    value === codeLanguage,
                  )}`}
                  onClick={(): void => onCodeLanguageSelect(value)}
                  key={value}
                >
                  <span className="text">{name}</span>
                </DropDownItem>
              );
            })}
          </DropDown>
        </>
      ) : (
        <>
          <FontDropDown
            disabled={!isEditable}
            // eslint-disable-next-line react/style-prop-object
            style={'font-family'}
            value={fontFamily}
            editor={editor}
          />
          <FontDropDown
            disabled={!isEditable}
            // eslint-disable-next-line react/style-prop-object
            style={'font-size'}
            value={fontSize}
            editor={editor}
          />
          <button
            disabled={!isEditable}
            onClick={(): void => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
            }}
            className={'toolbar-item spaced bold' + (isBold ? 'active' : '')}
            title={IS_APPLE ? 'Bold (⌘B)' : 'Bold (Ctrl+B)'}
            type="button"
            aria-label={`Format text as bold. Shortcut: ${
              IS_APPLE ? '⌘B' : 'Ctrl+B'
            }`}
          >
            <FormatBoldOutlinedIcon fontSize="small"/>
          </button>
          <button
            disabled={!isEditable}
            onClick={(): void => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
            }}
            className={'toolbar-item spaced italic' + (isItalic ? 'active' : '')}
            title={IS_APPLE ? 'Italic (⌘I)' : 'Italic (Ctrl+I)'}
            type="button"
            aria-label={`Format text as italics. Shortcut: ${
              IS_APPLE ? '⌘I' : 'Ctrl+I'
            }`}
          >
            <FormatItalicOutlinedIcon fontSize="small"/>
          </button>
          <button
            disabled={!isEditable}
            onClick={(): void => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
            }}
            className={'toolbar-item spaced underline' + (isUnderline ? 'active' : '')}
            title={IS_APPLE ? 'Underline (⌘U)' : 'Underline (Ctrl+U)'}
            type="button"
            aria-label={`Format text to underlined. Shortcut: ${
              IS_APPLE ? '⌘U' : 'Ctrl+U'
            }`}
          >
            <FormatUnderlinedOutlinedIcon fontSize="small"/>
          </button>
          <button
            disabled={!isEditable}
            onClick={(): void => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
            }}
            className={'toolbar-item spaced code' + (isCode ? 'active' : '')}
            title="Insert code block"
            type="button"
            aria-label="Insert code block"
          >
            <CodeIcon fontSize="small"/>
          </button>
          <button
            disabled={!isEditable}
            onClick={insertLink}
            className={'toolbar-item spaced link' + (isLink ? 'active' : '')}
            aria-label="Insert link"
            title="Insert link"
            type="button"
          >
            <InsertLinkOutlinedIcon fontSize="small"/>
          </button>
          <DropDown
            disabled={!isEditable}
            buttonLabel="Align"
            buttonClassName="toolbar-item spaced alignment"
            buttonAriaLabel="Formatting options for text alignment"
          >
            <DropDownItem
              onClick={(): void => {
                activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
              }}
              className="item"
            >
              <FormatAlignLeftOutlined fontSize="small"/>
              <span className="text">Left Align</span>
            </DropDownItem>
            <DropDownItem
              onClick={(): void => {
                activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
              }}
              className="item"
            >
              <FormatAlignCenterOutlined fontSize="small"/>
              <span className="text">Center Align</span>
            </DropDownItem>
            <DropDownItem
              onClick={(): void => {
                activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
              }}
              className="item"
            >
              <FormatAlignRightOutlined fontSize="small"/>
              <span className="text">Right Align</span>
            </DropDownItem>
            <DropDownItem
              onClick={(): void => {
                activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
              }}
              className="item"
            >
              <FormatAlignJustifyOutlined fontSize="small"/>
              <span className="text">Justify Align</span>
            </DropDownItem>
          </DropDown>
        </>
      )}
    </div>  
  );
};

export { ToolbarPlugin };