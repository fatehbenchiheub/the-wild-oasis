import { useEffect, useRef } from 'react';

function useOutsideClick(closeHandler: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(
    function () {
      function handleClick(e: MouseEvent) {
        if (ref.current && !ref.current.contains(e.target as Node))
          closeHandler();
      }

      document.addEventListener('click', handleClick);

      return () => document.removeEventListener('click', handleClick);
    },
    [closeHandler]
  );
  return ref;
}

export default useOutsideClick;
