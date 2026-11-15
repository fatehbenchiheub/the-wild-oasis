import {
  createContext,
  useContext,
  useState,
  type ReactElement,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
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
  position: PositionPropType;
  setPosition: Dispatch<SetStateAction<PositionPropType>>;
}

const MenusContext = createContext<MenusContextType | undefined>(undefined);

type ChildrenMenuProp = {
  children: ReactElement | ReactElement[];
};

function Menus({ children }: ChildrenMenuProp) {
  const [openId, setIsOpenId] = useState<string>('');
  const [position, setPosition] = useState<PositionPropType>({ x: 0, y: 0 });

  const close = () => setIsOpenId('');
  const open = (name: string) => setIsOpenId(name);

  return (
    <MenusContext.Provider
      value={{ openId, open, close, position, setPosition }}
    >
      {children}
    </MenusContext.Provider>
  );
}

type ToggleProp = {
  id: number;
};

function Toggle({ id }: ToggleProp) {
  const context = useContext(MenusContext);
  if (!context) throw new Error('Toggle must be used within a Menus component');
  const { openId, open, close, setPosition } = context;

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();

    if (e.target instanceof Element) {
      const button = e.target.closest('button');

      if (button) {
        const rect = button.getBoundingClientRect();
        // Calculate position based on the button's location on the screen
        setPosition({
          x: window.innerWidth - rect.width - rect.left,
          y: rect.y + rect.height + 8,
        });
      }
    }

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

type ListProp = {
  children: ReactNode;
  id: number;
};

function List({ id, children }: ListProp) {
  const context = useContext(MenusContext);
  if (!context) throw new Error('List must be used within a Menus component');
  const { openId, close, position } = context;

  const ref = useOutsideClick<HTMLUListElement>(close);

  if (Number(openId) !== id) return null;

  return createPortal(
    <StyledList position={position} ref={ref}>
      {children}
    </StyledList>,
    document.body
  );
}

type ButtonProp = {
  children: string;
  onClick?: () => void;
  icon: ReactElement;
};

function Button({ children, onClick, icon }: ButtonProp) {
  const context = useContext(MenusContext);
  if (!context) throw new Error('Button must be used within a Menus component');
  const { close } = context;

  function handleClick() {
    onClick?.();
    close();
  }

  return (
    <li>
      <StyledButton onClick={handleClick}>
        {icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
