import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { faPen, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DEFAULT_ICON } from '../../constants';

/**
 *
 * This component is a generic item with a edit/delete icon
 * By default the icons are disabled, and must be explicilty rendered with the enable prop
 * By default the edit click  will display an input and a submit button, the submit function can be passed as props
 * If the behaviour of the edit were to change
 */
const ItemWithActions = (props) => {
  const [showEditInput, setshowEditInput] = useState(false);
  const [editInputValue, seteditInputValue] = useState('');
  const {
    enableEdit = false,
    enableDelete = false,
    text = '',
    onEditClick = null,
    onSubmitEdit = (value) => {},
    onDeleteClick = () => {},
    leftIcon = null,
  } = props;

  const onEditInputChange = (e) => seteditInputValue(e.target.value);

  const toggleShowEditInput = () => setshowEditInput(!showEditInput);

  const editClick = () => {
    if (onEditClick) return onEditClick();
    return toggleShowEditInput();
  };

  return (
    <div>
      {leftIcon && (
        <div>
          <FontAwesomeIcon
            icon={DEFAULT_ICON.icon}
            color={DEFAULT_ICON.color}
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
      {showEditInput && (
        <div>
          <input onChange={onEditInputChange} value={editInputValue} />
          <button onSubmit={() => onSubmitEdit(editInputValue)}>Submit</button>
        </div>
      )}
    </div>
  );
};

ItemWithActions.propTypes = {
  enableEdit: PropTypes.bool,
  enableDelete: PropTypes.bool,
  text: PropTypes.string.isRequired,
  onEditClick: PropTypes.func,
  onSubmitEdit: PropTypes.func,
  onDeleteClick: PropTypes.func,
  leftIcon: PropTypes.string,
};

export default ItemWithActions;
