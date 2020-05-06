import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useLoginMutation, MeDocument, MeQuery } from "../../generated/graphql";
import { setAuthToken } from "../../utils/AuthToken";

export const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [login] = useLoginMutation();
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          const response = await login({
            variables: {
              email,
              password,
            },
            update: (store, { data }) => {
              if (!data) {
                return null;
              }

              store.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  me: data.login.user,
                },
              });
            },
          });
          if (response && response.data) {
            setAuthToken(response.data.login.accessToken);
          }
        } catch (err) {
          console.error(err.message);
        }
        history.push("/");
      }}
    >
      <div>
        <input
          type="text"
          name="email"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          name="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};
