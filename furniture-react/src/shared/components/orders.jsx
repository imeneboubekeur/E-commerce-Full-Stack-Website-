import React from "react";
import { UpBar } from "./dashboard";
import { Card } from "./dashboard";
import TableOrders from "./table"
import { useSelector } from "react-redux";
import {ShoppingCart,CircleCheck,ClockCheck,Package2} from "lucide-react"
export default function Orders(){
        const { orderStats } = useSelector((state) => state.dashboard);
if (!orderStats) return <div>Loading...</div>;
    return(
        <div className="main">
            <UpBar title={"Order Management"} />
            <div className="cardContainer">
                 <Card title={"Total Orders"} value={orderStats.total_orders}  Icon={ShoppingCart} filled color={"#593838"}/>
                        <Card title={"pending"} value={orderStats?.pending_orders} Icon={ClockCheck} color=" #ca8a04" filled/>
                        <Card title={"processing"} value={orderStats?.processing_orders} Icon={Package2} color="#2563eb" filled/>
                        <Card title={"delivered"} value={orderStats?.delivered_orders} Icon={CircleCheck} color="#16a34a" filled/>
                
            </div>
                                 <TableOrders extra={true} />

        </div>
    )
}