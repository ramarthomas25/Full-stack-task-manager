import { useEffect, useState } from "react";

function TaskList({ onDataChanged }) {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  // Add task
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [projectId, setProjectId] = useState("");

  // Search / filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  // Editing
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState("Medium");
  const [editDueDate, setEditDueDate] = useState("");
  const [editProjectId, setEditProjectId] = useState("");

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  async function fetchTasks() {
    const response = await fetch(
      "http://127.0.0.1:5000/api/tasks"
    );

    const data = await response.json();
    setTasks(data);
  }

  async function fetchProjects() {
    const response = await fetch(
      "http://127.0.0.1:5000/api/projects"
    );

    const data = await response.json();
    setProjects(data);
  }

  async function addTask() {
    if (!newTask.trim()) return;

    const response = await fetch(
      "http://127.0.0.1:5000/api/tasks",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title: newTask,
          priority,
          due_date: dueDate || null,
          project_id: projectId
            ? Number(projectId)
            : null,
        }),
      }
    );

    const createdTask = await response.json();

    setTasks([...tasks, createdTask]);

    setNewTask("");
    setPriority("Medium");
    setDueDate("");
    setProjectId("");

    onDataChanged?.();
  }

  async function toggleTask(task) {
    const response = await fetch(
      `http://127.0.0.1:5000/api/tasks/${task.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          completed: !task.completed,
        }),
      }
    );

    const updatedTask = await response.json();

    setTasks(
      tasks.map((currentTask) =>
        currentTask.id === updatedTask.id
          ? updatedTask
          : currentTask
      )
    );

    onDataChanged?.();
  }

  async function deleteTask(id) {
    await fetch(
      `http://127.0.0.1:5000/api/tasks/${id}`,
      {
        method: "DELETE",
      }
    );

    setTasks(tasks.filter((task) => task.id !== id));

    onDataChanged?.();
  }

  function startEditing(task) {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditPriority(task.priority);
    setEditDueDate(task.due_date || "");

    setEditProjectId(
      task.project_id ? String(task.project_id) : ""
    );
  }

  function cancelEditing() {
    setEditingId(null);
  }

  async function saveEdit(id) {
    if (!editTitle.trim()) return;

    const response = await fetch(
      `http://127.0.0.1:5000/api/tasks/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title: editTitle,
          priority: editPriority,
          due_date: editDueDate || null,
          project_id: editProjectId
            ? Number(editProjectId)
            : null,
        }),
      }
    );

    const updatedTask = await response.json();

    setTasks(
      tasks.map((task) =>
        task.id === updatedTask.id
          ? updatedTask
          : task
      )
    );

    setEditingId(null);

    onDataChanged?.();
  }

  const filteredTasks = tasks.filter((task) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      task.title.toLowerCase().includes(search) ||
      (task.project_name || "")
        .toLowerCase()
        .includes(search);

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Completed" &&
        task.completed) ||
      (statusFilter === "Active" &&
        !task.completed);

    const matchesPriority =
      priorityFilter === "All" ||
      task.priority === priorityFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority
    );
  });

  return (
    <section className="task-section">
      <h2>My Tasks</h2>

      {/* ADD TASK */}
      <div className="add-task-form task-form-expanded">
        <input
          type="text"
          placeholder="Enter a new task..."
          value={newTask}
          onChange={(e) =>
            setNewTask(e.target.value)
          }
        />

        <select
          value={projectId}
          onFocus={fetchProjects}
          onChange={(e) =>
            setProjectId(e.target.value)
          }
        >
          <option value="">No Project</option>

          {projects.map((project) => (
            <option
              key={project.id}
              value={project.id}
            >
              {project.name}
            </option>
          ))}
        </select>

        <select
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value)
          }
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) =>
            setDueDate(e.target.value)
          }
        />

        <button onClick={addTask}>
          + Add Task
        </button>
      </div>

      {/* SEARCH + FILTERS */}
      <div className="task-controls">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Completed">
            Completed
          </option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(e.target.value)
          }
        >
          <option value="All">
            All Priorities
          </option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* TASK LIST */}
      <div className="task-list">
        {filteredTasks.length === 0 && (
          <p>No tasks found.</p>
        )}

        {filteredTasks.map((task) => (
          <div
            className="task-item"
            key={task.id}
          >
            {editingId === task.id ? (
              <div className="edit-task-form">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) =>
                    setEditTitle(e.target.value)
                  }
                />

                <select
                  value={editProjectId}
                  onFocus={fetchProjects}
                  onChange={(e) =>
                    setEditProjectId(
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    No Project
                  </option>

                  {projects.map((project) => (
                    <option
                      key={project.id}
                      value={project.id}
                    >
                      {project.name}
                    </option>
                  ))}
                </select>

                <select
                  value={editPriority}
                  onChange={(e) =>
                    setEditPriority(
                      e.target.value
                    )
                  }
                >
                  <option value="Low">Low</option>
                  <option value="Medium">
                    Medium
                  </option>
                  <option value="High">High</option>
                </select>

                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) =>
                    setEditDueDate(
                      e.target.value
                    )
                  }
                />

                <button
                  onClick={() =>
                    saveEdit(task.id)
                  }
                >
                  Save
                </button>

                <button
                  className="cancel-button"
                  onClick={cancelEditing}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() =>
                    toggleTask(task)
                  }
                />

                <div className="task-information">
                  <span
                    className={
                      task.completed
                        ? "completed-task task-title"
                        : "task-title"
                    }
                  >
                    {task.title}
                  </span>

                  <div className="task-details">
                    <span
                      className={`priority ${task.priority.toLowerCase()}`}
                    >
                      {task.priority}
                    </span>

                    {task.project_name && (
                      <span>
                        📁 {task.project_name}
                      </span>
                    )}

                    {task.due_date && (
                      <span>
                        📅 {task.due_date}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  className="edit-button"
                  onClick={() =>
                    startEditing(task)
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-button"
                  onClick={() =>
                    deleteTask(task.id)
                  }
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default TaskList;