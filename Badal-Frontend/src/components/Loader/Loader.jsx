import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from "./Loader.module.scss";

const Loader = () => {
    const [ loading, setLoading ] = useState(false);
    const allStates = useSelector(state => state);

    useEffect(() => {
        let status = false;
        for(let key in allStates){
            if(allStates[key].loading){
                status = true;
                break;
            }
        }
        setLoading(status);
    }, [allStates]);

    if (!loading) {
        return <></>;
    }
    else{
        return (
            <div className={styles.loader}>
                <div className={styles.loader__container}>
                    {/* <i className="pi pi-spin pi-spinner"></i> */}
                    <div className={styles.loader__container__spinner}>
                        <div className={styles.loader__container__spinner_second}></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Loader;