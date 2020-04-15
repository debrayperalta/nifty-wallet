import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class CustomButton extends Component {
    render () {
        const { onClick, text, icon, className } = this.props
        return (
            <div id='buttonNew' className={className.button} onClick={onClick}>
                <div id='buttonBody'>
                    {icon && 
                        <FontAwesomeIcon icon={icon} className={className.icon}/>
                    }
                    <span className={className.text}>{text}</span>
                </div>
            </div>
        )
	}
}

CustomButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    icon: PropTypes.object,
    className: PropTypes.object,
}

export default CustomButton