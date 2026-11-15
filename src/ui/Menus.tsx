// import { Type } from 'lucide-react';
import {
  createContext,
  useContext,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { HiEllipsisVertical } from 'react-icons/hi2';
import styled from 'styled-components';
import useOutsideClick from '../hooks/useOutsideClick';

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

type PositionPropType = {
  x: number;
  y: number;
};

const StyledList = styled.ul<{ position: PositionPropType }>`
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
  const open = (name: string) => setIsOpenId(name);

  return (
    <MenusContext.Provider value={{ openId, open, close }}>
      {children}
    </MenusContext.Provider>
  );
}

type ToggleProp = {
  //children: ReactElement<{ onClick?: (e: React.MouseEvent) => void }>;
  //children: ReactElement;
  id: number;
};

function Toggle({ id }: ToggleProp) {
  const context = useContext(MenusContext);
  if (!context) throw new Error('Toggle must be used within a Modal');
  const { openId, open, close } = context;

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (openId === '' || Number(openId) !== id) {
      // children.props.onClick?.(e);
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

type ListProp = {
  children: ReactNode;
  id: number;
};
function List({ id, children }: ListProp) {
  const context = useContext(MenusContext);
  if (!context) throw new Error('List must be used within a Modal');
  const { openId, close } = context;

  // 1. Hook up useOutsideClick, passing close function
  const ref = useOutsideClick<HTMLUListElement>(close);
  if (Number(openId) !== id) return null;

  return createPortal(
    // 2. Attach the ref to the StyledList container
    <StyledList position={{ x: 20, y: 20 }} ref={ref}>
      {children}
    </StyledList>,
    document.body
  );
}

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
Menus.List = List;
Menus.Button = Button;

export default Menus;
