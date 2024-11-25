import React, { useState } from "react";

const ReadMoreLess = ({ text, limit = 100 }) => {
  const [isReadMore, setIsReadMore] = useState(false);

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  if (!text) {
    return <p>No content available.</p>;
  }

  return (
    <p>
      {isReadMore ? text : `${text.slice(0, limit)}...`}{" "}
      <button
        className="btn btn-link p-0"
        onClick={toggleReadMore}
        style={{ textDecoration: "none" }}
      >
        {isReadMore ? "Read Less" : "Read More"}
      </button>
    </p>
  );
};

export default ReadMoreLess;
