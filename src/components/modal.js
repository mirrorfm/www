import React from "react"

import { MdClose } from 'react-icons/md'
import { FaCaretLeft } from 'react-icons/fa'
import { FaCaretRight } from 'react-icons/fa'

import mousetrap from "mousetrap"
import * as PropTypes from "prop-types"
import { navigate } from "gatsby"
import {useTheme, withStyles} from "@material-ui/core/styles";

let channels

const styles = theme => ({
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
    channels: PropTypes.array
  }

  componentDidMount() {
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
    let id = this.props.location.pathname.split(`/youtube/`)[1].replace(/\/$/, "")
    return channels.findIndex(c => c.channel_id === id)
  }

  next(e) {
    if (e) {
      e.stopPropagation()
    }
    const currentIndex = this.findCurrentIndex()
    if (currentIndex || currentIndex === 0) {
      let nextChannel
      if (currentIndex + 1 === channels.length) {
        nextChannel = channels[0]
      } else {
        nextChannel = channels[currentIndex + 1]
      }
      navigate(`/youtube/${nextChannel.channel_id}/`, {state: {modal: true, channels, channel: nextChannel }})
    }
  }

  previous(e) {
    if (e) {
      e.stopPropagation()
    }
    const currentIndex = this.findCurrentIndex()
    if (currentIndex || currentIndex === 0) {
      let previousChannel
      if (currentIndex === 0) {
        previousChannel = channels.slice(-1)[0]
      } else {
        previousChannel = channels[currentIndex - 1]
      }
      navigate(`/youtube/${previousChannel.channel_id}/`, {state: {modal: true, channels, channel: previousChannel }})
    }
  }

  render() {
    const { classes } = this.props;
    if (!channels) {
      channels = this.props.location.state.channels
    }
    return (
      <div
        onClick={() => navigate(`/`, {state: {noScroll: true}})}
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
          onClick={() => navigate(`/`, {state: {noScroll: true}})}
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
