import { useOutletContext } from "react-router-dom";
import TopBar from "../TopBar/TopBar";



const Data = () => {
    const title = useOutletContext();
    const dataTabs = [
        { name: "Overview", path: "overview" },
        { name: "Details", path: "details" },
    ];
    return (
        <>
            <TopBar title={title} tabs={dataTabs}/>
            <h1>Data</h1>
        </>
    );
}

export default Data;