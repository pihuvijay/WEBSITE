import { useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { GitHubIcon } from "./icons.jsx";
import { useSpill } from "../context/SpillContext.jsx";

/*
  A small GitHub mark drifting slowly across the viewport on a
  gentle wave, the way the Docker whale drifts along a wavy
  baseline on dylantombs.com. Kept slow, small and low-opacity
  so it reads as ambient texture, not a competing animation.
  It only appears once the home page's spill has settled.
*/

export default function DriftingIcon(){

  const { spillDone } = useSpill();

  const [viewportWidth, setViewportWidth] = useState(
    typeof window === "undefined" ? 1440 : window.innerWidth
  );

  useEffect(() => {

    const onResize = () => setViewportWidth(window.innerWidth);

    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);

  }, []);

  const shouldShow = spillDone;

  const drift = useSpring({
    from:{ x: -40 },
    to: async (next) => {
      while(true){
        await next({ x: viewportWidth + 40 });
        await next({ x: -40, immediate:true });
      }
    },
    config:{ duration: 42000 },
    pause: !shouldShow
  });

  return (
    <div
      className="drifting-icon"
      style={{ opacity: shouldShow ? 1 : 0 }}
      aria-hidden="true"
    >
      <animated.div
        style={{ transform: drift.x.to(x => `translateX(${x}px)`) }}
      >
        <GitHubIcon />
      </animated.div>
    </div>
  );

}
