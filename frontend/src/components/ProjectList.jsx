import { useEffect, useState } from "react";

function ProjectList({ onDataChanged }) {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const response = await fetch("http://127.0.0.1:5000/api/projects");
    const data = await response.json();
    setProjects(data);
  }

  async function addProject() {
    if (!newProject.trim()) return;

    const response = await fetch("http://127.0.0.1:5000/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newProject,
      }),
    });

    const createdProject = await response.json();

    setProjects([...projects, createdProject]);
    setNewProject("");
    
    onDataChanged?.();
  }

  async function deleteProject(id) {
    await fetch(`http://127.0.0.1:5000/api/projects/${id}`, {
      method: "DELETE",
    });

    setProjects(projects.filter((project) => project.id !== id));

    onDataChanged?.();
  }

  return (
    <section className="project-section">
      <h2>Projects</h2>

      <div className="add-project-form">
        <input
          type="text"
          placeholder="Enter project name..."
          value={newProject}
          onChange={(e) => setNewProject(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addProject();
            }
          }}
        />

        <button onClick={addProject}>+ Add Project</button>
      </div>

      <div className="project-list">
        {projects.map((project) => (
          <div className="project-item" key={project.id}>
            <span>{project.name}</span>

            <button
              className="delete-button"
              onClick={() => deleteProject(project.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProjectList;