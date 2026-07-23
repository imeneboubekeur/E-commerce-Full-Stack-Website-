import React, { useEffect, useState } from 'react';
import { settingsAPI } from '../../services/api.js';
import { UpBar } from '../dashboard.jsx';
export default function StoreSettings() {
  const [store, setStore] = useState(null);

  useEffect(() => {
    settingsAPI.get('store').then((data) => {
      setStore(data[0].value);
    });
  }, []);

  const save = () => {
    settingsAPI.update('store_info', store);
  };

  if (!store) return null;

  return (
  <div className="main">
    <UpBar title={"Store Settings"}/>
    <div className="store">
          <div className="storeContainer">
      
<div className="container">
  <div className="descr">
    <p style={{
      fontSize:"20px",
      fontWeight:"700",
      paddingBottom:"0.5rem",
      color:"#593838"
    }}>Store Details</p>
    <p style={{
      color:"#6B7280"
    }}>This information will be displayed on customer
      invoices and emails.
    </p>
  </div>
  <div className="fields">
  <div className="con">
  <label>Store Name</label>
      <input
        value={store.name}
        onChange={(e) => setStore({ ...store, name: e.target.value })}
      />
      </div>
        <div className="con">

        <label>Contact Email</label>
<input
        value={store.email}
        onChange={(e) => setStore({ ...store, email: e.target.value })}
      />
      </div>
        <div className="con">
 <label>Store Phone</label>
<input
        value={store.phone}
        onChange={(e) => setStore({ ...store, phone: e.target.value })}
      />
      </div>
      </div>
</div>
    
      <div className="container">
<div className="descr">
  <p style={{
      fontSize:"20px",
      fontWeight:"700",
      paddingBottom:"0.5rem",
       color:"#593838"
    }}>Localisation</p>
  <p  style={{
      color:"#6B7280"
    }}>Manage your store's currency,language,and timezone</p>
</div> 
<div className='fields'>
<div className="con">
  <label>Currency</label>
      <input
        value={store.currency}
        onChange={(e) => setStore({ ...store, currency: e.target.value })}
      />
      </div>
        <div className="con">

        <label>Timezone</label>
<input
        value={store.timezone}
        onChange={(e) => setStore({ ...store, timezone: e.target.value })}
      />
      </div>
        <div className="con">
 <label>Currency</label>
<input
        value={store.currency}
        onChange={(e) => setStore({ ...store, currency: e.target.value })}
      />
      </div>
</div>
      </div>
       <button onClick={save}>Save</button>
      </div>
    </div>
    </div>
  );
}
