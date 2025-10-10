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
    <div className="elfsight-app-f3f52b7b-dd7b-4603-9b17-4d2aebb397d1" data-elfsight-app-lazy></div>
  );
};

export default ElfsightWidget;