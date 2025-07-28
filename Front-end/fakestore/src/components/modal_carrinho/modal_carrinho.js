// src/components/modal_carrinho/modal_carrinho.js
import './modal_carrinho.css';
import { useState } from 'react';
import { CartService } from '../../services/cartService';
import { Toast } from '../toast/Toast';
import ModalFinalizarCompra from '../modal_finalizar_compra/modal_finalizar_compra';

export default function ModalCarrinho({ isOpenModalCarrinho, setOpenModal, cart, refreshCart }) {
  const [error, setError] = useState(null);
  const [isFinalizarOpen, setIsFinalizarOpen] = useState(false);

  const handleUpdateQuantity = async (productId, quantity, productName) => {
    if (quantity < 1) return;
    
    try {
      await CartService.updateItemQuantity(productId, quantity);
      await refreshCart();
      setError(null);
      
      Toast.cart.updated(productName, quantity);
      
    } catch (err) {
      setError('Erro ao atualizar quantidade');
      Toast.cart.error();
    }
  };

  const handleRemoveItem = async (productId, productName) => {
    try {
      await CartService.removeItem(productId);
      await refreshCart();
      setError(null);
      
      Toast.cart.removed(productName);
      
    } catch (err) {
      setError('Erro ao remover item');
      Toast.cart.error();
    }
  };

  const handleClearCart = async () => {
    try {
      await CartService.clearCart();
      await refreshCart();
      setError(null);
      
      Toast.cart.cleared();
      
    } catch (err) {
      setError('Erro ao limpar carrinho');
      Toast.cart.error();
    }
  };

  if (!isOpenModalCarrinho) return null;

  return (
    <>
      <div className="modal-carrinho">
        <div className="modal-carrinho-container">
          <div className="modal-header">
            <h1>Carrinho</h1>
            <button onClick={() => setOpenModal(false)}>X</button>
          </div>

          {error ? (
            <p className="error">{error}</p>
          ) : cart.items.length === 0 ? (
            <p>Seu carrinho está vazio</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.items.map(item => (
                  <div key={item.productId} className="cart-item">
                    <div className="item-image">
                      <img className="image" src={item.image} alt={item.name} />
                    </div>
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <p className="price">R$ {item.price.toFixed(2)}</p>
                      <div className="quantity-controls">
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1, item.name)}
                          disabled={item.quantity <= 1}
                        >-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1, item.name)}>+</button>
                      </div>
                      <button className="remove-btn" onClick={() => handleRemoveItem(item.productId, item.name)}>Remover</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <h3>Total: R$ {cart.total.toFixed(2)}</h3>
                <div className="cart-actions">
                  <button onClick={handleClearCart}>Limpar Carrinho</button>
                  <button className="checkout-btn" onClick={() => setIsFinalizarOpen(true)}>
                    Finalizar Compra
                  </button>
                  <button className="continue-btn" onClick={() => setOpenModal(false)}>Continuar Comprando</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <ModalFinalizarCompra
        isOpenModal_compra={isFinalizarOpen}
        setOpenModal={setIsFinalizarOpen}
        cart={cart}
      />
    </>
  );
}
