import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { FC, useState } from 'react';

interface FilterOptionProps {
  label: string;
  placeholder: string;
}

const FilterOption: FC<FilterOptionProps> = ({ label, placeholder }) => {
  const [age, setAge] = useState('');

  const handleChange = (event: SelectChangeEvent): void => {
    setAge(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
      <InputLabel id="demo-select-small-label">{label}</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={age}
        label="Age"
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>{placeholder}</em>
        </MenuItem>
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </FormControl>
  );
};

export { FilterOption };
