import React from "react"

import Path from "./path"
import {Welcome} from "../components/Welcome.js"
import {Main} from "../components/Main"
import Transactions from "../components/Transactions"
import Proposals from "../components/Proposals"
import ERC20Interaction from "../components/ERC20Interaction.js"
import AuctionDetails from "../components/AuctionDetails.js"
import AuctionList from "../components/AuctionList.js"
import CreateAuction from "../components/CreateAuction.js"

const routes = [
    { path: Path.WELCOME, element: <Welcome /> },
    { path: Path.MAIN, element: <Main /> },
    { path: Path.HOME, element: <Welcome /> },
    { path: Path.TRANSACTIONS, element: <Transactions /> },
    { path: Path.PROPOSALS, element: <Proposals /> },
    { path: Path.POINTS, element: <ERC20Interaction /> },
    { path: Path.AUCTIONDETAILS, element: <AuctionDetails /> },
    { path: Path.AUCTIONLIST, element: <AuctionList /> },
    { path: Path.AUCTIONCREATE, element: <CreateAuction /> },
    { path: "/auction/:auctionAddress", element: <AuctionDetails/>}

]

export default routes