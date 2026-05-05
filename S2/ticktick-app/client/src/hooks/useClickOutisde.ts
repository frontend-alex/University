import { RefObject, useEffect } from "react";

const useOnClickOutside = <T extends HTMLElement>(
  ref: RefObject<T> | any,
  handler: () => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      if (!ref.current || ref.current.contains(target)) return;

      if (
        target instanceof HTMLElement &&
        target.closest(".dropdown-ignore-click")
      ) {
        return;
      }

      handler();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

export default useOnClickOutside;
