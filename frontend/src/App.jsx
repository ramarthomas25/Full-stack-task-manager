import { useEffect, useState } from "react";
import "./App.css";

import Header from "./components/Header";
import ProjectList from "./components/ProjectList";
import TaskList from "./components/TaskList";

function App() {
  const [projectCount, setProjectCount] = useState(0);
  const [taskCount, setTaskCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  async function refreshDashboard() {
    const [projectsResponse, tasksResponse] = await Promise.all([
      fetch("http://127.0.0.1:5000/api/projects"),
      fetch("http://127.0.0.1:5000/api/tasks"),
    ]);

    const projects = await projectsResponse.json();
    const tasks = await tasksResponse.json();

    setProjectCount(projects.length);
    setTaskCount(tasks.length);

    const completedTasks = tasks.filter(
      (task) => task.completed === true
    );

    setCompletedCount(completedTasks.length);
  }

  useEffect(() => {
    refreshDashboard();
  }, []);

  return (
    <div className="app">
      <Header />

      <main className="dashboard">
        <div className="card">
          <h2>Projects</h2>
          <p>{projectCount}</p>
        </div>

        <div className="card">
          <h2>Tasks</h2>
          <p>{taskCount}</p>
        </div>

        <div className="card">
          <h2>Completed</h2>
          <p>{completedCount}</p>
        </div>
      </main>

      <ProjectList onDataChanged={refreshDashboard} />

      <TaskList onDataChanged={refreshDashboard} />
    </div>
  );
}

export default App;