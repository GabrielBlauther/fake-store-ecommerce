import "./Estilos.css";
import {useState, useEffect} from "react";
import { fetchProducts } from "../../../services/api";
import { fetchCategories } from "../../../services/api";
import { fetchProductReviews } from "../../../services/api";
import Star from '../../estrela/Star';
import Modal from '../../modal/Modal';
import { Link } from "react-router-dom"; 
import ModalCarrinho from "../../modal_carrinho/modal_carrinho";
import { CartService } from "../../../services/cartService";
import { useAuth } from "../../../context/AuthContext";
import { Toast } from "../../toast/Toast";

function Main() {
  const {user, isAuthenticated, logout } = useAuth();
  const [productRatings, setProductRatings] = useState({});
  const [isModalCarrinhoOpen, setIsModalCarrinhoOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // Número de produtos por página
  const [cart, setCart] = useState({ items: [], total: 0 });

  
  const createImageCarrocel = (product) => {
    return Array(4).fill(product.image);
  };
  const handleSortChange = (e) => {
    const value = e.target.value;
    let sortedProducts = [...products];
    
    switch (value) {
      case 'price-asc':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'title-abc':
        sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-cba':
        sortedProducts.sort((a, b) => b.title.localeCompare(a.title)); // Corrigido: era a.title.localeCompare(b.title)
        break;
      default:
        // Não faz nada - mantém ordem original
        sortedProducts = [...products];
        break;
    }
    
    setFilteredProducts(sortedProducts);
  }
  
  const refreshCart = async () => {
    try {
      const cartData = await CartService.getCart();
      setCart(cartData);
    } catch (error) {
      console.error("Erro ao atualizar carrinho:", error);
    }
  };

  const addToCart = async(productId, quantity) => {
    console.log(productId, quantity);
    
    try {
      await refreshCart();
      await CartService.addItem(productId,quantity);
      await refreshCart();
      Toast.cart.added(productId?.title || 'Produto');
    }catch(error){
      console.error("Erro ao adicionar ao carrinho:", error);
      Toast.cart.error();
    }
  }
    const handleLogout = () => {
    logout();
    Toast.auth.logout();
  };

  const increaseQuantity = (productId) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: (prev[productId] || 1) + 1
    }));
  };

  const decreaseQuantity = (productId) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max((prev[productId] || 1) - 1, 1)
    }));
  };
