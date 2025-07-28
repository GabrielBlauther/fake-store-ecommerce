// src/components/modal_finalizar_compra/modal_finalizar_compra.js
import "./modal_finalizar_compra.css";
import { useState } from "react";
import { CartService } from "../../services/cartService";
import { ReviewService } from "../../services/cartService";
import { Toast } from "../toast/Toast";

export default function ModalFinalizarCompra({ isOpenModal_compra, setOpenModal, cart }) {
  const [ratings, setRatings] = useState({});
  const [success, setSuccess] = useState(false);

  const handleRatingChange = (productId, value) => {
    const cleanValue = value.replace(/[^0-9.,]/g, '').replace(',', '.');
    
    if (cleanValue === '' || cleanValue === '.') {
      setRatings(prev => ({ ...prev, [productId]: cleanValue }));
      return;
    }
    
    const numValue = parseFloat(cleanValue);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 5) {
      setRatings(prev => ({ ...prev, [productId]: cleanValue }));
    }
  };

  const handleSubmit = async () => {
    // Validação básica
    const hasRatings = Object.keys(ratings).length > 0;
    if (!hasRatings) {
      Toast.warning("⚠️ Avalie pelo menos um produto para finalizar");
      return;
    }

    // Loading toast
    const loadingToast = Toast.loading("Finalizando compra...");
    
    try {
      const userId = localStorage.getItem('userId');
      
      // Salvar avaliações
      for (const [productId, rating] of Object.entries(ratings)) {
        if (rating && !isNaN(parseFloat(rating))) {
          await ReviewService.createReview(productId, userId, parseFloat(rating));
        }
      }
      
      // Limpar carrinho
      await CartService.clearCart();
      
      // Atualizar loading para sucesso
      Toast.updateLoading(loadingToast, 'success', '🛍️ Compra finalizada com sucesso!');
      
      setSuccess(true);
      
      // Fechar modal após 2 segundos
      setTimeout(() => {
        setOpenModal(false);
        setSuccess(false);
        setRatings({});
      }, 2000);
      
    } catch (error) {
      console.error("Erro:", error);
      
      // Atualizar loading para erro
      Toast.updateLoading(loadingToast, 'error', '❌ Erro ao finalizar compra');
    }
  };

  if (!isOpenModal_compra) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={() => setOpenModal(false)}>×</button>
        
        {!success ? (
          <>
            <h2>Avalie sua compra</h2>
            {cart?.items?.map(item => (
              <div key={item.productId} className="product-rating">
                <img src={item.image} alt={item.name} className="product-thumb" />
                <div>
                  <h4>{item.name}</h4>
                  <div className="rating-input">
                    <label>Digite sua nota (1-5):</label>
                    <input
                      type="text"
                      value={ratings[item.productId] || ''}
                      onChange={(e) => handleRatingChange(item.productId, e.target.value)}
                      placeholder="Ex: 4.5"
                    />
                  </div>
                </div>
              </div>
            )) || <p>Nenhum item no carrinho</p>}
            <button className="submit-btn" onClick={handleSubmit}>
              Finalizar
            </button>
          </>
        ) : (
          <div className="success">
            <h2>✓ Compra finalizada!</h2>
            <p>Obrigado pelas avaliações!</p>
          </div>
        )}
      </div>
    </div>
  );
}
