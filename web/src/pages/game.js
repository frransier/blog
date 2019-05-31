import React, { useState, useEffect, useCallback } from "react";
import { graphql } from "gatsby";
import { mapEdgesToNodes } from "../lib/helpers";
import BlogPostPreviewGrid from "../components/blog-post-preview-grid";
import Container from "../components/container";
import GraphQLErrorList from "../components/graphql-error-list";
import SEO from "../components/seo";
import Layout from "../containers/layout";
//import MaterialTable from "material-table";

import { responsiveTitle1, responsiveTitle2 } from "../components/typography.module.css";

export const query = graphql`
  query GamePageQuery {
    players: allSanityPlayer {
      edges {
        node {
          name
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

  const [players, setPlayers] = useState([]);
  const playerNodes = data && data.players && mapEdgesToNodes(data.players);

  useEffect(() => {
    console.log(players);
  }, [players]);

  const addPlayer = player => () => {
    players.length < 5 ? setPlayers(prevPlayers => [...prevPlayers, player]) : null;
  };

  const removePlayer = index => () => {
    const dplayers = players;
    dplayers.splice(index, 1);
    setPlayers([...dplayers]);
  };

  return (
    <Layout>
      <SEO title="Fantasy Football done right" />
      <Container>
        <div>
          <h1 className={responsiveTitle1}>Pick your players</h1>
          <hr />
          {playerNodes.map((player, index) => (
            <button key={index} onClick={addPlayer(player)} readOnly={true}>
              {player.name}
            </button>
          ))}
        </div>
        <div>
          <h3 className={responsiveTitle2}>Your team </h3>
          <hr />
          {/* {players.length !== 5 ? ( */}
          {players.map((player, index) => (
            <input
              key={index}
              value={player.name}
              onClick={removePlayer(index)}
              readOnly={true}
              type="text"
              name={player.name}
              required
            />
          ))}
          {/* ) : ( */}
          <form name="play" method="post" data-netlify="true" data-netlify-honeypot="yekshemesh">
            <input type="hidden" name="form-name" value="play" />
            <input
              value={players.length > 4 && players[0].name}
              readOnly={true}
              type="hidden"
              name="Player 1"
              required
            />
            <input
              value={players.length > 4 && players[1].name}
              readOnly={true}
              type="hidden"
              name="Player 2"
              required
            />
            <input
              value={players.length > 4 && players[2].name}
              readOnly={true}
              type="hidden"
              name="Player 3"
              required
            />
            <input
              value={players.length > 4 && players[3].name}
              readOnly={true}
              type="hidden"
              name="Player 4"
              required
            />
            <input
              value={players.length > 4 && players[4].name}
              readOnly={true}
              type="hidden"
              name="Player 5"
              required
            />
            <input type="hidden" name="yekshemesh" />
            {players.length === 5 && <button type="submit">Play</button>}
          </form>
        </div>
      </Container>
    </Layout>
  );
};

export default GamePage;
