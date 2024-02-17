import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, FormControl, FormLabel, IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import { FC, useState } from 'react';

import { ProfileLayout } from '../profile-layout/ProfileLayout';

export const ProfilePassword: FC = () => {

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = (): void => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
  };

  return(
    <ProfileLayout>
      <Box>
        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
          <FormLabel>Email</FormLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
      </Box>
    </ProfileLayout>
  );
};