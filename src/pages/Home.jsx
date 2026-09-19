import { useEffect, useRef } from "react";
import { useSpill } from "../context/SpillContext.jsx";
import { LinkedInIcon } from "../components/icons.jsx";
import About from "./About.jsx";
import Contact from "./Contact.jsx";

const FRAMES = {
  path: "/frames/",
  prefix: "ezgif-frame-",
  ext: "png",
  start: 1,
  end: 240,
  pad: 3
};

const EASE = 0.25;
const FRAME_END_PROGRESS = 0.50;

const SKILLS_BY_SECTION = {
  "ge-vernova": ["Python", "Linux / CLI", "C++", "Kubernetes", "Docker", "GitHub Actions", "CI/CD", "Jira", "Slack", "AWS"],
  "wakewatch": ["Python", "OpenCV", "AWS (S3, DynamoDB, Lambda)", "Redis", "Predictive Analytics"],
  "studio1": ["React", "Node.js", "TypeScript", "SQL", "WebSocket", "Jest", "Jira", "Slack"],
  "fulcrum": ["Python", "LangChain", "RAG Multi-Agent Pipelines", "MCP", "ISO 27001"],
  "ma-ai": ["Python", "LangChain", "RAG Pipelines", "Transformers", "GitHub Actions"],
  "noumena": ["Cloudflare", "Datadog", "SIEM", "CIA Triad"],
  "dotlines": ["Requirements Gathering", "Client Communication", "Web Reporting", "Technical Strategy"],
  "feature": []
};

/*
  Two coordinate sets per object: `dot` sits directly on the
  physical object in the photo, `label` sits in open step
  space nearby. A dashed line (rendered in the SVG overlay
  below) draws the connection, so the circle can mark the
  object precisely while the text stays fully legible.
*/
const HOTSPOTS = [
  { id: "hs-ge", target: "ge-vernova", label: "Software / Product Engineer", dot: [77.7, 88.0], labelPos: [74, 75] },
  { id: "hs-wake", target: "wakewatch", label: "Hackathon + Incubator Win", dot: [40.9, 74.7], labelPos: [47, 55] },
  { id: "hs-studio", target: "fulcrum", label: "AI Engineer", dot: [31.6, 27.9], labelPos: [30, 6] },
  { id: "hs-ma", target: "ma-ai", label: "M&A Project", dot: [87.6, 56.1], labelPos: [91, 75] },
  { id: "hs-noumena", target: "noumena", label: "Cybersecurity Engineer/Analyst", dot: [74.6, 57.0], labelPos: [71, 66] },
  { id: "hs-feature", target: "feature", label: "Magazine Feature", dot: [61.8, 53.5], labelPos: [57, 65] },
  { id: "hs-mirror", target: "studio1", label: "Full Stack Developer", dot: [55, 71], labelPos: [58, 25] }
];

function frameURL(number){
  return (
    FRAMES.path +
    FRAMES.prefix +
    String(number).padStart(FRAMES.pad, "0") +
    "." +
    FRAMES.ext
  );
}

