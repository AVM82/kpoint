import styled from '@emotion/styled';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';

const MuiContentEditable = styled(ContentEditable)({
  minHeight: '150px',
  resize: 'none',
  fontSize: '15px',
  caretColor: 'rgb(5, 5, 5)',
  position: 'relative',
  tabSize: 1,
  outline: 0,
  padding: '15px 10px',
});

export { MuiContentEditable };