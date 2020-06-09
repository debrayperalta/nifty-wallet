import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { faPen, faTimes, faChevronRight } from '@fortawesome/free-solid-svg-icons';
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
    leftIcon: PropTypes.shape({icon: PropTypes.object, color: PropTypes.string }),
    leftContent: PropTypes.element,
    children: PropTypes.element,
    contentClasses: PropTypes.string,
    actionClasses: PropTypes.string,
    enableRightChevron: PropTypes.bool,
    onRightChevronClick: PropTypes.func,
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
      const {
        leftIcon,
        leftContent,
        text,
        enableEdit,
        enableDelete,
        children,
        onDeleteClick,
        enableRightChevron,
        onRightChevronClick,
        contentClasses = '',
        actionClasses = '',
      } = this.props;
      const {showEditChildren} = this.state;
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
         <div className={contentClasses}>
           <p>{text}</p>
         </div>
         <div className={actionClasses}>
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
           {enableRightChevron && (
             <div>
               <FontAwesomeIcon
                 icon={faChevronRight}
                 className={''}
                 onClick={onRightChevronClick}
               />
             </div>
           )
           }
         </div>
         {showEditChildren && children && (
           children
         )}
       </div>
     );
   }

}

export default ItemWithActions;
