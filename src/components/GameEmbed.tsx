import { useEffect } from "react";

export default function GameEmbed() {
  useEffect(() => {
    // Create a script element
    const script = document.createElement("script");
    script.src =
      "https://cdn.htmlgames.com/embed.js?game=Daily2Queens&bgcolor=white";
    script.async = true; // Load asynchronously for performance
    // Append the script to the div
    const embedDiv = document.getElementById("game-container");
    if (embedDiv) {
      embedDiv.appendChild(script);
    }

    // Cleanup script when the component unmounts
    return () => {
      if (embedDiv) {
        embedDiv.innerHTML = ""; // Clear the div
      }
    };
  }, []);

  return (
    <div>
      <h2>Daily 2 Queens Game</h2>
      {/* The container for the game */}
      <div id="game-container"></div>
    </div>
  );
}
