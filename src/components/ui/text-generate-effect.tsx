"use client";

import {
    Children,
    isValidElement,
    type ReactNode,
} from "react";
import { useEffect, useMemo } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { cn } from "@/lib/utils";

interface TextGenerateEffectProps {
    children: ReactNode;
    className?: string;
    filter?: boolean;
    duration?: number;
}

interface Word {
    text: string;
    className?: string;
}

function extractWords(
    children: ReactNode,
    parentClassName?: string
): Word[] {
    const words: Word[] = [];

    Children.forEach(children, (child) => {
        if (typeof child === "string") {
            child
                .trim()
                .split(/\s+/)
                .forEach((word) => {
                    words.push({
                        text: word,
                        className: parentClassName,
                    });
                });

            return;
        }

        if (isValidElement(child)) {
            const childClassName =
                typeof child.props.className === "string"
                    ? cn(parentClassName, child.props.className)
                    : parentClassName;

            words.push(
                ...extractWords(
                    child.props.children,
                    childClassName
                )
            );
        }
    });

    return words;
}

export const TextGenerateEffect = ({
    children,
    className,
    filter = true,
    duration = 0.5,
}: TextGenerateEffectProps) => {
    const [scope, animate] = useAnimate();

    const words = useMemo(
        () => extractWords(children),
        [children]
    );

    useEffect(() => {
        animate(
            "span",
            {
                opacity: 1,
                filter: filter ? "blur(0px)" : "none",
            },
            {
                duration,
                delay: stagger(0.08),
            }
        );
    }, [animate, filter, duration, words]);

    return (
        <div
            ref={scope}
            className={cn("font-bold", className)}
        >
            <div className="leading-snug tracking-wide">
                {words.map((word, index) => (
                    <motion.span
                        key={`${word.text}-${index}`}
                        className={cn(
                            "inline-block opacity-0",
                            word.className
                        )}
                        style={{
                            filter: filter
                                ? "blur(10px)"
                                : "none",
                        }}
                    >
                        {word.text}&nbsp;
                    </motion.span>
                ))}
            </div>
        </div>
    );
};