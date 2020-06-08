import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { faPen, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 *
 * This component is a generic item with a edit/delete icon
 * By default the icons are disabled, and must be explicitly rendered with the enable prop
 * By default the edit click will render the children that are passed to it
 */
const ItemWithActions = (props) => {
  const [showEditChildren, setshowEditChildren] = useState(false);
  const {
    enableEdit = false,
    enableDelete = false,
    text = '',
    onEditClick = null,
    onDeleteClick = () => {},
    leftIcon = null,
    children,
  } = props;


  const toggleShowEditChildren = () => setshowEditChildren(!showEditChildren);

  const editClick = () => {
    if (onEditClick) return onEditClick();
    return toggleShowEditChildren();
  };

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
      <div>
        <p>{text}</p>
      </div>
      <div className={''}>
        {enableEdit && (
          <FontAwesomeIcon icon={faPen} className={''} onClick={editClick} />
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
};

ItemWithActions.propTypes = {
  enableEdit: PropTypes.bool,
  enableDelete: PropTypes.bool,
  text: PropTypes.string.isRequired,
  onEditClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  leftIcon: PropTypes.shape({icon: PropTypes.string, color: PropTypes.string }),
  children: PropTypes.element,
};

export default ItemWithActions;
