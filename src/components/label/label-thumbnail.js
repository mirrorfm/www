import PropTypes from "prop-types"
import React from "react"
import { LazyLoadImage } from "react-lazy-load-image-component";
import {useTheme, withStyles} from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import { Link } from 'gatsby'
import slugify from 'react-slugify';
import Moment from 'react-moment';

import { StaticImage } from "gatsby-plugin-image"
import whiteBg from "../../images/white-bg.png";

const styles = theme => ({
  root: {
    columnGap: 20,
    marginLeft: 0,
    listStyleType: `none`,
    [useTheme().breakpoints.up('lg')]: {
      columns: 6,
    },
    [useTheme().breakpoints.down('md')]: {
      columns: 5,
    },
    [useTheme().breakpoints.down('sm')]: {
      columns: 4,
    },
    [useTheme().breakpoints.down('xs')]: {
      columns: 2,
    },
  },
});

let touched = false

class Thumbnail extends React.Component {
  static propTypes = {
    label: PropTypes.shape({
      label_id: PropTypes.string.isRequired,
    }).isRequired
  }

  constructor() {
    super()
    this.state = {
      hovering: false,
    }
  }

  render() {
    const { label, category, selectedGenresArr } = this.props

    let sortDiv;
    switch(category) {
      case "lastUpdated":
        sortDiv = (
          <div>Updated <Moment fromNow>{label.last_found_time}</Moment></div>
        )
        break;
      case "mostFollowed":
        sortDiv = (
          <div>{label.count_followers} followers</div>
        )
        break;
      case "mostUploads":
        sortDiv = (
          <div>{label.count_tracks} YouTube uploads</div>
        )
        break;
      case "rarestUploads":
        sortDiv = (
          <div>{(label.found_tracks * 100 / label.count_tracks).toFixed(2)}% found</div>
        )
        break;
      case "lastTerminated":
        sortDiv = (
          <div>Terminated <Moment fromNow>{label.terminated_datetime.Time}</Moment></div>
        )
        break;
      case "recentlyAdded":
        sortDiv = (
          <div>Submitted <Moment fromNow>{label.added_datetime.Time}</Moment></div>
        )
        break;
    }

    const labelName = label.label_name || label.label.label_name;
    const thumbnail = label.thumbnail_medium.Valid ? label.thumbnail_medium.String : undefined;
    let genres = label.genres || (label.label ? label.label.genres : []) || [];
    genres = genres.slice(0, 6);

    return (
      <div className="container">
        <div style={{height: `100%`, width: `100%`}}>
          <Link
            data-testid="label"
            to={`/discogs/${label.label_id}/${slugify(labelName)}/`}
            state={{
              modal: true,
              labels: this.props.labels,
              label
            }}
            onTouchStart={() => (touched = true)}
            onMouseEnter={() => {
              if (!touched) {
                this.setState({hovering: true})
              }
            }}
            onMouseLeave={() => {
              if (!touched) {
                this.setState({hovering: false})
              }
            }}
            css={{
              display: `block`,
              flex: `1 0 0%`,
              width: `100%`,
              maxWidth: 290.1,
              position: `relative`,
              ":last-child": {
                marginRight: 0,
              }
            }}
            style={{
              textDecoration: `none`
            }}
          >
            <div className="label">
              { thumbnail ?
                <LazyLoadImage
                  alt={labelName}
                  height="240"
                  src={thumbnail}
                  width="240"
                /> :
                <StaticImage
                  alt={labelName}
                  height="240"
                  src={'../../images/white-bg.png'}
                  width="240"
                />
              }
            </div>
            <div style={{
              paddingTop: `5px`,
              fontWeight: 700,
              fontSize: 15,
              display: `block`,
              whiteSpace: `nowrap`,
              overflow: `hidden`,
              textOverflow: `ellipsis`
            }}>
              <StaticImage
                width="20"
                height="20"
                alt="Discogs logo"
                src={'../../images/dg-logo.png'} /> {labelName}
            </div>
          </Link>
        </div>
        <div style={{ fontFamily: `Arial`, fontVariant: `small-caps`, textTransform: `uppercase`, fontSize: 12 }}>{sortDiv}</div>
        <div style={{ height: `140px` }}>
          {genres.map((g) =>
            <Chip
              key={g.name}
              size="small"
              label={g.name}
              className={selectedGenresArr.includes(g.name) ? "chip-mui-selected" : "chip-mui"}
            />
          )}
        </div>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Thumbnail);
