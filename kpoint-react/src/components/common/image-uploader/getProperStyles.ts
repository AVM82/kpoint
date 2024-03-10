import { FormLabel, FormLabelTypeMap, Grid, GridTypeMap, styled } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

function getProperStyles({
  component,
}: {
  component: string;
}): { CustomGrid: OverridableComponent<GridTypeMap<object, 'div'>>
,  CustomBox: React.CSSProperties, CustomFormLabel:  OverridableComponent<FormLabelTypeMap<object, 'label'>> } {
  let CustomGrid = styled(Grid)({}) as typeof Grid;
  let CustomBox: React.CSSProperties = {};
  let CustomFormLabel = styled(FormLabel)({}) as typeof FormLabel;

  switch (component) {
  case 'project-page':
    CustomGrid = styled(Grid)(
      () => `
      justify-content: start;
      align-items: center;
      position: relative;
          `,
    ) as typeof Grid;
    CustomFormLabel = styled(FormLabel)(
      () => `position: absolute;
      cursor: pointer;
      right: 0;
      left: 19%;
      display: flex;
      width: 75px;
      height: 75px;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transition: opacity 0.3s linear;
      border-radius: 6px;
      `,
    ) as typeof FormLabel;
    CustomBox = {
      borderRadius: '6px',
      maxWidth: '150px',
      overflow: 'hidden',
      maxHeight: '150px',
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
      width: 100%;
      `,
    ) as typeof Grid;
    CustomFormLabel = styled(FormLabel)(
      () => `position: absolute;
      cursor: pointer;
      right: 0;
      left: 0;
      display: flex;
      width: 75px;
      height: 75px;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transition: opacity 0.3s linear;
      border-radius: 50%;
      justify-self: center;
      `,
    ) as typeof FormLabel;
    CustomBox = {
      borderRadius: '50%',
      overflow: 'hidden',
      width: '100%',
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
    CustomFormLabel = styled(FormLabel)(
      () => `position: absolute;
      cursor: pointer;
      right: 0;
      left: 0;
      display: flex;
      width: 90%;
      height: 90%;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transition: opacity 0.3s linear;
      border-radius: 6px;
      justify-self: center;
      `,
    ) as typeof FormLabel;
    CustomBox = {
      border: '2px dotted #757575',
      borderRadius: '4px',
      width: '100%',
      overflow: 'hidden',
      height: '100%',
      flexGrow: 1,
      flexShrink: 0,
    };
    break;
  }

  return { CustomGrid, CustomBox, CustomFormLabel };
}

export { getProperStyles };
