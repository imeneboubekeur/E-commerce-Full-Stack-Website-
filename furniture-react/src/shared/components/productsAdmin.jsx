import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { UpBar } from "./dashboard";
import { Card } from "./dashboard";
import Furnitures from "./furnitures";
import { CircleCheck,CircleX,TriangleAlert,Package2  } from 'lucide-react';
export default function ProductsAdmin(){
    const { stats, productStats } = useSelector((state) => state.dashboard);
    if (!productStats) return <div>Loading...</div>;
    return(

        <div className="main">
    <UpBar title={"Product Management"} />
    <div className="cardContainer">
        <Card title={"Total Products"} value={productStats.total_products} Icon={Package2 } color="#593838"  />
        <Card title={"In Stock"} value={productStats?.in_stock} Icon={CircleCheck} color="#16a34a" filled />
        <Card title={"Low Stock"} value={productStats?.low_stock} Icon={CircleX} color="#ca8a04" filled />
        <Card title={"Out of Stock"} value={productStats?.out_of_stock} Icon={TriangleAlert} color="#dc2626" filled />
    </div>
    <Furnitures extra={false} layout={false} />
</div>

    )
}