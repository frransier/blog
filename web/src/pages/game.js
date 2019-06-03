import React, { useState, useEffect, useReducer } from "react";
import { graphql } from "gatsby";
import { mapEdgesToNodes, dynamicSort } from "../lib/helpers";
import BlogPostPreviewGrid from "../components/blog-post-preview-grid";
import Container from "../components/container";
import GraphQLErrorList from "../components/graphql-error-list";
import SEO from "../components/seo";
import Layout from "../containers/layout";

import { responsiveTitle1, responsiveTitle2 } from "../components/typography.module.css";

export const query = graphql`
  query GamePageQuery {
    team: allSanityPlayer(sort: { fields: team }, filter: { included: { eq: true } }) {
      edges {
        node {
          name
          team
          ppg
          id
        }
      }
    }
  }
`;

const GamePage = props => {
  const { data, errors } = props;
  if (errors) {
    return (
      <Layout>
        <GraphQLErrorList errors={errors} />
      </Layout>
    );
  }

  const playerNodes = data && data.team && mapEdgesToNodes(data.team);

  const [fullTeam, setFullTeam] = useState(false);

  const [players, playerDispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "add":
        if (state.includes(action.player)) {
          return state;
        } else {
          return [...state, action.player].sort(dynamicSort("name"));
        }
      case "remove":
        return state.filter(player => player.id !== action.id);
    }
  }, playerNodes.sort(dynamicSort("name")));

  const [team, teamDispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "add":
        if (state.includes(action.player) || state.length > 4) {
          return state;
        } else {
          playerDispatch({
            type: "remove",
            id: action.player.id
          });
          return [...state, action.player];
        }

      case "remove":
        playerDispatch({
          type: "add",
          player: state[action.index]
        });
        return state.filter((_, index) => index != action.index);
      default:
        return state;
    }
  }, []);

  useEffect(() => {
    team.length === 5 ? setFullTeam(true) : setFullTeam(false);
  }, [team]);

  function addPlayer(player) {
    teamDispatch({
      type: "add",
      player
    });
  }

  function removePlayer(index) {
    teamDispatch({
      type: "remove",
      index
    });
  }

  return (
    <Layout>
      <SEO title="Fantasy Football" />
      <Container>
        <div>
          <h3 className={responsiveTitle2}>Your team </h3>
          <hr />
          {team.map((player, index) => (
            <div key={player.id} value={player.name} onClick={() => removePlayer(index)}>
              {player.name}
            </div>
          ))}
          <form
            name="play"
            method="post"
            action="/welcome/"
            data-netlify="true"
            data-netlify-honeypot="yekshemesh"
          >
            <input type="hidden" name="form-name" value="play" />
            <input
              value={team.length > 4 && team[0].name}
              readOnly={true}
              type="hidden"
              name="Player 1"
              required
            />
            <input
              value={team.length > 4 && team[1].name}
              readOnly={true}
              type="hidden"
              name="Player 2"
              required
            />
            <input
              value={team.length > 4 && team[2].name}
              readOnly={true}
              type="hidden"
              name="Player 3"
              required
            />
            <input
              value={team.length > 4 && team[3].name}
              readOnly={true}
              type="hidden"
              name="Player 4"
              required
            />
            <input
              value={team.length > 4 && team[4].name}
              readOnly={true}
              type="hidden"
              name="Player 5"
              required
            />
            <input type="hidden" name="yekshemesh" />

            <div>
              <input
                type={fullTeam ? "email" : "hidden"}
                name="email"
                placeholder="Your email"
                required
              />{" "}
              {fullTeam && <button type="submit">Play</button>}
            </div>
          </form>
        </div>
        <hr />
        <div>
          <h2 className={responsiveTitle1}>Pick your team</h2>
          {players.map((player, index) => (
            <div key={index}>
              <p onClick={() => addPlayer(player)}>{player.name}</p>
            </div>
          ))}
        </div>
      </Container>
    </Layout>
  );
};

export default GamePage;
