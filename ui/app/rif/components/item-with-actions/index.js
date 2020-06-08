import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { faPen, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 *
 * This component is a generic item with a edit/delete icon
 * By default the icons are disabled, and must be explicitly rendered with the enable prop
 * By default the edit click will render the children that are passed to it
 */
class ItemWithActions extends Component {

  static propTypes = {
    enableEdit: PropTypes.bool,
    enableDelete: PropTypes.bool,
    text: PropTypes.string.isRequired,
    onEditClick: PropTypes.func,
    onDeleteClick: PropTypes.func,
    leftIcon: PropTypes.shape({icon: PropTypes.string, color: PropTypes.string }),
    leftContent: PropTypes.element,
    children: PropTypes.element,
  }

  constructor (props) {
    super(props);
    this.state = {
      showEditChildren: false,
    }
  }

  toggleShowEditChildren = () => this.setState({showEditChildren: !this.state.showEditChildren});

   onEditClick = () => {
     const {onEditClick} = this.props;
     if (onEditClick) onEditClick();
     this.toggleShowEditChildren();
    };

   render = () => {
      const {leftIcon, leftContent, text, enableEdit, enableDelete, children, onDeleteClick} = this.props;
      const {showEditChildren } = this.state;
      return (
       <div>
         {leftIcon && (
           <div>
             <FontAwesomeIcon
               icon={leftIcon.icon}
               color={leftIcon.color}
               className={''}
             />
           </div>
         )}
         {leftContent && <div>{leftContent}</div>}
         <div>
           <p>{text}</p>
         </div>
         <div className={''}>
           {enableEdit && (
             <FontAwesomeIcon icon={faPen} className={''} onClick={this.onEditClick} />
           )}
           {enableDelete && (
             <FontAwesomeIcon
               icon={faTimes}
               className={''}
               onClick={onDeleteClick}
             />
           )}
         </div>
         {showEditChildren && children && (
           children
         )}
       </div>
     );
   }

}

export default ItemWithActions;
