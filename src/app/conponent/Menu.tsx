"use client"
import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { useControlStore } from '../store/useStore';
import { useAuthStore } from '../store/useUserStore';
import { useRouter } from "next/navigation";
interface MenuItem {
  name: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { name: 'Sản phẩm', path: '/products' },
];

// Styled Components
const Nav = styled.nav`
 
  padding: 16px 12px;
  display:flex;
  justify-content:center;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 15px;
  align-items: center;
  width:100%;
`;

const MenuItem = styled.li`
  display: inline;
`;

const MenuLink = styled(Link)`
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
  transition: color 0.3s;

  &:hover {
    color: #0056b3;
  }
`;
const LogoutButton = styled.button`
  background-color: transparent;
  border: none;
  color: #007bff;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #0056b3;
  }
`;
const UserSection = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto; /* Đẩy phần tử sang bên phải */
  gap: 1rem; /* Khoảng cách giữa các phần tử */
`;
const UserName = styled.span`
  font-weight: bold;
  font-size:12px;
  color: #333;
`;
const NavContainer = styled.div`
display:flex;
width:800px;
justify-content:space-between;
`
const Header:React.FC = () => {
  const isLoading = useControlStore(state=>state.isLoading)
  const user = useAuthStore((state) => state.user); // Lấy thông tin người dùng từ store
  const logout = useAuthStore((state) => state.logout); // Hàm logout từ store
  const router = useRouter();
  const handleLogout = () =>{
    logout()
    router.push('/login')
  }
  return (
    <Nav>
      <NavContainer>
      <MenuList>
        {menuItems.map((item) => (
          <MenuItem key={item.path}>
            <MenuLink href={item.path}>{item.name}</MenuLink>
          </MenuItem>
        ))}
        {user && (
            <UserSection>
              <UserName>{user.name}</UserName>
              <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
            </UserSection>
          )}
      </MenuList>
      </NavContainer>
      
    </Nav>
  )
};

export default Header;