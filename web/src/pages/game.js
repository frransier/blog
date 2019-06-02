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

  const defaultColumnProperties = {
    sortable: true
  };

  const columns = [{ key: "name", name: "Name" }, { key: "team", name: "Team" }].map(c => ({
    ...c,
    ...defaultColumnProperties
  }));

  const playerNodes = data && data.players && mapEdgesToNodes(data.players);
  const [players, setPlayers] = useState([]);
  const [fullTeam, setFullTeam] = useState(false);
  const [rows, setRows] = useState(playerNodes);

  useEffect(() => {
    players.length === 5 ? setFullTeam(true) : setFullTeam(false);
    console.log(players);
  }, [players]);

  function addPlayer(_, player) {
    if (player) fullTeam ? null : setPlayers(prevPlayers => [...prevPlayers, player]);
  }

  function removePlayer(index) {
    players.splice(index, 1);
    setPlayers([...players]);
  }

  const sortRows = (initialRows, sortColumn, sortDirection) => rows => {
    const comparer = (a, b) => {
      if (sortDirection === "ASC") {
        return a[sortColumn] > b[sortColumn] ? 1 : -1;
      } else if (sortDirection === "DESC") {
        return a[sortColumn] < b[sortColumn] ? 1 : -1;
      }
    };
    return sortDirection === "NONE" ? initialRows : [...rows].sort(comparer);
  };

  return (
    <Layout>
      <SEO title="Fantasy Football" />
      <Container>
        <div>
          <h3 className={responsiveTitle2}>Your team </h3>
          <hr />
          {players.map(
            (player, index) =>
              !!player && (
                <input
                  key={index}
                  value={player.name}
                  onClick={() => removePlayer(index)}
                  readOnly={true}
                  type="text"
                  name={player.name}
                  required
                />
              )
          )}
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
          <ReactDataGrid
            columns={columns}
            rowGetter={i => rows[i]}
            rowsCount={rows.length}
            minHeight={400}
            onRowClick={addPlayer}
            onGridSort={(sortColumn, sortDirection) =>
              setRows(sortRows(rows, sortColumn, sortDirection))
            }
          />
        </div>
      </Container>
    </Layout>
  );
};

export default GamePage;
