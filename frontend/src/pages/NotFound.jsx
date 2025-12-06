import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
    <h1 className="text-6xl font-bold text-slate-900">404</h1>
    <p className="mt-4 text-xl text-slate-600">Page not found</p>
    <Link to="/" className="mt-6 text-blue-600 hover:underline">
      Go back home
    </Link>
  </div>
);

export default NotFound;