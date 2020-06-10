import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class CustomButton extends Component {
    render () {
      const {onClick, text, fontAwesomeIcon, svgIcon, className} = this.props
      return (
        <div id="buttonNew" className={className.button} onClick={onClick}>
          <div id="buttonBody">
            {fontAwesomeIcon &&
              <FontAwesomeIcon icon={fontAwesomeIcon} className={className.icon}/>
            }
            {svgIcon &&
              svgIcon
            }
            {(text && text !== '') &&
              <span className={className.text}>{text}</span>
            }
          </div>
        </div>
      )
    }
}

CustomButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string,
  fontAwesomeIcon: PropTypes.object,
  svgIcon: PropTypes.object,
  className: PropTypes.object,
}

export default CustomButton
