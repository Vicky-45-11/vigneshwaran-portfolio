import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useMousePosition } from '../../hooks/useMousePosition';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export const CustomCursor: React.FC = () => {
  const { x, y, isPointerDevice } = useMousePosition();
  const prefersReducedMotion = useReducedMotion();
  const [cursorState, setCursorState] = useState<{
    text: string;
    variant: 'default' | 'hover' | 'project';
  }>({
    text: '',
    variant: 'default',
  });

  useEffect(() => {
    if (!isPointerDevice || prefersReducedMotion) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('[data-cursor]');
      if (interactive) {
        const cursorType = interactive.getAttribute('data-cursor') || 'hover';
        const cursorLabel = interactive.getAttribute('data-cursor-text') || '';
        setCursorState({
          text: cursorLabel,
          variant: cursorType as any,
        });
        return;
      }

      const isClickable = target.closest('a, button, [role="button"]');
      if (isClickable) {
        setCursorState({
          text: '',
          variant: 'hover',
        });
        return;
      }

      setCursorState({ text: '', variant: 'default' });
    };

    window.addEventListener('mouseover', handleMouseOver);
    return () => window.removeEventListener('mouseover', handleMouseOver);
  }, [isPointerDevice, prefersReducedMotion]);

  if (!isPointerDevice || prefersReducedMotion) return null;
  if (x < 0 || y < 0) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center rounded-full"
      style={{
        transform: 'translate(-50%, -50%)',
      }}
      animate={{
        x,
        y,
        width: cursorState.variant === 'project' ? 68 : cursorState.variant === 'hover' ? 36 : 10,
        height: cursorState.variant === 'project' ? 68 : cursorState.variant === 'hover' ? 36 : 10,
        backgroundColor:
          cursorState.variant === 'project'
            ? 'rgba(59, 130, 246, 0.9)'
            : cursorState.variant === 'hover'
            ? 'rgba(59, 130, 246, 0.15)'
            : 'rgba(96, 165, 250, 0.9)',
        border:
          cursorState.variant === 'hover'
            ? '1px solid rgba(96, 165, 250, 0.6)'
            : cursorState.variant === 'project'
            ? '1px solid rgba(255, 255, 255, 0.4)'
            : 'none',
        backdropFilter: cursorState.variant === 'project' ? 'blur(4px)' : 'none',
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 28,
        mass: 0.5,
      }}
    >
      {cursorState.text && (
        <span className="text-[10px] font-bold text-white font-mono tracking-wider select-none uppercase">
          {cursorState.text}
        </span>
      )}
    </motion.div>
  );
};
