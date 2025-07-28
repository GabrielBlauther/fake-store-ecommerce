import { useState, useEffect } from 'react';
import { fetchProductReviews } from '../../services/api';
import Star from '../estrela/Star';
import './Modal.css';

export default function Modal({ isOpen, setOpenModal, product }) {
    const [productRating, setProductRating] = useState({ rate: 0, count: 0 });
    const items = [1, 2, 3, 4, 5];

    const calculateRating = (reviews) => {
        if (!reviews || reviews.length === 0) return { rate: 0, count: 0 };
        
        const total = reviews.reduce((sum, review) => sum + review.rating, 0);
        return {
            rate: (total / reviews.length).toFixed(1),
            count: reviews.length
        };
    };

    useEffect(() => {
        async function loadRating() {
            if (product?._id) {
                try {
                    const reviews = await fetchProductReviews(product._id);
                    setProductRating(calculateRating(reviews));
                } catch (error) {
                    setProductRating({ rate: 0, count: 0 });
                }
            }
        }
        
        if (isOpen && product) {
            loadRating();
        }
    }, [isOpen, product]);

    if (isOpen) {
        return (
            <div className='modal-background'>
                <div className='modal-content'>
                    <div className='fechar'>
                        <button onClick={() => setOpenModal(false)}>X</button>
                    </div>
                    {product && (
                        <div className='grade-produtos'>
                            <div className='imagem-produto'>
                                <img src={product.image} alt={product.title} />
                            </div>
                            <div className='container-modal'>
                                <div className='titulo-produto'>
                                    <h3>{product.title}</h3>
                                </div>
                                <div className='avaliacoes'>
                                    <div className='estrelas-e-media'>
                                        <div className='estrelas'>
                                            <div className='estrelas-container'>
                                                {items.map((item) => (
                                                    <Star
                                                        key={item}
                                                        value={item}
                                                        rating={productRating.rate || product.rating?.rate || 0}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className='avaliacoes-media'>
                                            <p>{productRating.rate || product.rating?.rate || 0}</p>
                                        </div>
                                    </div>
                                    <div className='qntd-avaliacao'>
                                        <p>{productRating.count || product.rating?.count || 0} avaliações</p>
                                    </div>
                                </div>
                                <div className='preco-produto'>
                                    $ {product.price}
                                </div>
                                <div className='linha-divisoria-cinza'></div>
                                <div className='descricao-produto'>
                                    <p>{product.description}</p>
                                </div>
                                <div className='categoria-produto'>
                                    <p>{product.category}</p>
                                </div>
                                <div className='carrinho-modal'>
                                    <img src='Vector.png' alt='' />
                                    <a href='#'>Adicionar ao carrinho</a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
    
    return null;
}
