import { GitHubIcon, LinkedInIcon, EmailIcon } from "./icons.jsx";

const GITHUB_URL = "https://github.com/pihuvijay";
const LINKEDIN_URL = "https://linkedin.com/in/pihuvijay-71524a252";
const EMAIL = "pihuvijay06@gmail.com";

function scrollToId(id){
  return e => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
}

export default function Sidebar(){

  return (
    <nav className="sidebar" aria-label="Site">

      <span className="sidebar-mark">PV</span>

      <div className="sidebar-nav">
        <a href="#track" onClick={scrollToId("track")}>Work</a>
        <a href="#about" onClick={scrollToId("about")}>About</a>
        <a href="#contact" onClick={scrollToId("contact")}>Contact</a>
      </div>

      <div className="sidebar-socials">
        <a href={GITHUB_URL} target="_blank" rel="noreferrer noopener" aria-label="GitHub">
          <GitHubIcon />
        </a>
        <a href={LINKEDIN_URL} target="_blank" rel="noreferrer noopener" aria-label="LinkedIn">
          <LinkedInIcon />
        </a>
        <a href={`mailto:${EMAIL}`} aria-label="Email">
          <EmailIcon />
        </a>
      </div>

    </nav>
  );

}
