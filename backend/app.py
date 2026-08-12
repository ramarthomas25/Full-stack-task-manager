from datetime import datetime

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///taskmanager.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


# -------------------------
# DATABASE MODELS
# -------------------------

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    tasks = db.relationship(
        "Task",
        backref="project",
        cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name
        }


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Boolean, default=False)

    priority = db.Column(
        db.String(20),
        nullable=False,
        default="Medium"
    )

    due_date = db.Column(
        db.Date,
        nullable=True
    )

    project_id = db.Column(
        db.Integer,
        db.ForeignKey("project.id"),
        nullable=True
    )

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "completed": self.completed,
            "priority": self.priority,
            "due_date": (
                self.due_date.isoformat()
                if self.due_date
                else None
            ),
            "project_id": self.project_id,
            "project_name": (
                self.project.name
                if self.project
                else None
            )
        }


# -------------------------
# HEALTH
# -------------------------

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "message": "Task Manager API is running"
    })


# -------------------------
# PROJECTS
# -------------------------

@app.route("/api/projects", methods=["GET"])
def get_projects():
    projects = Project.query.all()

    return jsonify([
        project.to_dict()
        for project in projects
    ])


@app.route("/api/projects", methods=["POST"])
def create_project():
    data = request.get_json()

    name = data.get("name", "").strip()

    if not name:
        return jsonify({
            "error": "Project name is required"
        }), 400

    project = Project(name=name)

    db.session.add(project)
    db.session.commit()

    return jsonify(project.to_dict()), 201


@app.route("/api/projects/<int:project_id>", methods=["DELETE"])
def delete_project(project_id):
    project = Project.query.get_or_404(project_id)

    db.session.delete(project)
    db.session.commit()

    return jsonify({
        "message": "Project deleted"
    })


# -------------------------
# TASKS
# -------------------------

@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    tasks = Task.query.all()

    return jsonify([
        task.to_dict()
        for task in tasks
    ])


@app.route("/api/tasks", methods=["POST"])
def create_task():
    data = request.get_json()

    title = data.get("title", "").strip()
    priority = data.get("priority", "Medium")
    due_date_text = data.get("due_date")
    project_id = data.get("project_id")

    if not title:
        return jsonify({
            "error": "Task title is required"
        }), 400

    due_date = None

    if due_date_text:
        due_date = datetime.strptime(
            due_date_text,
            "%Y-%m-%d"
        ).date()

    task = Task(
        title=title,
        completed=False,
        priority=priority,
        due_date=due_date,
        project_id=project_id
    )

    db.session.add(task)
    db.session.commit()

    return jsonify(task.to_dict()), 201


@app.route("/api/tasks/<int:task_id>", methods=["PATCH"])
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.get_json()

    if "title" in data:
        task.title = data["title"]

    if "completed" in data:
        task.completed = data["completed"]

    if "priority" in data:
        task.priority = data["priority"]

    if "project_id" in data:
        task.project_id = data["project_id"]

    if "due_date" in data:
        if data["due_date"]:
            task.due_date = datetime.strptime(
                data["due_date"],
                "%Y-%m-%d"
            ).date()
        else:
            task.due_date = None

    db.session.commit()

    return jsonify(task.to_dict())


@app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)

    db.session.delete(task)
    db.session.commit()

    return jsonify({
        "message": "Task deleted"
    })


with app.app_context():
    db.create_all()


if __name__ == "__main__":
    app.run(debug=True)