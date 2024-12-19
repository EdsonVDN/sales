import React, { useState, useEffect } from "react";
import { IconButton, Tooltip } from "@material-ui/core";
import "./DarkModeToggle.css"; 

function DarkModeToggle() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
      <IconButton
        onClick={handleThemeToggle}
        className="darkmodetoggle"
      >
        <div className={`containerdarkmode ${theme}`}>
          <div className={`sun ${theme === "light" ? "visible" : ""}`}></div>
          <div className={`moon ${theme === "dark" ? "visible" : ""}`}>
            <div className="star"></div>
            <div className="star small"></div>
          </div>
        </div>
      </IconButton>
  );
}

export default DarkModeToggle;
