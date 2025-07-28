
const API_URL = process.env.REACT_APP_API_URL;

// Função auxiliar para fazer requisições autenticadas
const fetchWithAuth = async (endpoint, method, body) => {
  const token = localStorage.getItem('token');
  console.log(body);
  
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    }
    
  };
  
  if (body) {
    options.body = JSON.stringify(body); 
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, options);
  
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro na requisição: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data;

};

export const CartService = {

  getCart: async () => {
  const data = await fetchWithAuth('/cart');
  return {
      items: Array.isArray(data?.items) ? data.items : [],
      total: typeof data?.total === 'number' ? data.total : 0
  };
  },

  
  addItem: (productId, quantity) => fetchWithAuth('/cart/add', 'POST', { productId, quantity }),
  
  removeItem: (productId) => fetchWithAuth(`/cart/remove/${productId}`, 'DELETE'),
  
  updateItemQuantity: (productId, quantity) => fetchWithAuth(`/cart/update/${productId}`, 'PUT', { quantity }),
  
  clearCart: () => fetchWithAuth('/cart/clear', 'DELETE')
};

//avaliações
export const ReviewService = {
  createReview: (productId, userId, rating) => 
    fetchWithAuth('/reviews/add', 'POST', { productId, userId, rating }),
  
  getReviewsByProduct: (productId) => 
    fetchWithAuth(`/reviews/${productId}`, 'GET')
};
