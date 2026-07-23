import React,{ useEffect, useState } from 'react';
import { settingsAPI } from '../../services/api.js';

export function PaymentSettings() {
  const [stripe, setStripe] = useState({enabled: false});
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);


  useEffect(() => {
    settingsAPI.get('payment').then(d =>{ 
        setStripe(d[0].value)});
  }, []);
if (!mounted) return null;
  return (
    <>
      <h2>Payment</h2>

      <label>
        <input
          type="checkbox"
          checked={stripe.enabled}
          onChange={(e) =>
            setStripe({ ...stripe, enabled: e.target.checked })
          }
        />
        Enable Stripe
      </label>

      <button onClick={() =>
        settingsAPI.update('payment', stripe)
      }>
        Save
      </button>
    </>
  );
}
