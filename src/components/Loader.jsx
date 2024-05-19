import React from "react";

export default function Loader() {
  return (
    <div className=" z-50 bg-slate-50/50 absolute top-0 left-0 border border-red-500 w-full h-full flex items-center justify-center">
      <div className="w-10 h-10 border-4 animate-spin border-green-600 border-x-0 border-b-0 rounded-full"></div>
    </div>
  );
}
