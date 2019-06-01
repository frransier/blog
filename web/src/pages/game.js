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
    players: allSanityPlayer(sort: { fields: team }, filter: { included: { eq: true } }) {
      edges {
        node {
          name
          team
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
  const [fullTeam, setFullTeam] = useState(false);
  const playerNodes = data && data.players && mapEdgesToNodes(data.players);

  useEffect(() => {
    players.length === 3 ? setFullTeam(true) : setFullTeam(false);
  }, [players]);

  const addPlayer = player => () => {
    fullTeam ? null : setPlayers(prevPlayers => [...prevPlayers, player]);
  };

  const removePlayer = index => () => {
    const dplayers = players;
    dplayers.splice(index, 1);
    setPlayers([...dplayers]);
  };

  var buttonStyle = { WebkitAppearance: "none", margin: "2.5px" };

  return (
    <Layout>
      <SEO title="Fantasy Football" />
      <Container>
        <div>
          <h1>Champions League-final</h1>
          <h4>Deadline 21:00</h4>
          <p>Liverpool - Tottenham</p>
          <h4>Regler</h4>
          <p>
            Välj olika 5 spelare. <br /> Du får <strong>1p</strong> per{" "}
            <strong>mål, assist, kort</strong> per spelare.
          </p>
          <p>Den eller de som får högst poäng delar på hela potten</p>
          <p>Pott: 500kr</p>
        </div>
        <hr />
        <div>
          <h2 className={responsiveTitle1}>Välj ditt jävla lag</h2>

          {playerNodes.map((player, index) => (
            <button style={buttonStyle} key={index} onClick={addPlayer(player)} readOnly={true}>
              {player.name} <br /> {player.team}
            </button>
          ))}
        </div>
        <div>
          <h3 className={responsiveTitle2}>Ditt jävla lag </h3>
          <hr />
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
          <form
            name="play"
            method="post"
            action="/welcome/"
            data-netlify="true"
            data-netlify-honeypot="yekshemesh"
          >
            <input type="hidden" name="form-name" value="play" />
            <input
              value={players.length > 2 && players[0].name}
              readOnly={true}
              type="hidden"
              name="Player 1"
              required
            />
            <input
              value={players.length > 2 && players[1].name}
              readOnly={true}
              type="hidden"
              name="Player 2"
              required
            />
            <input
              value={players.length > 2 && players[2].name}
              readOnly={true}
              type="hidden"
              name="Player 3"
              required
            />
            {/* <input
              value={players.length > 2 && players[3].name}
              readOnly={true}
              type="hidden"
              name="Player 4"
              required
            />
            <input
              value={players.length > 2 && players[4].name}
              readOnly={true}
              type="hidden"
              name="Player 5"
              required
            /> */}
            <input type="hidden" name="yekshemesh" />
            <hr />
            <div>
              <input
                type={fullTeam ? "text" : "hidden"}
                name="name"
                placeholder="Skriv in ditt jävla namn"
                required
              />{" "}
              {fullTeam && <button type="submit">Play</button>}
            </div>
          </form>
        </div>
      </Container>
    </Layout>
  );
};

export default GamePage;
