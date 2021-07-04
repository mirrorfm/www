import React from "react"

import { MdClose } from 'react-icons/md'
import { FaCaretLeft } from 'react-icons/fa'
import { FaCaretRight } from 'react-icons/fa'
import slugify from 'react-slugify';

import mousetrap from "mousetrap"
import * as PropTypes from "prop-types"
import { navigate } from "gatsby"
import {useTheme, withStyles} from "@material-ui/core/styles";

let channels
let labels
let previousSectionPathname

const styles = () => ({
  caret: {
    fontSize: `50px`,
    width: `20rem`,
    [useTheme().breakpoints.up('md')]: {
      width: `10rem`,
    },
    [useTheme().breakpoints.down('sm')]: {
      width: `2.5rem`,
    },
    [useTheme().breakpoints.down('xs')]: {
      width: `2rem`,
    },
  }
});

class Modal extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    location: PropTypes.object.isRequired,
    channels: PropTypes.array,
    labels: PropTypes.array
  }

  componentDidMount() {
    let acceptedPreviousPathnames = [
      "/labels/",
      "/channels/",
      "/"
    ]
    if (acceptedPreviousPathnames.includes(this.props.location.state.referrer)) {
      previousSectionPathname = this.props.location.state.referrer
    }

    mousetrap.bind(`left`, () => this.previous())
    mousetrap.bind(`right`, () => this.next())
    mousetrap.bind(`spacebar`, () => this.next())
  }

  componentWillUnmount() {
    mousetrap.unbind(`left`)
    mousetrap.unbind(`right`)
    mousetrap.unbind(`spacebar`)
  }

  findCurrentIndex() {
    let type = this.props.location.pathname.split(`/`)[1];
    let id = this.props.location.pathname.split(`/`)[2];

    let currentIndex;
    switch(type) {
      case "youtube":
        currentIndex = channels.findIndex(c => c.channel_id === id);
        break;
      case "discogs":
        currentIndex = labels.findIndex(l => l.label_id === id);
        break;
      default:
        break
    }

    return {
      currentIndex,
      type
    }
  }

  next(e) {
    if (e) {
      e.stopPropagation()
    }
    const { currentIndex, type } = this.findCurrentIndex()

    let entities = this.getEntities(type);

    if (currentIndex || currentIndex === 0) {
      let next
      if (currentIndex + 1 === entities.length) {
        next = entities[0]
      } else {
        next = entities[currentIndex + 1]
      }

      this.navigateEntity(type, next, entities);
    }
  }

  previous(e) {
    if (e) {
      e.stopPropagation()
    }
    const { currentIndex, type } = this.findCurrentIndex()

    let entities = this.getEntities(type);

    if (currentIndex || currentIndex === 0) {
      let previous
      if (currentIndex === 0) {
        previous = entities.slice(-1)[0]
      } else {
        previous = entities[currentIndex - 1]
      }
      this.navigateEntity(type, previous, entities);
    }
  }

  getEntities(type) {
    switch(type) {
      case "youtube":
        return channels;
      case "discogs":
        return labels;
      default:
        break;
    }
  }

  navigateEntity(type, following, entities) {
    let id, name, state;
    switch(type) {
      case "youtube":
        id = following.channel_id;
        name = following.channel_name;
        state = { modal: true, channels: entities, channel: following, label: following }
        break;
      case "discogs":
        id = following.label_id;
        name = following.label_name;
        state = { modal: true, labels: entities, channel: following, label: following }
        break;
      default:
        break
    }

    navigate(`/${type}/${id}/${slugify(name)}/`, { state })
  }

  render() {
    const { classes } = this.props;
    if (!channels || !labels) {
      channels = this.props.location.state.channels
      labels = this.props.location.state.labels
    }
    return (
      <div
        onClick={() => navigate(previousSectionPathname, {state: {noScroll: true}})}
        style={{
          display: `flex`,
          position: `relative`,
          height: `100vh`,
        }}
      >
        <div
          style={{
            margin: `0 auto`,
            display: `flex`,
            alignItems: `center`,
            justifyItems: `center`,
          }}
        >
          <FaCaretLeft
            data-testid="previous-channel"
            className={classes.caret}
            style={{
              cursor: `pointer`,
              color: `rgba(255, 255, 255, 0.7)`,
              userSelect: `none`,
              display: `flex`,
              justifyContent: `space-between`,
            }}
            onClick={e => this.previous(e)}
          />
          {this.props.children}
          <FaCaretRight
            data-testid="next-channel"
            className={classes.caret}
            style={{
              cursor: `pointer`,
              color: `white`,
              userSelect: `none`,
              display: `flex`,
              justifyContent: `space-between`,
            }}
            onClick={e => this.next(e)}
          />
        </div>
        <MdClose
          data-testid="modal-close"
          onClick={() => navigate(previousSectionPathname, {state: {noScroll: true}})}
          style={{
            cursor: `pointer`,
            color: `rgba(255,255,255,0.8)`,
            fontSize: `30px`,
            position: `absolute`,
          }}
        />
      </div>
    )
  }
}

export default withStyles(styles)(Modal);
