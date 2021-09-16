import React, { Component } from 'react'
import axios from 'axios'
import Loader from 'react-loader-spinner'
import * as PropTypes from "prop-types"

import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import slugify from 'react-slugify';
import Moment from 'react-moment';

class LogsDrawer extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    data: PropTypes.array
  }

  state = {
    loading: true,
    error: false,
    data: []
  }

  componentDidMount() {
    this.fetchEvents()
  }

  eventPrimaryText(e) {
    return <>
      {e.added} tracks added
    </>
  }

  eventSecondaryText(e) {
    return <>
      <a href={`/${e.host === "yt" ? "youtube" : "discogs"}/${e.entity_id}/${slugify(e.entity_name)}/`}>
        {e.entity_name}
      </a>
    </>
  }

  eventAgo(e) {
    return <Moment fromNow unix>{e.timestamp}</Moment>
  }

  eventColor(e) {
    return e.host === "yt" ? "secondary" : "primary"
  }

  render() {
    // Group events by entity
    this.state.data = Object.values(this.state.data.reduce((eventsSoFar, event) => {
      let id = event["spotify_playlist"]
      if (!eventsSoFar[id]) {
        eventsSoFar[id] = event;
      } else {
        eventsSoFar[id].added += event.added;
      }
      return eventsSoFar;
    }, {}));

    return (
      <Timeline>
        {this.state.data.map((e, index) => (
          <TimelineItem index={index}>
            <TimelineOppositeContent>
              <Typography color="textSecondary">{this.eventAgo(e)}</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color={this.eventColor(e)} />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <>
                <Typography>
                  {this.eventPrimaryText(e)}
                </Typography>
                <Typography><small>{this.eventSecondaryText(e)}</small></Typography>
              </>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    )
  }

  // This data is fetched at run time on the client.
  fetchEvents = () => {
    axios
      .get(process.env['GATSBY_API_URL'] + 'events')
      .then(({ data }) => {
        this.setState({
          loading: false,
          data
        })
      })
      .catch(error => {
        this.setState({ loading: false, error })
      })
  }
}

export default LogsDrawer