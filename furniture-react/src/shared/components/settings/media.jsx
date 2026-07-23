import React, { useEffect, useState } from 'react';
import { settingsAPI } from '../../services/api.js';

export function MediaSettings() {
  const [cloudinary, setCloudinary] = useState(null);

  useEffect(() => {
    settingsAPI.get('media')
      .then(d => setCloudinary(d[0].value));
  }, []);

  if (!cloudinary) return <p>Loading...</p>;

  return (
    <>
      <h2>Media Settings</h2>

      <label>
        Cloud Name:
        <input
          type="text"
          value={cloudinary.cloudName}
          onChange={(e) =>
            setCloudinary({
              ...cloudinary,
              cloudName: e.target.value
            })
          }
        />
      </label>

      <label>
        Upload Preset:
        <input
          type="text"
          value={cloudinary.uploadPreset}
          onChange={(e) =>
            setCloudinary({
              ...cloudinary,
              uploadPreset: e.target.value
            })
          }
        />
      </label>

      <label>
        Max Size (MB):
        <input
          type="number"
          value={cloudinary.maxSizeMB}
          onChange={(e) =>
            setCloudinary({
              ...cloudinary,
              maxSizeMB: Number(e.target.value)
            })
          }
        />
      </label>

      <label>
        Allowed Formats (comma separated):
        <input
          type="text"
          value={cloudinary.formats.join(',')}
          onChange={(e) =>
            setCloudinary({
              ...cloudinary,
              formats: e.target.value.split(',')
            })
          }
        />
      </label>

      <button onClick={() =>
        settingsAPI.update('media', cloudinary)
      }>
        Save
      </button>
    </>
  );
}
