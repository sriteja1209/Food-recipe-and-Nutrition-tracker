import React, { useEffect } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; // Import the default styles

const LoadingProgressBar = () => {
  useEffect(() => {
    // Start the progress bar when the component mounts
    NProgress.start();

    // Stop the progress bar when the component unmounts or when the route changes
    return () => NProgress.done();
  }, []);

  return null;
};

export default LoadingProgressBar;
