import React, { useState, useEffect, useCallback } from "react";
import { graphql } from "gatsby";
import { mapEdgesToNodes } from "../lib/helpers";
import BlogPostPreviewGrid from "../components/blog-post-preview-grid";
import Container from "../components/container";
import GraphQLErrorList from "../components/graphql-error-list";
import SEO from "../components/seo";
import Layout from "../containers/layout";

import { responsiveTitle1, responsiveTitle2 } from "../components/typography.module.css";

export const query = graphql`
  query GamePageQuery {
    players: allSanityPlayer(sort: { fields: team }, filter: { included: { eq: true } }) {
      edges {
        node {
          name
          team
          ppg
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

  const [playerNodes, setPlayerNodes] = useState(
    data && data.players && mapEdgesToNodes(data.players)
  );

  const [players, setPlayers] = useState([]);
  const [fullTeam, setFullTeam] = useState(false);

  useEffect(() => {
    players.length === 5 ? setFullTeam(true) : setFullTeam(false);
  }, [players]);

  function addPlayer(player) {
    fullTeam ? null : setPlayers(prevPlayers => [...prevPlayers, player]);
    filterPlayer(player);
  }

  function removePlayer(index) {
    setPlayerNodes(prevNodes => [...prevNodes, players[index]]);
    players.splice(index, 1);
    setPlayers([...players]);
  }

  function filterPlayer(player) {
    const updatedPlayerNodes = playerNodes.filter(p => p.name !== player.name);
    setPlayerNodes([...updatedPlayerNodes]);
  }

  return (
    <Layout>
      <SEO title="Fantasy Football" />
      <Container>
        <div>
          <h3 className={responsiveTitle2}>Your team </h3>
          <hr />
          {players.map((player, index) => (
            <div key={index} value={player.name} onClick={() => removePlayer(index)}>
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
              value={players.length > 4 && players[0] && players[0].name}
              readOnly={true}
              type="hidden"
              name="Player 1"
              required
            />
            <input
              value={players.length > 4 && players[1] && players[1].name}
              readOnly={true}
              type="hidden"
              name="Player 2"
              required
            />
            <input
              value={players.length > 4 && players[2] && players[2].name}
              readOnly={true}
              type="hidden"
              name="Player 3"
              required
            />
            <input
              value={players.length > 4 && players[3] && players[4].name}
              readOnly={true}
              type="hidden"
              name="Player 4"
              required
            />
            <input
              value={players.length > 4 && players[4] && players[4].name}
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
          <h2 className={responsiveTitle1}>Pick your players</h2>
          {playerNodes.map((player, index) => (
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
