export default {
  widgets: [
    {
      name: 'sanity-tutorials',
      options: {
        templateRepoId: 'sanity-io/sanity-template-gatsby-blog'
      }
    },
    {name: 'structure-menu'},
    {
      name: 'project-info',
      options: {
        __experimental_before: [
          {
            name: 'netlify',
            options: {
              description:
                'NOTE: Because these sites are static builds, they need to be re-deployed to see the changes when documents are published.',
              sites: [
                {
                  buildHookId: '5ce927d9f1819db79602084b',
                  title: 'Sanity Studio',
                  name: 'blog-studio-c9xj99ka',
                  apiId: 'f9100b7b-5923-4430-a3e5-99184283cf06'
                },
                {
                  buildHookId: '5ce927d943aa2462a94486db',
                  title: 'Blog Website',
                  name: 'blog-web-cukdare9',
                  apiId: '0d3a2b56-e9bd-472d-9f4f-28e8b23aeca3'
                }
              ]
            }
          }
        ],
        data: [
          {
            title: 'GitHub repo',
            value: 'https://github.com/frransier/blog',
            category: 'Code'
          },
          {title: 'Frontend', value: 'https://blog-web-cukdare9.netlify.com', category: 'apps'}
        ]
      }
    },
    {name: 'project-users', layout: {height: 'auto'}},
    {
      name: 'document-list',
      options: {title: 'Recent blog posts', order: '_createdAt desc', types: ['post']},
      layout: {width: 'medium'}
    }
  ]
}
