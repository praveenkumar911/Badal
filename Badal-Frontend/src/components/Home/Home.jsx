import { useOutletContext } from "react-router-dom";
import TopBar from "../TopBar/TopBar";



const Home = () => {
    const title = useOutletContext();
    const homeTabs = [
        { name: "Account", path: "account" },
        { name: "Dashboard", path: "dashboard" },
    ];
    return (
        <>
            <TopBar title={title} tabs={homeTabs}/>
        </>
    );
}

export default Home;