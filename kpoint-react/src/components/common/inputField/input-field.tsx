import { Box } from '@mui/material';
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
    >
      <form
        id={id ? `${id}` : ''}
        name={itemName}
        className="input__form"
        onSubmit={(e): void => onSubmit(e, itemName)}
      >
        {itemName === 'description' ? (
          <textarea
            className="form__input"
            placeholder={placeholder}
            name={itemName}
            required
            onChange={(
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            ): void => onChange(e)}
            rows={30}
            cols={60}
          ></textarea>
        ) : (
          <input
            className="form__input"
            type="text"
            placeholder={placeholder}
            name={itemName}
            maxLength={16}
            minLength={1}
            required
            onChange={(
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            ): void => onChange(e)}
          />
        )}
        <button className="add" type="submit">
          {t('buttons.edit')}
        </button>
      </form>
    </Box>
  );
};
