import React from "react";
import { useRouteError } from "react-router-dom";

const Error = () => {
  const {error} = useRouteError();
  return (
    <>
      <div className="flex items-center justify-center flex-col gap-2 h-96">
        <h1 className="text-4xl font-bold">⚠️OOPS! Somehting went wrong</h1>
        <p className="text-2xl">Error:{error}🤷‍♂️</p>
      </div>
    </>
  );
};

export default Error;