const items = [1, 2, 3, 4, 5];

  // Função para calcular média das avaliações
  const calculateRating = (reviews) => {
    if (!reviews || reviews.length === 0) return { rate: 0, count: 0 };
    
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return {
      rate: (total / reviews.length).toFixed(1),
      count: reviews.length
    };
  };

  // Filtro de produtos com base na pesquisa e categoria
  useEffect(() => {
    if (products.length > 0) {
      let result = [...products];
      
      // Filtro de pesquisa
      if (searchTerm) {
        result = result.filter(product => 
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Filtro das categorias
      if (selectedCategory) {
        result = result.filter(product => 
          product.category === selectedCategory
        );
      }
      
      setFilteredProducts(result);
      setCurrentPage(1); // Resetar para a primeira página quando os filtros mudam
    }
  }, [searchTerm, selectedCategory, products]);

  // Carregar produtos e pegar categorias únicas
  useEffect(() => {
    async function loadProducts() { 
      try {
        const data = await fetchProducts();
        setProducts(data);
        setFilteredProducts(data);
        
        // Pegar as categorias únicas
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    }
    loadProducts();
 
  }, []);   

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function loadRatings() {
      const ratings = {};
      for (const product of products) {
        try {
          const reviews = await fetchProductReviews(product._id);
          ratings[product._id] = calculateRating(reviews);
        } catch (error) {
          ratings[product._id] = { rate: 0, count: 0 };
        }
      }
      setProductRatings(ratings);
    }
    
    if (products.length > 0) {
      loadRatings();
    }
  }, [products]);  
    // Adicione esta função no Main.js
  const decodeJWT = (token) => {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (error) {
      return null;
    }
  };

  return (
    <div>
      <div className="header-background">
        <div className="header">
          <div className="logo">
            <img src="logo-bearByteint.svg" alt="logo bear byte" />
          </div>
            <div className="nav-links">
              <button 
                className="nav-button" 
                onClick={() => Toast.info("ℹ️ Página em desenvolvimento")}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'inherit', 
                  cursor: 'pointer',
                  fontSize: 'inherit',
                  fontFamily: 'inherit'
                }}
            >
              SOBRE NÓS
            </button>
            {isAuthenticated ? (
              <div className="user-info">
                <span>Olá, {decodeJWT(user?.token)?.name || 'Usuário'}</span>
                <button onClick={handleLogout}>Sair</button>
              </div>
            ) : (
              <Link to="/login">CONTA</Link>
            )}
          </div>
          <div className="cart">
            <img src="Frame 123474.png" alt="logo carrinho"
            onClick={() => {
              setIsModalCarrinhoOpen(true);
              setSelectedProduct(products);}} />
          </div>
        </div>
        <div className="divisoria"></div>
        <div className="searchContainer" >
          <div className="search-wrapper">
            <input 
              type="text" 
              placeholder="Search" 
              className="search" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <img src="Arrow - Down 2.png" alt="Lupa" className="search-icon" />
          </div>
          <select 
            className="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Category</option>
            {Array.isArray(categories) && categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
          <select className="sort" onChange={handleSortChange}>
            <option>SortBy</option>
            <option value="price-asc">Preço: Menor para o Maior</option>
            <option value="price-dec">Preço: Maior para o Menor</option>
            <option value="title-abc">Nome: A - Z </option>
            <option value="title-cba">Nome: Z - A </option>
          </select>
        </div>
      </div>
      <div className="Barra-produtos">
        <div className="Products">
          <p>Products</p>
        </div>
        <div className="Barras">
          <div className="linha-azul"> 
          </div>
          <div className="linha-cinza">
          </div>
        </div>
      </div>
      <div className="Galeria">
          <div className="produtos">
            {filteredProducts
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((product) => (

            <div key={product._id} className="product-card">
              <div className="container-imagens">
                <div 
                  className="imagens" 
                  onClick={() => {
                    setIsModalOpen(true);
                    setSelectedProduct(product);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <img src={product.image} alt={product.title} />
                </div>
                <div className="carrocel">
                  <div className="carrocel-imagens">
                    {createImageCarrocel(product).map((_, index) => (
                      <button 
                        key={index}
                        className={`carrocel-btn ${currentImageIndex[product._id] === index ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(prev => ({
                          ...prev,
                          [product._id]: index
                        }))}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          padding: 0,
                          cursor: 'pointer'
                        }}
                      >
                        <img src={product.image} alt={`Imagem ${index + 1}`} />
                      </button>
                    ))}
                  </div>
                </div>
</div>
              <div className="especificacoes">
              <div className="titulo"><p>{product.title}</p></div>
              <div className="categoria"><p>{product.category}</p></div>
                <div className="avaliacoes">
                  <div className="estrelas">
                    <div className="estrelas-container">
                      {items.map((item) => (
                        <Star
                          key={item}
                          value={item}
                          rating={productRatings[product._id]?.rate || product.rating?.rate || 0}  
                        />
                      ))}
                    </div>
                  </div>
                    <div className="avaliacoes-media">
                      <p>{productRatings[product._id]?.rate || product.rating?.rate || 0}</p>
                    </div>
                    <div className="qntd-avaliacao">
                      <p>{productRatings[product._id]?.count || product.rating?.count || 0} avaliações</p>
                    </div>
                </div>

              <div className="divisoria-produtos"></div>
              <div className="preco"><p>${product.price}</p></div>
            </div>
            <div></div>
            <div className="qntd-carrinho">
              <div className="quantidade">
                  <div className="container-qntd">
                    <button className="quantidade-btn" onClick={() => decreaseQuantity(product._id)}>-</button>
                    <span className="quantidade-display">{quantities[product._id] || 1}</span>
                    <button className="quantidade-btn" onClick={() => increaseQuantity(product._id)}>+</button>
                  </div>
                </div>
              <div className="carrinho">
                <img src="Vector.png" alt="" />
                  <button className="carrinho" onClick={() => {
                    addToCart(product._id, quantities[product._id] || 1);
                    setIsModalCarrinhoOpen(true);
                    setSelectedProduct(products);
                  }}>
                  Adicionar ao carrinho
                </button>
              </div>
            </div>
            </div>
            
            ))}
      </div>  
      </div>
      
        <div className="paginacao">
          <button 
            id="prevBtn" 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >&lt;</button>
          
          {Array.from({ length: Math.ceil(filteredProducts.length / itemsPerPage) }, (_, i) => (
            <button 
              key={i + 1}
              className={currentPage === i + 1 ? 'active' : ''}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          
          <button 
            id="nextBtn" 
            onClick={() => setCurrentPage(prev => 
              Math.min(prev + 1, Math.ceil(filteredProducts.length / itemsPerPage))
            )}
            disabled={currentPage === Math.ceil(filteredProducts.length / itemsPerPage)}
          >&gt;</button>
      </div>
      <div className="footer">
        <div className="txt-footer">
          <p>© 2022 All rights reserved. Reliance Retail Ltd.</p>
        </div>
      </div>
      <Modal isOpen={isModalOpen} setOpenModal={setIsModalOpen} product={selectedProduct}/>
      <ModalCarrinho 
        isOpenModalCarrinho={isModalCarrinhoOpen} 
        setOpenModal={setIsModalCarrinhoOpen}
        cart={cart}
        refreshCart={refreshCart}
      />
  </div>
  );
}
export default Main;