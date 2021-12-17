import React from 'react'
import PropTypes from 'prop-types'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const Button = props => {

  const bg = props.backgroundColor ? 'bg-' + props.backgroundColor : 'bg-main'

  const size = props.size ? 'btn-' + props.size : ''

  const animate = props.animate ? 'btn-animate' : ''

  return (
    <button
      className={`btn ${bg} ${size} ${animate}`}
      onClick={props.onClick ? () => props.onClick() : null}
      type={`${props.type}`}
    >
      <span className="btn__txt">{props.children}</span>
      {props.icon ? (
        <span className="btn__icon">
          <FontAwesomeIcon icon={props.icon} />
        </span>
      ) : null}
    </button>
  );
}

Button.propTypes = {
  backgroundColor: PropTypes.string,
  size: PropTypes.string,
  icon: PropTypes.string,
  animate: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.string
}

export default Button
