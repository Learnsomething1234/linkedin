import React, { useState } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [active, setActive] = useState("home");

  const navItems = [
    { name: "home", label: "Home", href: "/" },
    { name: "mypost", label: "myPost", href: "/mypost" },
    { name: "createpost", label: "createPost", href: "/post/create" },
    { name: "users", label: "users", href: "/users" },
    { name: "account", label: "account", href: "/profile" },
    { name: "logout", label: "logout", href: "/logout" },
  ];

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        {navItems.map(({ name, label, href }) => (
          <li key={name} className="navbar-item">
            <a
              href={href}
              className={`navbar-link ${active === name ? "active" : ""}`}
              onClick={() => setActive(name)}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
