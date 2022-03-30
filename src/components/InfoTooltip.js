import React from "react";

function InfoToolTip(props) {
  const { toolTipMessage } = props;

  return (
    <div
      className={props.isOpen
        ? `pop-up popup_type_${props.name} pop-up_opened`
        : `pop-up popup_type_${props.name}`}
    >
      <div className="pop-up__overlay" onClick={props.onClose}></div>
      <div className="pop-up__content">
        <img className="pop-up__tooltipImg"
          alt={toolTipMessage.message}
          src={toolTipMessage.img}
        ></img>
        <button
          className="pop-up__close-icon"
          type="button"
          onClick={props.onClose}
        ></button>
        <h2
          className="pop-up__title"
        >
          {toolTipMessage.message}
        </h2>
      </div>
    </div>
  );
}

export default InfoToolTip;