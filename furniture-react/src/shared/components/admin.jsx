import { Outlet } from "react-router-dom";
import { Link } from 'react-router-dom';
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { authAPI } from '../services/api';
import { LayoutDashboard,Armchair,Users,Handbag,ShieldHalf,
    Settings ,ChartBarStacked,ChartLine
  } from 'lucide-react';

export function SideBar({className}){
    const dispatch = useDispatch();
          const user = useSelector(state => state.auth.user);
return(
<div className={`sideBar ${className}`}>
    <div className="logo">
    </div>
    <div className="sideCon">
    <div className="menu">
        <p style={{color:"#9CA3AF",
            fontSize:"12px",
            marginLeft:"1.5rem"
        }}>MAIN MENU</p>
        <ul>
<Link to="/admin/admin"><li><LayoutDashboard style={{ width: '2.3rem', height: '0.9rem' }}/>Dashboard</li></Link>
<Link to="/admin/products"><li><Armchair height="0.9rem" width="2.3rem"/>Products</li></Link>
<Link to="/admin/orders"><li><Handbag height="0.9rem" width="2.3rem"/>Orders</li></Link>
<Link to="/admin/customers"><li><Users height="0.9rem" width="2.3rem"/>Customers</li></Link>
<Link to="/admin/admin"><li><ChartLine style={{ width: '2.3rem', height: '0.9rem' }}/>Analytics</li></Link>
        </ul>
    </div>
<div className="settings">
        <p style={{color:"#9CA3AF",
             fontSize:"12px",
             marginLeft:"1.5rem"
        }}>SETTINGS</p>
        <ul>
<Link to="/admin/security"><li><ShieldHalf style={{ width: '2.3rem', height: '0.9rem' }}/>Security</li></Link>
<Link to="/admin/store"><li><Settings style={{ width: '2.3rem', height: '0.9rem' }} />Store</li></Link>
<Link to="/admin/categories"><li><ChartBarStacked style={{ width: '2.3rem', height: '0.9rem' }}/>Categories</li></Link>


        </ul>
    </div>
    </div>
    <div className="acc">
        <div className="image">
                          <img src={user.image_url} alt="image"/>

        </div>
        <div className="role">
        <p style={{color:"#FFFFFF",
            size:"14px"
        }}>Alex Morgan</p>
        <p  style={{color:"#9CA3AF",
            size:"14px"
        }}>Store Manager</p>
        </div>
    </div>
</div>
)
}

export default function Admin(){
return(
    <div className="admin">
<SideBar className={"none"} />
<Outlet/>
    </div>
)
}