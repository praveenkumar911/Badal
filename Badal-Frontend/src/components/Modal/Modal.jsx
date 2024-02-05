import React from "react";
import styles from "./Modal.module.scss";

const Modal = (props) => {

    return (
        <div className={styles.modal}>
            <div className={styles.modalContainer}>
                <div className={styles.modalHeader}></div>
                <div className={styles.modalBody}>
                    {props.children}
                </div>
            </div>
        </div>
    );
};

export default Modal;