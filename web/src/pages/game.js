import React, { useState, useEffect, useReducer } from "react";
import { graphql } from "gatsby";
import { mapEdgesToNodes, dynamicSort } from "../lib/helpers";
import BlogPostPreviewGrid from "../components/blog-post-preview-grid";
import Container from "../components/container";
import GraphQLErrorList from "../components/graphql-error-list";
import SEO from "../components/seo";
import Layout from "../containers/layout";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import { toast } from "react-toastify";

toast.configure();

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
  const price = 150;
  const [product] = useState({
    name: "Playmaker team",
    price: 150
  });
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

  async function handleToken(token) {
    const response = await axios.post("http://localhost:34567/purchase", {
      token
    });
    const { status } = response.data;
    if (status === "success") {
      toast("Success! Check yer mail", { type: "success" });
    } else {
      toast("Oops", { type: "error" });
    }
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
          <StripeCheckout
            stripeKey="pk_test_l8W1EmByGfRsVvD82jTrOvN400z9mmMMsh"
            token={handleToken}
            amount={price * 100}
          />
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
