import React from "react";
import { useByeQuery } from "../generated/graphql";

export const Bye: React.FC = () => {
  const { data, loading, error } = useByeQuery();

  if (loading) return <h1>Loading.......</h1>;

  if (error) {
    console.log(error);
    return <div>err</div>;
  }
  return <div>{data!.bye}</div>;
};
