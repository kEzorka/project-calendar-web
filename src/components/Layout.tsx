import React from 'react';
import { Header } from './Header';
import './Layout.scss';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <main className="layout__main">{children}</main>
      <footer className="layout__footer">
        <p>&copy; 2025 Project Calendar. Все права защищены.</p>
      </footer>
    </div>
  );
};

export default Layout;
