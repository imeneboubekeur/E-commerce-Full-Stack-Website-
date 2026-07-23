import React,{ useEffect, useState } from 'react';
import { settingsAPI } from '../../services/api.js';

export function ShippingSettings() {
  const [shipping, setShipping] = useState(null);

  useEffect(() => {
    settingsAPI.get('shipping')
      .then(d => 
        setShipping(d[0].value)
    );
  }, []);

  if (!shipping) return <p>Loading...</p>;

  return (
    <>
      <h2>Shipping Settings</h2>

      <label>
        Flat Rate:
        <input
          type="number"
          value={shipping.flatRate}
          onChange={(e) =>
            setShipping({
              ...shipping,
              flatRate: Number(e.target.value)
            })
          }
        />
      </label>

      <label>
        Free Shipping Over:
        <input
          type="number"
          value={shipping.freeShippingOver}
          onChange={(e) =>
            setShipping({
              ...shipping,
              freeShippingOver: Number(e.target.value)
            })
          }
        />
      </label>

      <label>
        Delivery Time Text:
        <input
          type="text"
          value={shipping.deliveryTime}
          onChange={(e) =>
            setShipping({
              ...shipping,
              deliveryTime: e.target.value
            })
          }
        />
      </label>

      <button onClick={() =>
        settingsAPI.update('shipping', shipping)
      }>
        Save
      </button>
    </>
  );
}
