import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import GridLayout, { Layout, WidthProvider } from "react-grid-layout";
import React, { useState } from "react";
import { cn } from "./lib/utils";
import "./custom.css";

// 🧠 can i read the width of the container to set the row height such that they will be sq
// Rather, the row height drives the width, we calculate the width from a set rowheight for the grid

const GridLayoutWithWidth = WidthProvider(GridLayout);

const updateElementInLayout = (
  layout: Layout[],
  elementId: string,
  newLayout: Partial<Layout>
) => {
  return layout.map((item) => {
    if (item.i === elementId) {
      return { ...item, ...newLayout };
    }
    return item;
  });
};

const initialLayout = [
  { i: "a", x: 0, y: 0, w: 1, h: 1 },
  { i: "b", x: 1, y: 0, w: 1, h: 1 },
  { i: "c", x: 2, y: 0, w: 1, h: 1 },
  { i: "d", x: 3, y: 0, w: 1, h: 1 },

  { i: "e", x: 0, y: 1, w: 2, h: 1 },
  { i: "f", x: 2, y: 1, w: 2, h: 1 },

  { i: "g", x: 0, y: 2, w: 2, h: 2 },
  { i: "h", x: 2, y: 2, w: 2, h: 2 },
];

export const RGLApp = () => {
  const [layout, setLayout] = useState(initialLayout);

  const handleClick = (item: Layout) => {
    // Set of sizes to cycles thru
    const sizes = [
      { w: 1, h: 1 },
      { w: 2, h: 1 },
      { w: 2, h: 2 },
      { w: 1, h: 2 },
    ];

    // Cycles through the sizes
    const currentIndex = sizes.findIndex(
      (size) => size.w === item.w && size.h === item.h
    );
    const nextIndex = (currentIndex + 1) % sizes.length;
    const nextSize = sizes[nextIndex];

    setLayout(
      updateElementInLayout(layout, item.i, {
        w: nextSize.w,
        h: nextSize.h,
      })
    );
  };

  const addWidget = () => {
    setLayout([
      ...layout,
      { i: String.fromCharCode(65 + layout.length), x: 0, y: 0, w: 1, h: 1 },
    ]);
  };

  const rh = 175;
  const m = 40;
  const cols = 4;
  const w = rh * cols + m * (cols + 1);
  // For some reason, changing the values from the above causing a strange layout
  console.log(w);

  return (
    // Page container
    <div className="h-full w-full flex">
      {/* Sidebar */}
      <div className="w-1/5 h-full border-r border-white flex flex-col p-4">
        <button
          className="bg-pink-500 p-3 rounded-lg text-2xl font-medium hover:bg-pink-400"
          onClick={addWidget}
        >
          Add Widget
        </button>
      </div>
      {/* Grid container (rest of the page) */}
      <div className="flex-1 overflow-y-auto">
        {/* Grid layout (less than the rest of the page) */}
        <GridLayoutWithWidth
          className={cn(`max-w-[${w}px] mx-auto`)}
          compactType="horizontal"
          layout={layout}
          cols={cols}
          rowHeight={rh}
          margin={[m, m]}
          width={w}
          isResizable={false}
          // 👇  Not important
          // autoSize={false} // if you use autoSize={false}, you can use tailwind h-full
          onDragStart={(_, __, ___, ____, e) => e.stopPropagation()} // this is just a little hack to make double click more reliable
        >
          {layout.map((item) => (
            <Widget key={item.i} onDoubleClick={() => handleClick(item)} />
          ))}
        </GridLayoutWithWidth>
      </div>
    </div>
  );
};

interface WidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const Widget = React.forwardRef<HTMLDivElement, WidgetProps>(
  (
    {
      style,
      className,
      onMouseDown,
      onMouseUp,
      onTouchEnd,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        style={style}
        className={cn("bg-pink-500 rounded-2xl", className)}
        ref={ref}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Widget.displayName = "Widget";
