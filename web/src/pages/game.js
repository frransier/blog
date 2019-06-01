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
    players: allSanityPlayer(sort: { fields: team }) {
      edges {
        node {
          name
          team
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
  const [fullTeam, setFullTeam] = useState(false);
  const playerNodes = data && data.players && mapEdgesToNodes(data.players);

  useEffect(() => {
    players.length === 5 ? setFullTeam(true) : setFullTeam(false);
  }, [players]);

  const addPlayer = player => () => {
    fullTeam ? null : setPlayers(prevPlayers => [...prevPlayers, player]);
  };

  const removePlayer = index => () => {
    const dplayers = players;
    dplayers.splice(index, 1);
    setPlayers([...dplayers]);
  };

  var buttonStyle = { height: "50px" };

  return (
    <Layout>
      <SEO title="Fantasy Football" />
      <Container>
        <div>
          <h1>Matches 1/6 2019</h1>
          <h4>Deadline 16:00</h4>
          <p>IFK Göteborg - Örebro</p>
          <p>Sirius - Djurgården</p>
          <p>Falkenberg - Kalmar</p>
          <p>Östersund - GIF Sundsvall</p>
        </div>
        <hr />
        <div>
          <h2 className={responsiveTitle1}>Pick your players</h2>

          {playerNodes.map((player, index) => (
            <button style={buttonStyle} key={index} onClick={addPlayer(player)} readOnly={true}>
              {player.name} <br /> {player.team}
            </button>
          ))}
        </div>
        <div>
          <h3 className={responsiveTitle2}>Your team </h3>
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
            <hr />
            <div>
              <input
                type={fullTeam ? "email" : "hidden"}
                name="email"
                placeholder="Enter your e-mail"
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
