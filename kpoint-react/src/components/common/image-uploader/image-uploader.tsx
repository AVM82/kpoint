import AddIcon from '@mui/icons-material/Add';
import { Box } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { getProperStyles } from './getProperStyles';

interface ImageUploaderProps {
  handleChange: (field: string, value: string | File) => void;
  component: string;
  xs: number;
  imageUrl: string;
}

export const ImageUploader: FC<ImageUploaderProps> = ({
  handleChange,
  component,
  xs,
  imageUrl,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleLogoPreview = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.currentTarget.files?.[0]) {
      const projectLogo = e.currentTarget.files?.[0];

      if (projectLogo.size > 3000000) {
        toast.warn('File is to big');

        return;
      }
      const previewUrl = URL.createObjectURL(projectLogo);
      setPreviewUrl(previewUrl);
      handleChange('logo', projectLogo);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setPreviewUrl(imageUrl);
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [imageUrl]);

  const { CustomGrid, CustomBox, CustomFormLabel }= getProperStyles({ component: component });

  return (
    <CustomGrid item container xs={xs} >
      <div style={CustomBox} >
        <Box display={'flex'} justifyContent="center" >
          <Box
            component={'img'}
            src={previewUrl.length > 0 ? previewUrl : imageUrl}
            sx={{ objectFit: 'cover', maxWidth: '100%', maxHeight: '100%', borderRadius: '6px' }}
          ></Box>
        </Box>
      </div>
      <input
        type="file"
        id="project-logo"
        accept=".jpg, .jpeg, .png"
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
          handleLogoPreview(e)
        }
        style={{ display: 'none' }}
      />
      <CustomFormLabel
        htmlFor="project-logo"
        sx={{
          '&:hover': {
            opacity: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          },
        }}
      >
        <AddIcon fontSize="large" color="primary"/>
      </CustomFormLabel>
    </CustomGrid>
  );
};
