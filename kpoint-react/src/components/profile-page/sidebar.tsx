import { List, ListItemButton, ListItemText } from '@mui/material';
import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { StorageKey } from '../../common/enums/app/storage-key.enum';
import { storage } from '../../services/services';

interface SidebarItemProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

function handleLogout(): void {
  storage.removeItem(StorageKey.TOKEN);
  storage.removeItem(StorageKey.USER);
  window.location.href = '/';
}

const SidebarItem: FC<SidebarItemProps> = ({ label, selected, onClick }) => {

  return (
    <ListItemButton selected={selected} onClick={onClick}>
      <ListItemText primary={label}/>
    </ListItemButton>
  );
};

const Sidebar: FC = () => {
  const [selectedItem, setSelectedItem] = useState(0);
  const navigate = useNavigate();

  const handleItemClick = (index: number): void => {
    setSelectedItem(index);
  };

  const handleNewProjectClick = (): void => {
    navigate('/projects/new');
  };

  const handleSettingsPage = (): void => {
    navigate('/settings/profile');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <div style={{ width: '200px', backgroundColor: '#f5f5f5', overflow: 'auto' }}>
        <List>
          <SidebarItem
            label="Мої проєкти"
            selected={selectedItem === 0}
            onClick={(): void => handleItemClick(0)}
          />
          <SidebarItem
            label="Розпочати новий проєкт"
            selected={selectedItem === 1}
            onClick={(): void => handleNewProjectClick()}
          />
          <SidebarItem
            label="Налаштувати профіль"
            selected={selectedItem === 2}
            onClick={(): void => handleSettingsPage()}
          />
          <SidebarItem
            label="Вийти"
            selected={selectedItem === 3}
            onClick={handleLogout}
          />
        </List>
      </div>
    </div>
  )
  ;
};

export { Sidebar };
