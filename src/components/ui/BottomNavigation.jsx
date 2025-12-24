import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Home, ShoppingBag, Plus, Clock, User } from 'lucide-react';

const BottomNavWrapper = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e0e0e0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 70px;
  z-index: 100;

  @media (max-width: 768px) {
    height: 65px;
  }
`;

const NavItem = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  text-decoration: none;
  color: ${props => props.active ? '#667eea' : '#999'};
  transition: all 0.3s ease;
  gap: 4px;

  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.05);
  }

  svg {
    width: 24px;
    height: 24px;
  }

  span {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    @media (max-width: 600px) {
      font-size: 0.7rem;
    }
  }
`;

const AddItemButton = styled(NavItem)`
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white !important;
  margin-bottom: 10px;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  min-width: 60px;
  box-shadow: 0 3px 15px rgba(102, 126, 234, 0.3);

  &:hover {
    background: linear-gradient(135deg, #5568d3 0%, #6a3b91 100%);
    color: white;
  }

  svg {
    width: 28px;
    height: 28px;
  }

  span {
    font-size: 0.65rem;
  }
`;

const BottomNavigation = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <BottomNavWrapper>
      <NavItem to="/home" active={isActive('/home')}>
        <Home size={24} />
        <span>Home</span>
      </NavItem>
      <NavItem to="/marketplace" active={isActive('/marketplace')}>
        <ShoppingBag size={24} />
        <span>Market</span>
      </NavItem>
      <AddItemButton as={Link} to="/add-item">
        <Plus size={28} />
        <span>Add</span>
      </AddItemButton>
      <NavItem to="/history" active={isActive('/history')}>
        <Clock size={24} />
        <span>History</span>
      </NavItem>
      <NavItem to="/profile" active={isActive('/profile')}>
        <User size={24} />
        <span>Profile</span>
      </NavItem>
    </BottomNavWrapper>
  );
};

export default BottomNavigation;
