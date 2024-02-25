import { Visibility, VisibilityOff } from '@mui/icons-material';
import { FormControl, FormLabel, IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import { FC, useState } from 'react';

type Props =  {
    label: string;
    id: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>,id:string) => void;
    handleFocus: (e: React.FocusEvent<HTMLInputElement>,id:string) => void;
    error: boolean;
};

export const PasswordField: FC<Props> = ({ label, id, handleChange, handleFocus, error }) => {

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = (): void => {
    setShowPassword((show)=> !show);
  };
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
  };

  return(
    <FormControl fullWidth sx={{ m: 1 }} variant="outlined">
      <FormLabel>{label}</FormLabel>
      <OutlinedInput
        id="new-password"
        type={showPassword ? 'text' : 'password'}
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => handleChange(e,id)}
        onFocus={(e: React.FocusEvent<HTMLInputElement>): void => handleFocus(e,id)}
        error={error}
        required={true}
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
      />
    </FormControl>
  );
};
