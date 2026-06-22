import "./App.css";
import { useState, useEffect } from "react";
import Axios from "axios";
// import "./assets/script.js";

function App() {
  const [name, setName] = useState("");

  useEffect(() => {
    if (window.initShop) {
      window.initShop();
    }
  }, []);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState(0);
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newImage, setNewImage] = useState("");

  
  const [userList, setUserList] = useState([]);

  const addUser = async () => {
    let imageValue = image;
    if (imageFile) {
      imageValue = await fileToBase64(imageFile);
    }

    Axios.post("http://localhost:3001/register", {
      name: name,
      price: price,
      description: description,
      category: category,
      image: imageValue,
    }).then(() => {
      setUserList([
        ...userList,
        {
          name: name,
          price: price,
          description: description,
          category: category,
          image: imageValue,
        },
      ]);
    });
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImage(file.name);
    }
  };

  const getUsers = () => {
    Axios.get("http://localhost:3001/users").then((response) => {
      setUserList(response.data);
    });
  };

  const updateName = (ID) => {
    Axios.put("http://localhost:3001/update", {
      name: newName,
      price: newPrice,
      description: newDescription,
      category: newCategory,
      image: newImage,
      ID: ID,
    }).then((response) => {
      setUserList(
        userList.map((val) => {
          return val.ID === ID
            ? {
                ID: val.ID,
                name: newName,
                price: newPrice,
                description: newDescription,
                category: newCategory,
                image: newImage,
              }
            : val;
        }),
      );
    });
  };

  const deleteUser = (ID) => {
    Axios.delete(`http://localhost:3001/delete/${ID}`).then((response) => {
      setUserList(
        userList.filter((val) => {
          return val.ID !== ID;
        }),
      );
    });
  };

  return (
    <div className="App">
      <div className="app-container">
        {/* <!-- Sidebar --> */}
        <aside className="sidebar">
          <div className="sidebarHeader">
            <div className="logo">Woodland Figurines</div>
            <div className="stats">
              <div className="stats-number">37</div>
              <div className="stats-label">Weekly Orders</div>
            </div>
          </div>

          <div className="sidebar-content">
            <button className="explore">
              <i className="fas fa-search"></i> Explore New
            </button>

            <div className="nav-group">
              <a href="/#" className="nav-item active">
                <i className="fas fa-fire"></i>
                Trending
              </a>

              <a href="/#" className="nav-item">
                <i className="fas fa-tshirt"></i>
                Clothing
              </a>

              <a href="/#" className="nav-item">
                <i className="fas fa-gift"></i>
                Gifts
              </a>

              <a href="/#" className="nav-item">
                <i className="fas fa-lightbulb"></i>
                Inspiration
              </a>
            </div>
          </div>

          <div className="sidebar-footer">
            <div className="recent-orders">
              <h4>Recent Orders</h4>
              <div className="order-item">
                <div className="order-dot"></div>
                <span>Al Capone Cigarillos</span>
              </div>

              <div className="order-item">
                <div className="order-dot"></div>
                <span>Wool Socks</span>
              </div>
            </div>

            <a href="/#" className="logout-btn">
              <i className="fas fa-sign-out-alt"></i>
              Log Out
            </a>
          </div>
        </aside>

        {/* <!-- Main Content --> */}
        <div className="main-content">
          <div className="header">
            <div>
              <h1 className="page-title">Explore</h1>
              <div className="filter-tabs">
                <div className="tab active" data-category="all">
                  All
                </div>
                <div className="tab" data-category="Small">
                  Small
                </div>
                <div className="tab" data-category="Big">
                  Big
                </div>
                <div className="tab" data-category="Other">
                  Other
                </div>
              </div>
            </div>

            <div className="header-actions">
              <button className="action-btn add-btn" id="addProductBtn">
                <i className="fa fa-plus"></i>
              </button>

              <button className="action-btn">
                <i className="fas fa-sliders-h"></i>
              </button>

              <button className="action-btn">
                <i className="fas fa-search"></i>
              </button>

              <button className="cart-btn" id="cartBtn">
                <i className="fas fa-shopping-cart"></i>
                <span id="cartBadge" className="cart-badge">
                  0
                </span>
              </button>

              <div className="user-profile">C</div>
            </div>
          </div>

          <div className="content-layout">
            <div className="main-section">
              <div className="promo-banner">
                <div className="promo-content">
                  <h2>Discover Unique Finds</h2>
                  <p style={{ marginBottom: "1rem", opacity: 0.8 }}>
                    Handpicked items just for you
                  </p>
                  <button className="promo-btn">Shop Now</button>
                </div>
              </div>

              <div className="secondary-banner">
                <h3>Clearance</h3>
                <p>Check out our discounted items!</p>
              </div>
            </div>

            <div className="sidebar-section" id="featuredProducts">
              <div className="loading">
                <div className="spinner"></div>
                <p>Loading featured products...</p>
              </div>
            </div>
          </div>

          <div className="products-grid" id="productsGrid">
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Checkout --> */}
      <div className="checkout-overlay" id="checkoutOverlay">
        <div className="checkout-container">
          <div className="checkout-header">
            <h2 className="checkout-title">Shopping Cart</h2>
            <button className="close-btn" id="closeCheckout">
              &times;
            </button>
          </div>

          <div className="checkout-content" id="checkoutContent">
            <div className="empty-cart">
              <i
                className="fas fa-shopping-cart"
                style={{
                  fontSize: "3rem",
                  color: "#e2e8f0",
                  marginBottom: "1rem",
                }}
              ></i>
              <p>Your cart is empty</p>
            </div>
          </div>

          <div
            className="checkout-footer"
            id="checkoutFooter"
            style={{ display: "none" }}
          >
            <div className="total-amount" id="totalAmount">
              Total: $0.00
            </div>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        </div>
      </div>

      {/* <!-- Add Product Form --> */}
      <div className="checkout-overlay" id="addProductOverlay">
        <div className="checkout-container">
          <div className="checkout-header">
            <h2 className="checkout-title">Add Product</h2>
            <button className="close-btn" id="closeAddProduct">
              &times;
            </button>
          </div>

          <div className="information">
            <label>Product name:</label>
            <input
              type="text"
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
            <label>Price:</label>
            <input
              type="number"
              step="0.01"
              onChange={(event) => {
                setPrice(event.target.value);
              }}
            />
            <label>Description:</label>
            <input
              type="text"
              onChange={(event) => {
                setDescription(event.target.value);
              }}
            />
            <label>Category:</label>
            <select
              onChange={(event) => {
                setCategory(event.target.value);
              }}
            >
              <option value="Small">Small</option>
              <option value="Big">Big</option>
              <option value="Other">Other</option>
            </select>

            <label>Image:</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {image && (
              <p style={{ color: "#f3f4f6", marginTop: "0.5rem" }}>
                Selected file: {image}
              </p>
            )}
            <button onClick={addUser} id="closeAddProductAfterSubmit">
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* <div className="information">
        <label>Name:</label>
        <input
          type="text"
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <label>Age:</label>
        <input
          type="number"
          onChange={(event) => {
            setAge(event.target.value);
          }}
        />
        <label>Country:</label>
        <input
          type="text"
          onChange={(event) => {
            setCountry(event.target.value);
          }}
        />
        <label>Email:</label>
        <input
          type="email"
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
        <label>Password:</label>
        <input
          type="password"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <button onClick={addUser}>Submit</button>
      </div> */}

      <div className="users">
        <button onClick={getUsers}>Edit Ads</button>
        {userList.map((val, key) => {
          return (
            <div className="user">
              <div>
                <img
                  src={val.image}
                  alt={val.name}
                  style={{ width: "auto", height: "200px" }}
                />
                <h3>Name: {val.name}</h3>
                <h3>Price: {val.price}</h3>
                <h3>Category: {val.category}</h3>
                <h3>Description: {val.description}</h3>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="New Name"
                  onChange={(event) => {
                    setNewName(event.target.value);
                  }}
                />
                <input
                  type="number"
                  placeholder="New Price"
                  onChange={(event) => {
                    setNewPrice(event.target.value);
                  }}
                />

                <select
                  onChange={(event) => {
                    setNewCategory(event.target.value);
                  }}
                >
                  <option value="">Select New Category</option>
                  <option value="Small">Small</option>
                  <option value="Big">Big</option>
                  <option value="Other">Other</option>
                </select>
                
                <input
                  type="text"
                  placeholder="New Description"
                  onChange={(event) => {
                    setNewDescription(event.target.value);
                  }}
                />
                

                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files[0];
                    if (file) {
                      setNewImage(file);
                    }
                  }}
                />

                <button
                  onClick={() => {
                    updateName(val.ID);
                  }}
                >
                  Update
                </button>

                <button
                  onClick={() => {
                    deleteUser(val.ID);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
        ;
      </div>
    </div>
  );
}

export default App;
