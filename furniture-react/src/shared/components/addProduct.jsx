import React, { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { productAPI } from "../services/api";
import { categoriesAPI } from "../services/api";
import { UpBar } from "./dashboard";
const API_URL = process.env.API_URL;

export default function ProductForm({ onSuccess }) {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
  loadCategories();
}, []);

const loadCategories = async () => {
  try {
    const data = await categoriesAPI.getAll();
    setCategories(data);
  } catch (err) {
    setError(err.message);
  }
};
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    stock: "",
    sku: "",
    image: null,
    imageUrl: ""
  });

  const [imagePreview, setImagePreview] = useState("");

  
  useEffect(() => {
    if (productId) {
      fetchProduct();
      setIsEditing(true);
    }
  }, [productId]);
  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await productAPI.getById(productId);

      setFormData({
        name: data.name || "",
        description: data.description || "",
        price: data.price || "",
        category_id: data.category_id || "",
        stock: data.stock || "",
        sku: data.sku || "",
        image: null,
        imageUrl: data.image_url || ""
      });

      if (data.image_url) {
        setImagePreview(data.image_url);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return setError("Image must be less than 5MB");
    }

    setFormData(prev => ({ ...prev, image: file }));

    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      imageUrl: ""
    }));
    setImagePreview("");
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("price", formData.price);
      form.append("category_id", formData.category_id);
      form.append("stock", formData.stock);
      form.append("sku", formData.sku);

      if (formData.image) {
        form.append("image", formData.image);
      }

      const url = isEditing
        ? `${API_URL}/admin/products/${productId}`
        : `${API_URL}/admin/add-product`;

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: form
      });

      if (!res.ok) throw new Error("Failed to save product");

      setSuccess(
        isEditing
          ? "Product updated successfully!"
          : "Product created successfully!"
      );

      if (!isEditing) {
        setFormData({
          name: "",
          description: "",
          price: "",
          category_id: "",
          stock: "",
          sku: "",
          image: null,
          imageUrl: ""
        });
        setImagePreview("");
      }

      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
 //{isEditing ? "Edit Product" : "Add Product"}
 //space-y-4
  //max-w-2xl mx-auto p-6 bg-white rounded shadow
  return (
    <div className="main">
  <UpBar title={"Add Product"} />
      
    <div className="addProduct">
   
      <h2 className="text-2xl font-bold mb-6">
       Informations
      </h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-body">
<div className="left">
        <input
          name="name"
          placeholder="Product name"
          value={formData.name}
          onChange={handleChange}
          className="input"
          required
        />

        

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="input"
          required
        />

        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
          className="input"
          required
        />

        <input
          name="sku"
          placeholder="SKU"
          value={formData.sku}
          onChange={handleChange}
          className="input"
        />

       <select
  name="category_id"
  value={formData.category_id}
  onChange={handleChange}
  className="input"
  required
>
  <option value="">Select category</option>

  {categories.map(cat => (
    <option key={cat.id} value={cat.id}>
      {cat.name}
    </option>
  ))}
</select>
<textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="input"
        />
</div>
       

       
 
<label className="image-upload-area">
 

  <input type="file" hidden onChange={handleImageChange} />

  {imagePreview ? (
    <>
      <img src={imagePreview} alt="Preview" className="image-preview" />
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); removeImage(); }}
        className="remove-btn"
      >
        <X size={16} />
      </button>
    </>
  ) : (
    <div className="upload-placeholder">
      <Upload size={28} />
      <span>Upload image</span>
    </div>
  )}
</label>
</div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading
            ? "Saving..."
            : isEditing
            ? "Update Product"
            : "Create Product"}
        </button>
      </form>
    </div>
    </div>
    
  );
}