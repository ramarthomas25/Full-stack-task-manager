function Header() {
  return (
    <header className="header">
      <div className="logo-title">
        <img
          src="/task-logo.png"
          alt="Task Manager logo"
          className="logo"
        />

        <h1>Task Manager</h1>
      </div>

      <p>Organize your work. Stay productive.</p>
    </header>
  );
}

export default Header;