export default function Home(){

  const { setSpillDone } = useSpill();

  const canvasRef = useRef(null);
  const trackRef = useRef(null);
  const afterBackgroundRef = useRef(null);
  const skillsPanelRef = useRef(null);
  const skillsListRef = useRef(null);
  const scrollHintRef = useRef(null);
  const hotspotRefs = useRef({});
  const sectionHeadingRefs = useRef({});
  const revealRefs = useRef([]);

  useEffect(() => {

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const track = trackRef.current;
    const afterBackground = afterBackgroundRef.current;
    const skillsPanel = skillsPanelRef.current;
    const skillsList = skillsListRef.current;
    const scrollHint = scrollHintRef.current;
    const hotspots = HOTSPOTS
      .map(h => ({ target: h.target, ...hotspotRefs.current[h.id] }))
      .filter(h => h.dot && h.label && h.line);

    let images = [];
    let currentFrame = 0;
    let targetFrame = 0;
    let lastDrawnFrame = -1;
    let rafId = null;
    let activeSkillsSection = null;
    let frameAnimationDone = false;
    let skillsSwapTimeout = null;

    function refreshSkillsVisibility(){

      const skills = SKILLS_BY_SECTION[activeSkillsSection] || [];

      if(frameAnimationDone && skills.length > 0){
        skillsPanel.classList.add("visible");
      }else{
        skillsPanel.classList.remove("visible");
      }

    }

    function setActiveSkills(id){

      if(id === activeSkillsSection){
        return;
      }

      activeSkillsSection = id;

      const skills = SKILLS_BY_SECTION[id] || [];

      if(skills.length === 0){
        refreshSkillsVisibility();
        return;
      }

      skillsList.classList.add("is-swapping");

      skillsSwapTimeout = setTimeout(() => {

        skillsList.replaceChildren(
          ...skills.map(s => {
            const div = document.createElement("div");
            div.textContent = s;
            return div;
          })
        );

        skillsList.classList.remove("is-swapping");

        refreshSkillsVisibility();

      }, 300);

    }

    const sectionHeadings = Object.values(sectionHeadingRefs.current);

    const sectionObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if(entry.isIntersecting){
            setActiveSkills(entry.target.closest(".section").id);
          }
        });
      },
      { rootMargin: "0px 0px 0px 0px", threshold: 0 }
    );

    sectionHeadings.forEach(heading => sectionObserver.observe(heading));

    const revealTargets = revealRefs.current.filter(Boolean);

    const revealObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if(entry.isIntersecting){
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
    );

    revealTargets.forEach(el => revealObserver.observe(el));

    function preloadFrames(){

      images = [];

      for(let i = FRAMES.start; i <= FRAMES.end; i++){

        const img = new Image();
        img.src = frameURL(i);

        img.onload = () => {
          if(i === FRAMES.start){
            resizeCanvas();
            drawFrame(0);
          }
        };

        img.onerror = () => {
          console.error("Could not load:", frameURL(i));
        };

        images.push(img);

      }

    }

    function resizeCanvas(){

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if(images[Math.round(currentFrame)]?.complete){
        lastDrawnFrame = -1;
        drawFrame(currentFrame);
      }

    }

    function drawFrame(index){

      index = Math.max(0, Math.min(images.length - 1, Math.round(index)));

      const img = images[index];

      if(!img || !img.complete || !img.naturalWidth){
        return;
      }

      if(lastDrawnFrame === index){
        return;
      }

      lastDrawnFrame = index;

      const cw = window.innerWidth;
      const ch = window.innerHeight;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      const scale = Math.max(cw / iw, ch / ih);
      const width = iw * scale;
      const height = ih * scale;
      const x = (cw - width) / 2;
      const y = (ch - height) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, x, y, width, height);

    }

    function updateFrameFromScroll(){

      const rect = track.getBoundingClientRect();
      const total = track.offsetHeight - window.innerHeight;

      let p = -rect.top / total;
      p = Math.max(0, Math.min(1, p));

      if(scrollHint){
        scrollHint.classList.toggle("is-hidden", p > 0.015);
      }

      const maxFrame = FRAMES.end - FRAMES.start;

      let frameProgress;

      if(p < FRAME_END_PROGRESS){
        frameProgress = p / FRAME_END_PROGRESS;
      }else{
        frameProgress = 1;
      }

      targetFrame = frameProgress * maxFrame;

      currentFrame += (targetFrame - currentFrame) * EASE;
      currentFrame = Math.min(currentFrame, maxFrame);

      drawFrame(Math.floor(currentFrame));

      if(p >= 0.995){

        afterBackground.classList.add("visible");

        if(!frameAnimationDone){
          frameAnimationDone = true;
          refreshSkillsVisibility();
          setSpillDone(true);
        }

      }else{

        afterBackground.classList.remove("visible");

        if(frameAnimationDone){
          frameAnimationDone = false;
          refreshSkillsVisibility();
          setSpillDone(false);
        }

      }

      const hotspotsShouldShow = p >= FRAME_END_PROGRESS && p < 0.995;

      hotspots.forEach(({ dot, label, line }) => {
        [dot, label, line].forEach(el => {
          el.classList.toggle("active", hotspotsShouldShow);
        });
      });

    }

    function animate(){
      updateFrameFromScroll();
      rafId = requestAnimationFrame(animate);
    }

    function onHotspotClick(target){
      const el = document.getElementById(target);
      if(el){
        el.scrollIntoView({ behavior: "smooth" });
      }
    }

    const hotspotCleanups = [];

    hotspots.forEach(({ dot, label, line, target }) => {

      const onEnter = () => [dot, label, line].forEach(el => el.classList.add("is-hover"));
      const onLeave = () => [dot, label, line].forEach(el => el.classList.remove("is-hover"));
      const onClick = () => onHotspotClick(target);

      [dot, label].forEach(el => {
        el.addEventListener("click", onClick);
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });

      hotspotCleanups.push(() => {
        [dot, label].forEach(el => {
          el.removeEventListener("click", onClick);
          el.removeEventListener("mouseenter", onEnter);
          el.removeEventListener("mouseleave", onLeave);
        });
      });

    });

    function onResize(){
      resizeCanvas();
    }

    window.addEventListener("resize", onResize);

    preloadFrames();
    resizeCanvas();
    animate();

    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){
      afterBackground.classList.add("visible");
      setSpillDone(true);
    }else{
      setSpillDone(false);
    }

    return () => {

      cancelAnimationFrame(rafId);
      clearTimeout(skillsSwapTimeout);
      sectionObserver.disconnect();
      revealObserver.disconnect();
      window.removeEventListener("resize", onResize);
      hotspotCleanups.forEach(fn => fn());

      images.forEach(img => {
        img.onload = null;
        img.onerror = null;
      });

      setSpillDone(true);

    };

  }, [setSpillDone]);

  return (
    <>

      <div id="track" ref={trackRef}>

        <div id="stage">

          <canvas id="frame" ref={canvasRef} />

          <div id="after-background" ref={afterBackgroundRef} />

          <div id="scrim" />

          <div className="hero">
            <h1>Pihu<br />Vijaywargiya</h1>
            <p>Selected Work</p>
          </div>

          <div className="scroll-hint" ref={scrollHintRef} aria-hidden="true">
            <span className="scroll-hint-mouse">
              <span className="scroll-hint-dot" />
            </span>
            <span className="scroll-hint-text">Scroll</span>
          </div>

          <svg className="hotspot-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {HOTSPOTS.map(h => (
              <line
                key={h.id}
                x1={h.dot[0]} y1={h.dot[1]}
                x2={h.labelPos[0]} y2={h.labelPos[1]}
                className="hotspot-line"
                ref={el => {
                  hotspotRefs.current[h.id] = { ...(hotspotRefs.current[h.id] || {}), line: el };
                }}
              />
            ))}
          </svg>

          {HOTSPOTS.map(h => (
            <div
              key={h.id}
              className="hotspot-dot"
              id={h.id}
              data-target={h.target}
              aria-label={h.label}
              style={{ left: `${h.dot[0]}%`, top: `${h.dot[1]}%` }}
              ref={el => {
                hotspotRefs.current[h.id] = { ...(hotspotRefs.current[h.id] || {}), dot: el };
              }}
            />
          ))}

          {HOTSPOTS.map(h => (
            <span
              key={h.id}
              className="hotspot-label"
              style={{ left: `${h.labelPos[0]}%`, top: `${h.labelPos[1]}%` }}
              ref={el => {
                hotspotRefs.current[h.id] = { ...(hotspotRefs.current[h.id] || {}), label: el };
              }}
            >
              {h.label}
            </span>
          ))}

        </div>

      </div>

      <div className="sections-wrapper">

        <div id="skills-panel" ref={skillsPanelRef}>
          <div className="skills-title">SKILLS</div>
          <div className="skills-list" ref={skillsListRef} />
        </div>

        <section className="section" id="ge-vernova">
          <div
            className="section-inner reveal"
            ref={el => { if(el && !revealRefs.current.includes(el)) revealRefs.current.push(el); }}
          >

            <div
              className="company-tag"
              ref={el => { sectionHeadingRefs.current["ge-vernova"] = el; }}
            >
              01 · GE Vernova
            </div>

            <h2 className="role-title">Software / Product Engineer</h2>

            <div className="role-meta">
              <span>Industrial Placement, 2026–2027</span>
            </div>

            <ul className="tech-bullets">
              <li>
                Engineered customer-facing Python and C++ systems for
                real-time national energy grid infrastructure, deploying and
                orchestrating containerised services with Kubernetes across
                cloud infrastructure.
              </li>
              <li>
                Resolved production incidents via Oracle SQL and Linux log
                analysis, tracing root causes of software defects across
                utility-scale grid deployments.
              </li>
              <li>
                Analysed operational intelligence from performance dashboards
                tracking system health, incident trends and availability
                across international energy deployments.
              </li>
              <li>
                Translated technical analysis into strategic recommendations
                for cross-functional teams spanning engineering, operations
                and customer-facing stakeholders.
              </li>
              <li>
                Innovating an end-to-end multi-agent dashboard for root-cause
                analysis, delivering actionable insights for critical
                national infrastructure.
              </li>
            </ul>

            <div className="metrics">
              <div>
                <div className="metric-value">National</div>
                <div className="metric-label">Grid Scale</div>
              </div>
              <div>
                <div className="metric-value">Real-Time</div>
                <div className="metric-label">Safety-Critical Systems</div>
              </div>
              <div>
                <div className="metric-value">24/7</div>
                <div className="metric-label">Production Monitoring</div>
              </div>
            </div>

            <div className="tags">
              <div className="tag">Python</div>
              <div className="tag">C++</div>
              <div className="tag">Kubernetes</div>
              <div className="tag">Linux / CLI</div>
              <div className="tag">Oracle SQL</div>
              <div className="tag">Jira</div>
              <div className="tag">Slack</div>
              <div className="tag">AWS</div>
            </div>

          </div>
        </section>

        <section className="section" id="wakewatch">
          <div
            className="section-inner reveal"
            ref={el => { if(el && !revealRefs.current.includes(el)) revealRefs.current.push(el); }}
          >

            <div
              className="company-tag"
              ref={el => { sectionHeadingRefs.current["wakewatch"] = el; }}
            >
              02 · WakeWatch
            </div>

            <h2 className="role-title">Hackathon + Incubator Win</h2>

            <div className="section-role">
              Founder &amp; CTO, <span>WakeWatch</span>, 2024–2025
            </div>

            <ul className="tech-bullets">
              <li>
                Won Bath Hackathon 2025 for Best Software &amp; UX Design,
                engineering a real-time driver-drowsiness app in Kotlin and
                Python with OpenCV facial-landmark analysis in 24 hours.
              </li>
              <li>
                Architected ML drowsiness-detection models (85%+ accuracy) and
                an AWS pipeline (S3, DynamoDB, Lambda, Redis) transforming raw
                sensor data into insurance-grade risk datasets.
              </li>
              <li>
                Designed insurance-ready dashboards translating underwriting
                criteria into data specifications for actuarial stakeholders,
                cutting dashboard load times by 70%.
              </li>
              <li className="bullet-divider">Continued into incubator</li>
              <li>
                Delivered a commercial pitch to an investor panel after an
                8-week university incubator, winning Most Innovative Startup.
              </li>
            </ul>

            <div className="metrics">
              <div>
                <div className="metric-value">85%+</div>
                <div className="metric-label">Detection Accuracy</div>
              </div>
              <div>
                <div className="metric-value">70%</div>
                <div className="metric-label">Faster Dashboards</div>
              </div>
              <div>
                <div className="metric-value">Sub-Second</div>
                <div className="metric-label">Query Performance</div>
              </div>
            </div>

            <div className="tags">
              <div className="tag">Python</div>
              <div className="tag">OpenCV</div>
              <div className="tag">AWS</div>
              <div className="tag">DynamoDB</div>
              <div className="tag">Redis</div>
            </div>

          </div>
        </section>

        <section className="section" id="studio1">
          <div
            className="section-inner reveal"
            ref={el => { if(el && !revealRefs.current.includes(el)) revealRefs.current.push(el); }}
          >

            <div
              className="company-tag"
              ref={el => { sectionHeadingRefs.current["studio1"] = el; }}
            >
              03 · Studio1
            </div>

            <h2 className="role-title">Full Stack Developer &amp; DevOps Engineer</h2>

            <div className="section-role">
              <span>Studio1 AI Startup</span>, 2025–2026
            </div>

            <ul className="tech-bullets">
              <li>
                Delivered a production React, Node.js and TypeScript app with
                real-time WebSocket features serving 500+ active users, later
                adopted by Amazon Prime to produce content for The Boys
                franchise.
              </li>
              <li>
                Promoted to lead a team of 4 engineers across sprint planning,
                code review and solution architecture, lifting delivery speed
                by 50%.
              </li>
              <li>
                Integrated the OpenAI API for AI-powered features with secure
                key management and rate limiting, serving 10,000+ requests
                daily in production.
              </li>
              <li>
                Architected CI/CD pipelines with GitHub Actions and automated
                Jest testing (85% coverage), cutting deployment time by 60%,
                and authored the team&apos;s API Route Rulebook for endpoint
                design and authentication standards.
              </li>
              <li>
                Translated business requirements into technical user stories
                and acceptance criteria, aligning stakeholders on feature
                feasibility and roadmap.
              </li>
            </ul>

            <div className="metrics">
              <div>
                <div className="metric-value">500+</div>
                <div className="metric-label">Active Users</div>
              </div>
              <div>
                <div className="metric-value">10,000+</div>
                <div className="metric-label">Daily Requests</div>
              </div>
              <div>
                <div className="metric-value">85%</div>
                <div className="metric-label">Test Coverage</div>
              </div>
              <div>
                <div className="metric-value">60%</div>
                <div className="metric-label">Faster Deploys</div>
              </div>
            </div>

            <div className="tags">
              <div className="tag">React</div>
              <div className="tag">Node.js</div>
              <div className="tag">TypeScript</div>
              <div className="tag">SQL</div>
              <div className="tag">WebSocket</div>
              <div className="tag">GitHub Actions</div>
              <div className="tag">Jira</div>
              <div className="tag">Slack</div>
            </div>

          </div>
        </section>

        <section className="section" id="fulcrum">
          <div
            className="section-inner reveal"
            ref={el => { if(el && !revealRefs.current.includes(el)) revealRefs.current.push(el); }}
          >

            <div
              className="company-tag"
              ref={el => { sectionHeadingRefs.current["fulcrum"] = el; }}
            >
              04 · Fulcrum Digital
            </div>

            <h2 className="role-title">AI Engineer</h2>

            <div className="role-meta">
              <span>Jun–Jul 2025</span>
              <a
                href="https://www.fulcrumdigital.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Fulcrum Digital"
              >
                <LinkedInIcon />
              </a>
            </div>

            <ul className="tech-bullets">
              <li>
                Engineered enterprise AI systems using Python and LangChain
                with custom RAG multi-agent pipelines for real-time financial
                data processing, achieving 80% efficiency improvement in
                document processing.
              </li>
              <li>
                Implemented ISO 27001-compliant security standards for
                sensitive financial data; collaborated with senior engineers
                to establish scalable technical architecture.
              </li>
              <li>
                Built enterprise web applications in Python focused on
                secure, usable interfaces, documenting technical processes
                for cross-functional teams.
              </li>
              <li>
                Orchestrated specialised agent skills over MCP (Model Context
                Protocol) servers, giving each agent scoped tool access to
                live financial data sources rather than one monolithic
                prompt.
              </li>
            </ul>

            <div className="metrics">
              <div>
                <div className="metric-value">80%</div>
                <div className="metric-label">Faster Document Processing</div>
              </div>
              <div>
                <div className="metric-value">ISO 27001</div>
                <div className="metric-label">Compliant Security Standard</div>
              </div>
            </div>

            <div className="tags">
              <div className="tag">Python</div>
              <div className="tag">LangChain</div>
              <div className="tag">RAG</div>
              <div className="tag">MCP</div>
              <div className="tag">Agent Skills</div>
              <div className="tag">ISO 27001</div>
            </div>

          </div>
        </section>

        <section className="section" id="ma-ai">
          <div
            className="section-inner reveal"
            ref={el => { if(el && !revealRefs.current.includes(el)) revealRefs.current.push(el); }}
          >

            <div
              className="company-tag"
              ref={el => { sectionHeadingRefs.current["ma-ai"] = el; }}
            >
              05 · Independent Project
            </div>

            <h2 className="role-title">M&amp;A Project</h2>

            <div className="section-role">
              <span>M&amp;A AI Report Automation</span>, Jul–Aug 2025
            </div>

            <ul className="tech-bullets">
              <li>
                Built an ML-powered financial analysis system in Python using
                transformer models and LangChain RAG pipelines over SEC
                filings.
              </li>
              <li>
                Created an analyst AI agent driving automated n8n
                data-reconciliation workflows, generating industry-standard
                CSV reports across 20+ financial metrics: revenue, valuation
                ratios and market indicators.
              </li>
              <li>
                Set up GitHub Actions to test and deploy the pipeline
                continuously.
              </li>
            </ul>

            <div className="metrics">
              <div>
                <div className="metric-value">80–85%</div>
                <div className="metric-label">Prediction Accuracy</div>
              </div>
              <div>
                <div className="metric-value">80%</div>
                <div className="metric-label">Less Manual Analysis</div>
              </div>
            </div>

            <div className="tags">
              <div className="tag">Python</div>
              <div className="tag">LangChain</div>
              <div className="tag">RAG</div>
              <div className="tag">Transformers</div>
              <div className="tag">n8n</div>
            </div>

          </div>
        </section>

        <section className="section" id="noumena">
          <div
            className="section-inner reveal"
            ref={el => { if(el && !revealRefs.current.includes(el)) revealRefs.current.push(el); }}
          >

            <div
              className="company-tag"
              ref={el => { sectionHeadingRefs.current["noumena"] = el; }}
            >
              06 · Noumena
            </div>

            <h2 className="role-title">Cybersecurity Engineer/Analyst</h2>

            <div className="role-meta">
              <span>2023–2024</span>
            </div>

            <ul className="tech-bullets">
              <li>
                Monitored and blocked 100+ malicious network accesses/minute
                using Cloudflare, Datadog and SIEM tools, a 50% security
                improvement.
              </li>
              <li>
                Conducted enterprise security risk assessments, delivered
                technical presentations to business stakeholders, and
                resolved live security incidents under high-pressure
                conditions.
              </li>
            </ul>

            <div className="metrics">
              <div>
                <div className="metric-value">100+/min</div>
                <div className="metric-label">Malicious Accesses Blocked</div>
              </div>
              <div>
                <div className="metric-value">50%</div>
                <div className="metric-label">Security Improvement</div>
              </div>
            </div>

            <div className="tags">
              <div className="tag">Cloudflare</div>
              <div className="tag">Datadog</div>
              <div className="tag">SIEM</div>
              <div className="tag">CIA Triad</div>
            </div>

          </div>
        </section>

        <section className="section" id="dotlines">
          <div
            className="section-inner reveal"
            ref={el => { if(el && !revealRefs.current.includes(el)) revealRefs.current.push(el); }}
          >

            <div
              className="company-tag"
              ref={el => { sectionHeadingRefs.current["dotlines"] = el; }}
            >
              07 · Dotlines UK
            </div>

            <h2 className="role-title">Technical Strategy Intern</h2>

            <div className="section-role">
              <span>Dotlines UK</span>, Jun–Sep 2024
            </div>

            <ul className="tech-bullets">
              <li>
                Gathered requirements directly from enterprise clients and
                delivered web-based reporting solutions, translating
                stakeholder needs into shipped technical work.
              </li>
              <li>
                Translated complex technical capabilities into clear
                solutions for diverse stakeholders across multiple client
                organisations.
              </li>
            </ul>

            <div className="metrics">
              <div>
                <div className="metric-value">30%</div>
                <div className="metric-label">Higher Client Satisfaction &amp; Retention</div>
              </div>
            </div>

          </div>
        </section>

        <section className="section" id="feature">
          <div
            className="section-inner reveal"
            ref={el => { if(el && !revealRefs.current.includes(el)) revealRefs.current.push(el); }}
          >

            <div
              className="company-tag"
              ref={el => { sectionHeadingRefs.current["feature"] = el; }}
            >
              08 · Recognition
            </div>

            <h2 className="role-title">Women in Tech Feature</h2>

            <div className="section-role">
              <span>Top 90 Women to Watch</span>, 2025
            </div>

            <ul className="tech-bullets">
              <li>
                Featured as one of the Top 90 Women to Watch, interviewed
                on-stage by a leading tech figure.
              </li>
              <li>
                Discussed the current wave of AI, data-centre growth, and the
                importance of cybersecurity amid the rise of vibecoding.
              </li>
              <li>
                Recognised for building real-world engineering experience
                years ahead of most peers, from cybersecurity to AI systems
                to production software.
              </li>
            </ul>

          </div>
        </section>

        <About
          headingRef={el => { sectionHeadingRefs.current["about"] = el; }}
          revealRef={el => { if(el && !revealRefs.current.includes(el)) revealRefs.current.push(el); }}
        />

        <Contact
          headingRef={el => { sectionHeadingRefs.current["contact"] = el; }}
          revealRef={el => { if(el && !revealRefs.current.includes(el)) revealRefs.current.push(el); }}
        />

      </div>

    </>
  );

}
