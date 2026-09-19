import { useEffect, useRef, useState } from "react";
import { useSpring, animated, to } from "@react-spring/web";
import { GitHubIcon, LinkedInIcon, EmailIcon, PenIcon } from "../components/icons.jsx";

const GITHUB_URL = "https://github.com/pihuvijay";
const LINKEDIN_URL = "https://linkedin.com/in/pihuvijay-71524a252";
const EMAIL = "pihuvijay06@gmail.com";

export default function Contact({ headingRef, revealRef }){

  const [dropped, setDropped] = useState(false);
  const [landed, setLanded] = useState(false);

  const sectionRef = useRef(null);

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {

    if(reduceMotion){
      setDropped(true);
      setLanded(true);
      return;
    }

    const el = sectionRef.current;

    if(!el){
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if(entry.isIntersecting){
            setDropped(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
    );

    observer.observe(el);

    return () => observer.disconnect();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const penSpring = useSpring({
    y: dropped ? 0 : -220,
    rotate: dropped ? -16 : -50,
    opacity: dropped ? 1 : 0,
    config: dropped
      ? { mass: 1, tension: 210, friction: 13 }
      : { duration: 0 },
    immediate: reduceMotion,
    onRest: () => {
      if(dropped){
        setLanded(true);
      }
    }
  });

  return (
    <div className="simple-page section" id="contact" ref={sectionRef}>
      <div className="simple-page-inner reveal" ref={revealRef}>

        <animated.div
          className="pen-drop"
          aria-hidden="true"
          style={{
            opacity: penSpring.opacity,
            transform: to(
              [penSpring.y, penSpring.rotate],
              (y, r) => `translateY(${y}px) rotate(${r}deg)`
            )
          }}
        >
          <PenIcon />
        </animated.div>

        <div className={`pen-shadow${landed ? " is-visible" : ""}`} aria-hidden="true" />

        <div className="eyebrow" ref={headingRef}>Contact</div>

        <h1>Get in touch.</h1>

        <p>
          Open to conversations about software engineering, solutions roles,
          or anything at the intersection of the two. The fastest way to
          reach me is email. I read everything that comes in.
        </p>

        <div className="contact-links">

          <a href={`mailto:${EMAIL}`}>
            <EmailIcon />
            {EMAIL}
          </a>

          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer noopener">
            <LinkedInIcon />
            linkedin.com/in/pihuvijay
          </a>

          <a href={GITHUB_URL} target="_blank" rel="noreferrer noopener">
            <GitHubIcon />
            github.com/pihuvijay
          </a>

        </div>

      </div>
    </div>
  );

}
