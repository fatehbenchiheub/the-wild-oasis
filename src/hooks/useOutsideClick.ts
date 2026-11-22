import { useEffect, useRef } from 'react';

function useOutsideClick<T extends HTMLElement = HTMLDivElement>(
  closeHandler: () => void
) {
  const ref = useRef<T>(null);

  useEffect(
    function () {
      function handleClick(e: MouseEvent) {
        if (ref.current && !ref.current.contains(e.target as Node))
          closeHandler();
      }

      document.addEventListener('click', handleClick, false);

      return () => document.removeEventListener('click', handleClick, true);
    },
    [closeHandler]
  );
  return ref;
}

export default useOutsideClick;
