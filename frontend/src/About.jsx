import "./About.css";

const About = () => {
  return (
    <div className="about-container">
      <h1 className="about-title">About PromptixGPT</h1>

      <p className="about-subtitle">
        PromptixGPT is an AI-powered workspace that helps users generate ideas,
        write code, and collaborate with a community.
      </p>

      {/* Features */}
      <div className="about-section">
        <h2>🚀 Features</h2>
        <ul>
          <li>AI Chat system</li>
          <li>Community chat sharing</li>
          <li>Export chats as PDF</li>
          <li>User authentication</li>
        </ul>
      </div>

      {/* Tech Stack */}
      <div className="about-section">
        <h2>🛠 Tech Stack</h2>
        <ul>
          <li>Frontend: React</li>
          <li>Backend: Node.js + Express</li>
          <li>Database: MongoDB</li>
        </ul>
      </div>

      {/* Author */}
      <div className="about-section">
        <h2>👨‍💻 Developed By</h2>
        <p>Raghav Bhatia & Arpandeep Singh</p>
      </div>
    </div>
  );
};

export default About;
