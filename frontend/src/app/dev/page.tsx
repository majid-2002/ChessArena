"use client";

import { useEffect, useState } from "react";

export const Devpage = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("https://api-chess-arena.vercel.app/")
      .then((res) => res.json())
      .then((result) => {
        setData(result);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // Add an empty dependency array to ensure the effect runs only once

  return (
    <div className="w-full flex items-center justify-center h-full text-xl">
      {data ? <div>Data: {data.message}</div> : "Loading..."}
    </div>
  );
};
export default Devpage;
