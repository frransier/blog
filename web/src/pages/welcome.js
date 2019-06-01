import React, { useState, useEffect, useCallback } from "react";
import { graphql, Link } from "gatsby";
import { mapEdgesToNodes } from "../lib/helpers";
import BlogPostPreviewGrid from "../components/blog-post-preview-grid";
import Container from "../components/container";
import GraphQLErrorList from "../components/graphql-error-list";
import SEO from "../components/seo";
import Layout from "../containers/layout";
//import MaterialTable from "material-table";

import { responsiveTitle1, responsiveTitle2 } from "../components/typography.module.css";

const WelcomePage = () => {
  return (
    <Layout>
      <SEO title="Fantasy Football done right" />
      <Container>
        <div>
          <h1 className={responsiveTitle1}>Congratulations. You're in.</h1>
          <Link to="/game/">Add another team</Link>
        </div>
      </Container>
    </Layout>
  );
};

export default WelcomePage;
