const channelType = {
  host: 'String',
  channel_name: 'String',
  channel_id: 'String',
  upload_playlist_id: 'String',
  spotify_playlist_id: 'String',
  count_tracks: 1,
  found_tracks: 2,
  count_followers: 3,
  thumbnails: {default: {width: 1, url: 'String', height: 1}, high: {width: 1, url: 'String', height: 1}, medium: {width: 1, url: 'String', height: 1}}
}

module.exports = {
  siteMetadata: {
    title: `Mirror.FM`,
    description: `Mirroring songs between music services`,
    author: `@mirror_fm`,
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
        background_color: `#000`,
        theme_color: `#000`,
        display: `minimal-ui`,
        icon: `src/images/mirrorfm-icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    {
      resolve: "gatsby-source-apiserver",
      options: {
        typePrefix: "internal__",
        url: `https://qdfngarl1b.execute-api.eu-west-1.amazonaws.com/get`,
        method: "GET",
        name: `channels`,
        entityLevel: `youtube.channels`,
        schemaType: channelType,
        enableDevRefresh: true,
        auth: false,
      }
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-155299047-1",
        head: true
      },
    },
  ],
}
