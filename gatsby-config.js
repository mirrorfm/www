const channelType = {
  host: 'String',
  channel_name: 'String',
  channel_id: 'String',
  upload_playlist_id: 'String',
  count_tracks: 'Number',
  thumbnails: {default: {width: 1, url: 'String', height: 1}, high: {width: 1, url: 'String', height: 1}, medium: {width: 1, url: 'String', height: 1}},
  upload_playlist_id: 'String',
  count_tracks: 0,
}

module.exports = {
  siteMetadata: {
    title: `Mirror.FM`,
    description: `Songs availability & discovery`,
    author: `@mirrorfm`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    {
      resolve: "gatsby-source-apiserver",
      options: {
        // Type prefix of entities from server
        typePrefix: "internal__",

        // The url, this should be the endpoint you are attempting to pull data from
        url: `https://qdfngarl1b.execute-api.eu-west-1.amazonaws.com/get`,

        method: "GET",

        // Name of the data to be downloaded.  Will show in graphQL or be saved to a file
        // using this name. i.e. posts.json
        name: `channels`,

        // Nested level of entities in response object, example: `data.posts`
        entityLevel: `youtube.channels`,

        // Define schemaType to normalize blank values
        // example:
        // const postType = {
        //   id: 1,
        //   name: 'String',
        //   published: true,
        //   object: {a: 1, b: '2', c: false},
        //   array: [{a: 1, b: '2', c: false}]
        // }
        schemaType: channelType,

        enableDevRefresh: true,

        // Optionally override key used to re-source data
        // when `gatsby develop` is running.
        // Requires `enableDevRefresh: true`.
        // See setting directly above this one.
        // See also https://github.com/gatsbyjs/gatsby/issues/14653
        // Default is `id`
        auth: false,
      }
    }
  ],
}
