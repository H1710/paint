import React from "react";

export const Toolbar: React.FC<any> = ({
  handleDownload,
  dateUrl,
  handleClear,
}) => {
  return (
    <aside>
      <div>
        <a
          className="btn btn--main btn--block"
          download="image.png"
          onClick={handleDownload}
          href={dateUrl}
        >
          Save Image
        </a>
        <button className="btn btn--block" onClick={handleClear}>
          Clear
        </button>
      </div>
    </aside>
  );
};
