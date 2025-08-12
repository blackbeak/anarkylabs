import React, { useEffect } from 'react';

const ElfsightWidget = () => {
  useEffect(() => {
    // Dynamically load the Elfsight script after the component mounts
    const script = document.createElement("script");
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="elfsight-app-af1c7b65-065d-4c05-a53e-722372f12861" data-elfsight-app-lazy></div>
  );
};

export default ElfsightWidget;