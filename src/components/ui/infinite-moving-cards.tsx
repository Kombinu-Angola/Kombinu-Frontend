"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { School01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

interface InfiniteMovingCardsProps {
  items: string[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: InfiniteMovingCardsProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  const [start, setStart] = useState(false);
  const initialized = React.useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    initialized.current = true;
    addAnimation();
  }, []);

  function addAnimation() {
    if (!containerRef.current || !scrollerRef.current) {
      return;
    }

    const scrollerContent = Array.from(
      scrollerRef.current.children
    );

    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);

      if (scrollerRef.current) {
        scrollerRef.current.appendChild(duplicatedItem);
      }
    });

    setDirection();
    setSpeed();

    setStart(true);
  }

  function setDirection() {
    if (!containerRef.current) {
      return;
    }

    containerRef.current.style.setProperty(
      "--animation-direction",
      direction === "left" ? "forwards" : "reverse"
    );
  }

  function setSpeed() {
    if (!containerRef.current) {
      return;
    }

    const duration =
      speed === "fast"
        ? "20s"
        : speed === "normal"
          ? "40s"
          : "80s";

    containerRef.current.style.setProperty(
      "--animation-duration",
      duration
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 w-full overflow-hidden",



      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll",
          pauseOnHover && "pause-on-hover"
        )}

      >
        {items.map((university) => (
          <li
            key={university}
            className={cn(
              "flex shrink-0 items-center gap-2.5",
              "rounded-xl border border-border",
              "bg-card px-4 py-2.5",
              "shadow-xs",
              "transition-all duration-200",
              "hover:border-primary/60",
              "hover:bg-muted/40 "
            )}
          >
            <HugeiconsIcon
              icon={School01Icon}
              size={18}
              className="text-primary"
            />

            <span
              className={cn(
                "font-heading text-sm font-bold",
                "text-white sm:text-base"
              )}
            >
              {university}
            </span>
          </li>
        ))}
      </ul>
    </div >
  );
};