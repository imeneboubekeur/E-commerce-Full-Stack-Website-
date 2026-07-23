import { Banner } from "./banner";
import { Footer } from "./footer";
import { Outlet } from "react-router-dom";
import React from "react";

export default function Layout(){
    return(
        <>
        <Banner/>
        <Outlet/>
        <Footer/>
        </>
    )
}