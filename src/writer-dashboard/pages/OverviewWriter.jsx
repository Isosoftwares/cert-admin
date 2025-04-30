import React from "react";
import useAuth from "../../hooks/useAuth";

function OverviewWriter() {
  const { auth } = useAuth();
  return <div className="mt-4">overview</div>;
}

export default OverviewWriter;
