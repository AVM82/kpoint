import { Box, Button, Input } from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface IInputField {
  id?: number;
  placeholder: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>, itemName: string) => void;
  itemName: string;
}

export const InputField: FC<IInputField> = ({
  id,
  placeholder,
  onChange,
  onSubmit,
  itemName,
}) => {
  const { t } = useTranslation();

  return (
    <Box
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      flexDirection={'column'}
      position={`${itemName === 'title' ? 'absolute' : 'static'}`}
      top={`${itemName === 'title' ? '-15px' : '0'}`}
    >
      <form
        id={id ? `${id}` : ''}
        name={itemName}
        onSubmit={(e): void => onSubmit(e, itemName)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Input
          type="text"
          defaultValue={placeholder}
          name={itemName}
          inputProps={{
            maxLength: `${itemName === 'tags' ? 10 : 30}`,
          }}
          required
          onChange={(
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
          ): void => onChange(e)}
        />
        <Button type="submit"
          variant="contained"
          sx={{
            margin: 1,
            backgroundColor: '#535365',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'rgb(84, 84, 160)',
            },
          }}>
          {t('buttons.edit')}
        </Button>
      </form>
    </Box>
  );
};
