import React from "react";

const BannedList = ({ banned_tags, toggleBan }) => {
  return (
    <div>
      <h2>Banned Attributes</h2>
      {Object.entries(banned_tags).map(([category, values]) => (
        <div key={category}>
          <strong>{category}:</strong>{" "}
          {values.length === 0
            ? "None"
            : values.map(val => (
                <span
                  key={val}
                  onClick={() => toggleBan(category, val)}
                  style={{
                    marginRight: "8px",
                    cursor: "pointer",
                    color: "red"
                  }}
                >
                  {val}
                </span>
              ))}
        </div>
      ))}
    </div>
  );
};

export default BannedList;