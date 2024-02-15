import { Grid, GridTypeMap, styled } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

function getProperStyles({
  component,
}: {
  component: string;
}): { CustomGrid: OverridableComponent<GridTypeMap<object, 'div'>>
,  CustomBox: React.CSSProperties } {
  let CustomGrid = styled(Grid)({}) as typeof Grid;
  let CustomBox: React.CSSProperties = {};

  switch (component) {
  case 'project-page':
    CustomGrid = styled(Grid)(
      () => `
      justify-content: center;
      align-items: center;
      position: relative;
          `,
    ) as typeof Grid;
    CustomBox = {
      border: '2px dotted #757575',
      borderRadius: '4px',
      padding: '8px',
      width: '100%',
      overflow: 'hidden',
      height: '100%',
      flexGrow: 1,
      flexShrink: 0,
    };
    break;

  case 'profile-page':
    CustomGrid = styled(Grid)(
      () => `
      justify-content: center;
      align-items: center;
      position: relative;
      height: 100%;
      `,
    ) as typeof Grid;
    CustomBox = {
      border: '2px dotted #757575',
      borderRadius: '50%',
      overflow: 'hidden',
      height: '100%',
      flexGrow: 1,
    };
    break;
    
  default:
    CustomGrid = styled(Grid)(
      () => `
      justify-content: center;
      align-items: center;
      position: relative;
          `,
    ) as typeof Grid;
    CustomBox = {
      border: '2px dotted #757575',
      borderRadius: '4px',
      padding: '8px',
      width: '100%',
      overflow: 'hidden',
      height: '100%',
      flexGrow: 1,
      flexShrink: 0,
    };
    break;
  }

  return { CustomGrid, CustomBox };
}

export { getProperStyles };
