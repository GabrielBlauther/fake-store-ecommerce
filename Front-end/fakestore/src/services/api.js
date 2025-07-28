
const API_URL = process.env.REACT_APP_API_URL;


export const fetchProducts = async () => {
  const response = await fetch(`${API_URL}/products`);
  return response.json();
};

export const fetchProductById = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`);
  return response.json();
};

export const fetchCategories = async () => {
  const response = await fetch(`${API_URL}/products/categories`);
  return response.json();
};

export const fetchProductsByCategory = async (category) => {
  const response = await fetch(`${API_URL}/products/category/${category}`);
  return response.json();
};

export const loginUser = async (email,password) => {
  const response = await fetch (`${API_URL}/users/login`, {//usamos a api_url que contem o endereço do back-end e o /login para direcionar
    method: "POST",//mandamos a requisição ao back-end dizendo o metodo: POST
    headers: {"Content-Type": "application/json"},// Mandamos o headers para mandar o conteudo em json
    body: JSON.stringify({email, password})// o conteudo que queremos enviar 
  });

  const data = await response.json();

  if(!response.ok){
    throw new Error(data.message || "Erro ao fazer login");
  }
  
  return data;

};

export const registerUser = async (name,email,password,confirmPassword,phone) =>{
  const response = await fetch (`${API_URL}/users/register`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({name, email, password, confirmPassword, phone})
  });
  const data = await response.json();

  if(!response.ok){
    throw new Error(data.message || "Erro ao fazer cadastro");
  }

  return data;
}

export const fetchProductReviews = async (productId) => {
  const response = await fetch(`${API_URL}/reviews/product/${productId}`);
  return response.json();
};
