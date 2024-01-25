import React from "react";
import TopBar from "../TopBar/TopBar";



const Tools = () => {
    const dataTabs = [
        { name: "Tab 1", path: "tools-tab-1" },
        { name: "Tab 2", path: "tools-tab-2" },
    ];
    return (
        <>
            <TopBar tabs={dataTabs}/>
        </>
    );
}

export default Tools;