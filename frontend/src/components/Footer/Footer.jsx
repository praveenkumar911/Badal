import React from "react";
import './Footer.scss';

const Footer = (props) => {
    return (
        <div className="main-footer mt-2" style={{height: props.height}}>
            <div className="label">
                2023 &copy; Copyright Raj Reddy Center for Technology and Society (RCTS). All Rights Reserved
            </div>
        </div>
    );
}

export default Footer;