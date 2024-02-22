import { Box } from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface IInputField {
    id?: number;
    placeholder: string;
    onChange: (params: string) => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>, actionType: string) => void;
    actionType: string;
    itemName: string;
  }

export const InputField: FC<IInputField> = ({ id,
  placeholder,
  onChange,
  onSubmit,
  actionType,
  itemName }) => {
  const { t } = useTranslation();

  return (
    <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
      <form id={id ? `${id}` : ''} name="editField" className="input__form" onSubmit={(e): void => onSubmit(e, actionType)}>
        {itemName === 'description' ? (<textarea
          className="form__input"
          placeholder={placeholder}
          name="editField"
          required
          onChange={(event): void => onChange(event?.target.value)}
          rows={30}
          cols={60}></textarea>) : (
          <input
            className="form__input"
            type="text"
            placeholder={placeholder}
            name="editField"
            maxLength={16}
            minLength={1}
            required
            onChange={(event): void => onChange(event?.target.value)}
          />
        )}
        <button className="add" type="submit">
          {t('buttons.edit')}
        </button>
      </form>
    </Box>
  );
};