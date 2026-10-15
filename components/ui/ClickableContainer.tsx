"use client";

import type {
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

type ClickableContainerProps = HTMLAttributes<HTMLElement> & {
  as?: "article" | "div";
  children: ReactNode;
  href: string;
};

const interactiveSelector =
  "a, button, input, select, textarea, summary, [role='button'], [role='link']";

function isNestedInteractiveElement(
  target: EventTarget | null,
  container: HTMLElement,
) {
  if (!(target instanceof Element)) return false;

  const interactiveElement = target.closest(interactiveSelector);
  return Boolean(interactiveElement && interactiveElement !== container);
}

export function ClickableContainer({
  as: Component = "div",
  children,
  href,
  onClick,
  onKeyDown,
  ...props
}: ClickableContainerProps) {
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      isNestedInteractiveElement(event.target, event.currentTarget)
    ) {
      return;
    }

    router.push(href);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event);

    if (
      event.defaultPrevented ||
      event.target !== event.currentTarget ||
      (event.key !== "Enter" && event.key !== " ")
    ) {
      return;
    }

    event.preventDefault();
    router.push(href);
  };

  return (
    <Component
      {...props}
      role="link"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {children}
    </Component>
  );
}
