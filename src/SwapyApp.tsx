import { useEffect, useRef, useState } from "react";

import { createSwapy, SlotItemMapObject, Swapy } from "swapy";

type Rotation = 0 | 90 | 180 | 270;

const rotate = (r: Rotation): Rotation => {
  return ((r + 90) % 360) as Rotation;
};

const initialSquares: SlotItemMapObject = {
  0: "A",
  1: "B",
  2: "C",
  3: "D",
  4: "E",
  5: "F",
  6: "G",
  7: "H",
  8: "I",
};

const initialRotations: Record<string, Rotation> = {
  A: 0,
  B: 90,
  C: 180,
  D: 270,
  E: 0,
  F: 90,
  G: 180,
  H: 270,
  I: 0,
};

export const SwapyApp = () => {
  const [squares, setSquares] = useState<SlotItemMapObject>(initialSquares);

  // Add a remount key to force complete component remounting
  const [remountKey, setRemountKey] = useState(0);

  const [debug, setDebug] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center size-full">
      <SwapyContainer key={remountKey} setSquares={setSquares} debug={debug} />
      {/* dev tools */}
      <div className="absolute top-10 right-10 flex flex-col gap-2 items-start text-xs">
        <button
          onClick={() => setDebug(!debug)}
          className="text-white underline"
        >
          {debug ? "Hide debug" : "Show debug"}
        </button>
        {debug && (
          <>
            <button
              onClick={() => {
                setSquares(initialSquares);
                setRemountKey((prev) => prev + 1);
              }}
              className="text-white underline"
            >
              Reset
            </button>
            <div className="flex gap-2">
              <pre>{JSON.stringify(squares, null, 2)}</pre>
              {/* <pre>{JSON.stringify(rotations, null, 2)}</pre> */}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Separate component for the swapy container to allow complete remounting
const SwapyContainer = ({
  setSquares,
  debug,
}: {
  setSquares: (squares: SlotItemMapObject) => void;
  debug?: boolean;
}) => {
  const swapy = useRef<Swapy | null>(null);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("SwapyContainer mounted with a fresh DOM");

    if (container.current) {
      console.log("Initializing new swapy instance");
      swapy.current = createSwapy(container.current);
      swapy.current.onSwap((event) => {
        console.log("swap", event);
        setSquares(event.newSlotItemMap.asObject);
      });
    }

    return () => {
      console.log("SwapyContainer unmounting, destroying swapy");
      if (swapy.current) {
        swapy.current.destroy();
        swapy.current = null;
      }
    };
  }, [setSquares]);

  const [rotations, setRotations] =
    useState<Record<string, Rotation>>(initialRotations);
  const onClick = (id: string) => {
    console.log("clicked", id);
    setRotations((prev) => ({
      ...prev,
      [id]: rotate(prev[id]),
    }));
  };

  return (
    <div ref={container} className="grid grid-cols-3 grid-rows-3 gap-2 w-fit">
      {Object.entries(initialSquares).map(([slot, item]) => (
        <Slot id={slot} key={slot}>
          <Tile
            id={item}
            rotation={rotations[item]}
            onClick={onClick}
            debug={debug}
          />
        </Slot>
      ))}
    </div>
  );
};

const Slot = ({ id, children }: { id: string; children: React.ReactNode }) => {
  return <div data-swapy-slot={id}>{children}</div>;
};

const Tile = ({
  id,
  rotation,
  onClick,
  debug,
}: {
  id: string;
  rotation: Rotation;
  onClick?: (id: string) => void;
  debug?: boolean;
}) => {
  // Calculate positions based on rotation
  const getPositions = () => {
    switch (rotation) {
      case 0: // default
        return {
          green: "top-1 mx-auto right-0 left-0", // top
          red: "top-0 bottom-0 my-auto right-1", // right
          blue: "top-0 bottom-0 my-auto left-1", // left
          black: "bottom-1 mx-auto left-0 right-0", // bottom
        };
      case 90: // 90 degrees clockwise
        return {
          green: "right-1 my-auto top-0 bottom-0", // right
          red: "bottom-1 mx-auto left-0 right-0", // bottom
          blue: "top-1 mx-auto left-0 right-0", // top
          black: "left-1 my-auto top-0 bottom-0", // left
        };
      case 180: // 180 degrees
        return {
          green: "bottom-1 mx-auto left-0 right-0", // bottom
          red: "top-0 bottom-0 my-auto left-1", // left
          blue: "top-0 bottom-0 my-auto right-1", // right
          black: "top-1 mx-auto left-0 right-0", // top
        };
      case 270: // 270 degrees clockwise
        return {
          green: "left-1 my-auto top-0 bottom-0", // left
          red: "top-1 mx-auto left-0 right-0", // top
          blue: "bottom-1 mx-auto left-0 right-0", // bottom
          black: "right-1 my-auto top-0 bottom-0", // right
        };
    }
  };

  const positions = getPositions();

  return (
    <div data-swapy-item={id} className="size-20">
      <div
        className="size-full relative bg-shell rounded-sm"
        onClick={() => onClick?.(id)}
      >
        {debug && (
          <div className="absolute inset-0 flex items-center justify-center">
            {id}
          </div>
        )}
        <div
          className={`size-2 rounded-full bg-green-400 absolute ${positions.green}`}
        />
        <div
          className={`size-2 rounded-full bg-red-400 absolute ${positions.red}`}
        />
        <div
          className={`size-2 rounded-full bg-blue-400 absolute ${positions.blue}`}
        />
        <div
          className={`size-2 rounded-full bg-black absolute ${positions.black}`}
        />
      </div>
    </div>
  );
};
