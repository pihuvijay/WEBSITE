export default function About({ headingRef, revealRef }){

  return (
    <div className="simple-page section" id="about">
      <div className="simple-page-inner reveal" ref={revealRef}>

        <div className="eyebrow" ref={headingRef}>About</div>

        <h1>Software, and the room to explain it.</h1>

        <p>
          I&apos;m <strong>Pihu Vijaywargiya</strong>, a Computer Science student at the
          University of Bath, currently on industrial placement as a Software
          Engineer &amp; Technical Consultant at <strong>GE Vernova</strong>,
          building customer-side software for real-time national grid systems,
          infrastructure with zero margin for failure.
        </p>

        <p>
          What I enjoy most is sitting at the intersection of customer-facing
          and product engineering: listening for the pain point behind what a
          customer is actually asking for, thinking through the technical
          features that could solve it, then using that technical grounding
          to build the thing. At GE Vernova that loop shows up as national
          grid infrastructure; at Noumena it was security risk assessments
          for business stakeholders; at WakeWatch it was an actuarial model
          pitched to an investor panel. I also have a genuine interest in
          energy, power and electricity as commodities, and I like the work
          best when it produces something with real commercial value.
        </p>

        <p>
          Outside of client-facing work, I&apos;ve led a team of four engineers at
          Studio1 and built ML pipelines for drowsiness detection and
          financial document intelligence. I was also featured in a Women in
          Tech list, and I care about making tech and engineering careers
          feel reachable for other women coming up behind me.
        </p>

        <div className="about-directory" aria-hidden="true">
          <div className="dir-line"><span className="dir-name">pihu/</span></div>
          <div className="dir-line">├── ge-vernova.py       <span className="dir-comment">{"// current software engineer"}</span></div>
          <div className="dir-line">├── wakewatch/          <span className="dir-comment">{"// founder, computer vision/ML"}</span></div>
          <div className="dir-line">├── studio1.ts          <span className="dir-comment">{"// full-stack"}</span></div>
          <div className="dir-line">├── fulcrum-digital.py  <span className="dir-comment">{"// RAG, AI agents"}</span></div>
          <div className="dir-line">├── noumena.md          <span className="dir-comment">{"// cybersecurity"}</span></div>
          <div className="dir-line">└── contact.txt</div>
        </div>

      </div>
    </div>
  );

}
