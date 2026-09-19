import { createContext, useContext, useState } from "react";

/*
  Tracks whether the home page's spill animation has let go of
  frame 240. Quiet, post-spill UI (skills panel, drifting icon)
  reads this so nothing competes with the bag while it's still
  the thing on screen.
*/

const SpillContext = createContext({
  spillDone: true,
  setSpillDone: () => {}
});

export function SpillProvider({ children }){

  const [spillDone, setSpillDone] = useState(true);

  return (
    <SpillContext.Provider value={{ spillDone, setSpillDone }}>
      {children}
    </SpillContext.Provider>
  );

}

export function useSpill(){
  return useContext(SpillContext);
}
