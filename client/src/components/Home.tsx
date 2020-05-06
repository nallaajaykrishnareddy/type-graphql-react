import React from "react";
import { useUsersQuery } from "../generated/graphql";

export interface Props {}

export const Home: React.FC<Props> = () => {
  const { data, error } = useUsersQuery();
  if (error) {
    console.log(error);
  }
  if (!data) return <h1>loading.....</h1>;
  return (
    <div>
      <ul>
        {data.users.map(({ id, email }) => {
          return (
            <li key={id}>
              {email} - {id}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
