import TableOrders from "./table"
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { adminAPI,authAPI } from '../services/api';
import { SideBar } from "./admin";
import { fetchDashboardStats } from '../slices/dashboardSlice';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { CheckCircle, AlertTriangle, XCircle,ShoppingCart,DollarSign,
  Armchair, UserPlus,LayoutDashboard,Users,Handbag,ShieldHalf,
      Settings ,ChartBarStacked,ChartLine,Bell,Mail,Menu,X    
 } from "lucide-react"; 

export function UpBar({title}){
    const dispatch = useDispatch();
      const user = useSelector(state => state.auth.user);
      const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="upBar" ref={menuRef}>
      <div className="left">
    <button className="menuBtn" onClick={() => setOpen(!open)}>
      <Menu />
    </button>
    <p className="title">{title}</p>
  </div>

  <div className="right">
    <button className="iconBtn">
      <Bell />
      <span className="dot"></span>
    </button>

    <button className="iconBtn">
      <Mail />
    </button>
  </div>
      

      
        <div  className={`sideBar dropdown ${open ? "slide-in" : "slide-out"}`}>
    <div >
       <button style={{
        background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer"
       }} onClick={() => setOpen(!open)}>
       < X color={"white"}/>
      </button>
        </div>
        <div className="sideCon">
        <div className="menu">
            <p style={{color:"#9CA3AF",
                fontSize:"12px",
                
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
            }}>{user.name}</p>
            <p  style={{color:"#9CA3AF",
                size:"14px"
            }}>Store Manager</p>
            </div>
        </div>
</div>
  
    </div>
  );

}
export function Card({ title, value,Icon,color,filled }) {
  const bgMap = {
  "#593838": "#FDF8EA", 
  "#16a34a": "#dcfce7",
  "#ca8a04": "#fef9c3",
 "#dc2626": "#fee2e2",
 "#2563eb":" #dbeafe",
 "#16a34a":"#dcfce7",
 "#ca8a04":"#fef9c3"
};
  return (
    <div className="card">
      <div className="left">
      <h3 style={{
        color:"#878888",
        fontSize:"1rem",
        fontWeight:"300",
        margin:"0"
      }}>{title}</h3>
      <p style={{
        color:"#593838",
        fontSize:"1.7rem",
        margin:"0",
         fontWeight:"600",
      }} >{value}</p>
      </div>
      <div className="right">
 <div className="iconBox" 
 style={{
    backgroundColor: bgMap[color] , // fallback gray
  }}>
   <span className="icon">
  {Icon && (
    <Icon
      color={color === "#593838" ? "#593838" : "white"}
      fill={filled ? color : "none"}
      strokeWidth={2}
    />
  )}
</span>
  </div></div>
    </div>
  );
}
export function Cards(){
    const [timeRange, setTimeRange] = useState('week');
  const [stats, setStats] = useState({
    totalRevenue: 45230.50,
    totalOrders: 342,
    totalProducts: 128,
    totalCustomers: 1247
  });

  // Chart refs
  const revenueChartRef = useRef(null);
  const ordersChartRef = useRef(null);
  const categoryChartRef = useRef(null);
  const topProductsChartRef = useRef(null);

  // Chart instances
  const revenueChartInstance = useRef(null);
  const ordersChartInstance = useRef(null);
  const categoryChartInstance = useRef(null);
  const topProductsChartInstance = useRef(null);

 
  useEffect(() => {
  const timer = setTimeout(() => {
    if (revenueChartRef.current) createRevenueChart();
  }, 100);

  return () => clearTimeout(timer);
}, [timeRange]);
useEffect(() => {
  const timer = setTimeout(() => {
    if (ordersChartRef.current) createOrdersChart();
    if (categoryChartRef.current) createCategoryChart();
    if (topProductsChartRef.current) createTopProductsChart();
  }, 100);

  return () => clearTimeout(timer);
}, []);

  const createRevenueChart = () => {
    if (!revenueChartRef.current) return;
    
    if (revenueChartInstance.current) {
      revenueChartInstance.current.destroy();
    }

    const ctx = revenueChartRef.current.getContext('2d');
    
    const labels = timeRange === 'week' 
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

    const data = timeRange === 'week'
      ? [4200, 5100, 4800, 6200, 5900, 7200, 6800]
      : [18500, 22300, 20100, 24800];

    revenueChartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Revenue ($)',
          data: data,
          borderColor: '#593838',
          backgroundColor: 'rgba(65, 39, 39, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return '$' + context.parsed.y.toLocaleString();
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + value.toLocaleString();
              }
            }
          }
        }
      }
    });
  };

  const createOrdersChart = () => {
    if (ordersChartInstance.current) {
      ordersChartInstance.current.destroy();
    }

    const ctx = ordersChartRef.current.getContext('2d');

    ordersChartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        datasets: [{
          label: 'Orders',
          data: [45, 78, 92, 156, 23],
          backgroundColor: [
            'rgba(251, 191, 36, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(147, 51, 234, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(239, 68, 68, 0.8)'
          ],
          borderColor: [
            'rgb(251, 191, 36)',
            'rgb(59, 130, 246)',
            'rgb(147, 51, 234)',
            'rgb(34, 197, 94)',
            'rgb(239, 68, 68)'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 20
            }
          }
        }
      }
    });
  };

  const createCategoryChart = () => {
    if (categoryChartInstance.current) {
      categoryChartInstance.current.destroy();
    }

    const ctx = categoryChartRef.current.getContext('2d');

    categoryChartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Furniture', 'Lighting', 'Decor', 'Bedding', 'Storage'],
        datasets: [{
          data: [35, 25, 20, 12, 8],
          backgroundColor: [
            '#593838',
            '#593838db',
            '#5938389b',
            '#59383878',
            '#59383841'
          ],
          borderColor: '#fff',
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.label + ': ' + context.parsed + '%';
              }
            }
          }
        }
      }
    });
  };

  const createTopProductsChart = () => {
    if (topProductsChartInstance.current) {
      topProductsChartInstance.current.destroy();
    }

    const ctx = topProductsChartRef.current.getContext('2d');

    topProductsChartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Modern Sofa', 'Oak Table', 'LED Lamp', 'Ergonomic Chair', 'Bookshelf'],
        datasets: [{
          label: 'Units Sold',
          data: [145, 132, 128, 115, 98],
          backgroundColor: '#593838',
          borderColor: '#593838a4',
          borderWidth: 2
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            beginAtZero: true
          }
        }
      }
    });
  };
    return(
        <>
        <div className="upCards">
            <div className="first">
                 <div >
          <div className="revenue" >
            <div className="cont" >
              <p style={{
        color:"#593838",
        fontSize:"1.5rem",
        margin:"0",
         fontWeight:"600",
      }}>Revenue Overview</p>
              <select className="select"
              style={{color:"#593838"}}
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            <div style={{ height: '300px' }}>
              <canvas ref={revenueChartRef}></canvas>
            </div>
          </div>

          
        </div>

            </div>
            <div className="second">
              <div className="category" >
             <p 
             style={{
        color:"#593838",
        fontSize:"1.5rem",
        margin:"0",
         fontWeight:"600",}}
             > Categories</p>
               <div style={{ height: '300px' }}>
              <canvas ref={categoryChartRef}></canvas>
            </div>
            </div>
            </div>
        </div>
         <div className="bottomCards">
            <div className="first">
              <div className="products">
              <p
            style={{
        color:"#593838",
        fontSize:"1.5rem",
        margin:"0",
         fontWeight:"600",}}
            >Top Products</p>
           
               <div style={{ height: '300px' }}>
              <canvas ref={topProductsChartRef}></canvas>
               </div>
                </div>
            </div>
            <div className="second">
              <div className="orders">
              <p
            style={{
        color:"#593838",
        fontSize:"1.5rem",
        margin:"0",
         fontWeight:"600",}}
            >Order status distribution</p>
           
              <div style={{ height: '300px' }}>
              <canvas ref={ordersChartRef}></canvas>
               </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default function Dashboard(){
   const dispatch = useDispatch();
  const {stats,loading} = useSelector((state) => state.dashboard);
  useEffect(() => {
    adminAPI.getDashboardStats()
    .then(()=>{
       dispatch(fetchDashboardStats());
    })
   
  }, [dispatch]);

  if (loading || !stats) return <div>Loading dashboard...</div>;

  return (
    <div className="main">
      <UpBar title={"Dashboard Overview"} />
      <div className="cardContainer">
        <Card title="Total Orders" value={stats.total_orders} Icon={ShoppingCart} filled color={"#593838"}/>
        <Card title="Total Revenue" value={`$${stats.total_revenue}`} Icon={DollarSign}  color={"#593838"}  />
        
        
        <Card title="Active Products" value={500} Icon={Armchair} filled color={"#593838"} />
        <Card title="New Customers" value={stats.new_customers} Icon={ UserPlus} filled color={"#593838"} />
      
      </div>

      <Cards />
      <TableOrders extra={true} />
    </div>
  );
}
