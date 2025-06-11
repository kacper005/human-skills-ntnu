import React from "react";

export const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-6">
        The page you are looking for does not exist or has been moved.
      </p>
      <a
        href="/"
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Go to Home
      </a>
    </div>
  );
};
