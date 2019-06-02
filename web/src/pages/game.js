import React, { useState, useEffect, useCallback } from "react";
import { graphql } from "gatsby";
import { mapEdgesToNodes } from "../lib/helpers";
import BlogPostPreviewGrid from "../components/blog-post-preview-grid";
import Container from "../components/container";
import GraphQLErrorList from "../components/graphql-error-list";
import SEO from "../components/seo";
import Layout from "../containers/layout";
import ReactDataGrid from "react-data-grid";

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
  const playerNodes = data && data.players && mapEdgesToNodes(data.players);

  const columns = [{ key: "name", name: "Name" }, { key: "team", name: "Team" }];
  const rows = playerNodes;

  const [players, setPlayers] = useState([]);
  const [fullTeam, setFullTeam] = useState(false);

  useEffect(() => {
    players.length === 5 ? setFullTeam(true) : setFullTeam(false);
  }, [players]);

  function addPlayer(id, player) {
    fullTeam ? null : setPlayers(prevPlayers => [...prevPlayers, player]);
  }

  function removePlayer(index) {
    players.splice(index, 1);
    setPlayers([...players]);
  }

  return (
    <Layout>
      <SEO title="Fantasy Football" />
      <Container>
        <div>
          <h3 className={responsiveTitle2}>Your team </h3>
          <hr />
          {players.map((player, index) => (
            <input
              key={index}
              value={player.name}
              onClick={() => removePlayer(index)}
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
        <hr />
        <div>
          <h2 className={responsiveTitle1}>Pick your players</h2>
          <ReactDataGrid
            columns={columns}
            rowGetter={i => rows[i]}
            rowsCount={rows.length}
            minHeight={1000}
            onRowClick={addPlayer}
          />
        </div>
      </Container>
    </Layout>
  );
};

export default GamePage;
