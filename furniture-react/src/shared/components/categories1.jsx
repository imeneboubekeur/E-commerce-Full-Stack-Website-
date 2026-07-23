import React, { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { categoriesAPI } from "../services/api";
import { UpBar } from "./dashboard";

export default function CategorySettings() {
    const dispatch = useDispatch();
      const { items } = useSelector((state) => state.categories);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
 const [showFilter, setShowFilter] = useState(false);
  
  const loadCategories = async () => {
    try {
      const data = await categoriesAPI.getAll();
      setCategories(data);
    } catch (err) {
      alert(err.message);
    }
  };

 
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return alert("Image must be less than 5MB");
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview("");
  };

  
  const handleCreate = async () => {
    if (!name) return alert("Category name required");

    try {
      const form = new FormData();
      form.append("name", name);

      if (image) {
        form.append("image", image);
      }

      await categoriesAPI.create(form);

      setName("");
      removeImage();
      loadCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  
  const handleDelete = async (id) => {
    if (!window.confirm("Delete category?")) return;

    try {
      await categoriesAPI.delete(id);
      loadCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  
  return (
    <>
 <div className="main">
    <UpBar title={"Category Management"} />
     {showFilter && (  
      <div className="overlay" onClick={() => setShowFilter(false)}>
      <div className="create-category"
      onClick={(e) => e.stopPropagation()}
      >
        <input
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />


        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" />
            <button type="button" onClick={removeImage}>
              <X size={16} />
            </button>
          </div>
        )}

       
        <label className="upload-box">
          <Upload size={18} /> Upload Image
          <input type="file" name="image" hidden onChange={handleImageChange} />
        </label>

        <button onClick={handleCreate}>Add Category</button>
     </div> </div>)}
     <div className="category-settings-container">
    <div className="category-settings">
      <h2>Categories</h2>
      <div className="container">
      <p>Organize your furniture collection into editorial groups for seamless navigation and curation.</p>
      <button onClick={() => setShowFilter(true)}>+   Create New Order</button>
</div>
      <div className="tableWrapp" >
 <table >
        <thead>
          <tr >
            <th >Image</th>
            <th >Category ID</th>
            <th >Name</th>
            <th >Date</th>
            
          </tr>
        </thead>
     <tbody >    
            {items.map((item)=>(

           
<tr key={item.id}>
  <td>
    <img
              src={item.image_url || "/placeholder.png"}
              alt={item.name}
            />
  </td>
    <td>
                     {item.id}
                    </td>
                    <td>
                    {item.name}</td>
                    <td>{item.created_at}</td>
                  


                   
</tr>
        
          ))}
           </tbody>
         </table>
         </div>
      
        
     
    </div>
    </div>
    </div>
 </> );
}