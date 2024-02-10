import { FC } from 'react';

import { Navbar } from './navbar';
import { Sidebar } from './sidebar';

const ProfilePage: FC = () => {

  return (
    <div>
      <Sidebar />
      <Navbar />
    </div>
  );
};

export { ProfilePage };
