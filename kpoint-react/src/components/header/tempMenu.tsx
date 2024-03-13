import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { StorageKey } from 'common/enums/app/storage-key.enum';
import { UserType } from 'common/types/user/user';
import * as React from 'react';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { storage } from 'services/services';

interface MenuProps {
  onClick: (param: boolean) => void;
}

const AccountMenu: FC<MenuProps> = ({ onClick }) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const user: UserType = JSON.parse(storage.getItem(StorageKey.USER) || '{}') ;

  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleClickProfile = (): void => {
    onClick(true);
    navigate(`${user.username}`);
  };

  const handleClickSettings = (): void => {
    navigate('/settings/profile');
  };

  const handleCreateProjectClick = (): void => {
    navigate('/projects/new');
  };

  const handleLogout = (): void => {
    storage.removeItem(StorageKey.TOKEN);
    storage.removeItem(StorageKey.USER);
    onClick(false);
    window.location.href = '/';
  };

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title={t('menu.account_settings')}>
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }} src={user.avatarImgUrl}>
            </Avatar>
          </IconButton>
        </Tooltip>
        <Typography sx={{ minWidth: 100 }} color={'black'}>
          {Object.keys(user).length > 0 && user.username}
        </Typography>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            bgcolor: '#DCDEEE',
            padding: '8px',
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: '#DCDEEE',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem sx={{
          marginBottom: '5px',
        }} onClick={handleClickProfile}>
          <Avatar src={user.avatarImgUrl} /> {t('menu.my_profile')}
        </MenuItem>
        <MenuItem sx={{
          marginBottom: '5px',
          display: { xs: 'block', lg: 'none' },
        }}
        onClick={handleCreateProjectClick}
        >{t('buttons.create_project')}</MenuItem>
        <MenuItem 
          sx={{
            marginBottom: '5px',
          }}
          onClick={handleClickSettings}>
          {t('menu.settings')}
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          {t('menu.logout')}
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export { AccountMenu };
