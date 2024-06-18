import React, { useEffect, useState, useCallback } from "react";
import { motion, useAnimationControls, AnimationControls } from "framer-motion";
import { cn } from "@/lib/utils";

interface DotPatternProps {
  width?: number;
  height?: number;
  cols?: number;
  className?: string;
  [key: string]: any;
}

interface Dot {
  color: string;
  key: number;
}

const grayShades = [
  "#FFFFFF",
  "#F8F8F8",
  "#F0F0F0",
  "#E8E8E8",
  "#E0E0E0",
  "#D8D8D8",
  "#D0D0D0",
  "#C8C8C8",
  "#C0C0C0",
  "#B8B8B8",
  "#A9A9A9",
];

const rows = 3;
const rectSize = 3;
const gap = 2;

const useDotControls = (rows: number, cols: number): AnimationControls[][] => {
  const controls = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, useAnimationControls)
  );
  return controls;
};

export function DotPattern({
  width,
  height,
  cols = 10,
  className,
  ...props
}: DotPatternProps) {
  const [dots, setDots] = useState<Dot[][]>([]);
  const controls = useDotControls(rows, cols);

  const totalWidth = cols * (rectSize + gap) - gap;
  const totalHeight = rows * (rectSize + gap) - gap;

  const svgWidth = width || totalWidth;
  const svgHeight = height || totalHeight;

  const generateDots = useCallback(() => {
    const newDots: Dot[][] = [];
    for (let row = 0; row < rows; row++) {
      const rowDots: Dot[] = [];
      for (let col = 0; col < cols; col++) {
        rowDots.push({
          color: grayShades[Math.floor(Math.random() * grayShades.length)],
          key: Math.random(),
        });
      }
      newDots.push(rowDots);
    }
    setDots(newDots);
  }, [cols]);

  useEffect(() => {
    generateDots();
  }, [generateDots]);

  useEffect(() => {
    const animateDots = () => {
      dots.forEach((row, rowIndex) => {
        row.forEach((dot, colIndex) => {
          const newColor =
            grayShades[Math.floor(Math.random() * grayShades.length)];
          controls[rowIndex][colIndex].start({
            fill: newColor,
            transition: { duration: 0.2, ease: "easeInOut" },
          });
        });
      });
    };

    const interval = setInterval(animateDots, 500);
    return () => clearInterval(interval);
  }, [dots, controls]);

  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none", className)}
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      preserveAspectRatio="xMidYMid meet"
      {...props}
    >
      {dots.map((row, rowIndex) =>
        row.map((dot, colIndex) => (
          <motion.rect
            key={`${rowIndex}-${colIndex}-${dot.key}`}
            x={colIndex * (rectSize + gap)}
            y={rowIndex * (rectSize + gap)}
            width={rectSize}
            height={rectSize}
            initial={{ fill: dot.color, opacity: 0 }}
            animate={controls[rowIndex][colIndex]}
            transition={{
              duration: 1,
              delay: rowIndex * 0.1 + colIndex * 0.05,
              ease: "easeInOut",
            }}
            style={{ opacity: 1 }}
          />
        ))
      )}
    </svg>
  );
}

export default DotPattern;
