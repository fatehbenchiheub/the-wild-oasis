// import { Type } from 'lucide-react';
import {
  createContext,
  useContext,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { HiEllipsisHorizontal, HiEllipsisVertical } from 'react-icons/hi2';
import styled from 'styled-components';

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

const StyledList = styled.ul`
  position: fixed;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  right: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

interface MenusContextType {
  openId: string;
  open: (name: string) => void;
  close: () => void;
}

const MenusContext = createContext<MenusContextType | undefined>(undefined);

type ChildrenMenuProp = {
  children: ReactElement;
};

function Menus({ children }: ChildrenMenuProp) {
  const [openId, setIsOpenId] = useState<string>('');

  const close = () => setIsOpenId('');
  const open = () => (name: string) => setIsOpenId(name);

  return (
    <MenusContext.Provider value={{ openId, open, close }}>
      {children}
    </MenusContext.Provider>
  );
}

type ToggleProp = {
  id: number;
};

function Toggle({ id }: ToggleProp) {
  const context = useContext(MenusContext);
  if (!context) throw new Error('Open must be used within a Modal');
  const { openId, open, close } = context;

  function handleClick() {
    if (openId === '' || Number(openId) !== id) {
      open(String(id));
    } else {
      close();
    }
  }
  return (
    <StyledToggle onClick={handleClick}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}
function List({ id }: number) {}

type ButtonProp = {
  children: string;
};
function Button({ children }: ButtonProp) {
  return (
    <li>
      <StyledButton>{children}</StyledButton>
    </li>
  );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menu.List = List;
Menu.Button = Button;

export default Menus;
