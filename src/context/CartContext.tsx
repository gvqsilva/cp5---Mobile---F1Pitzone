import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  ItemCarrinho,
  Produto,
  adicionarAoCarrinho,
  alterarQuantidade,
  getCarrinho,
  limparCarrinho,
  removerDoCarrinho,
  subtotalCarrinho,
} from '../services/store';

type CartContextValue = {
  itens: ItemCarrinho[];
  carregando: boolean;
  totalItens: number;
  subtotal: number;
  adicionar: (produto: Produto, quantidade: number, cor?: string, tamanho?: string) => Promise<void>;
  alterarQtd: (itemId: string, quantidade: number) => Promise<void>;
  remover: (itemId: string) => Promise<void>;
  limpar: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    getCarrinho()
      .then(setItens)
      .finally(() => setCarregando(false));
  }, []);

  const adicionar = useCallback(async (produto: Produto, quantidade: number, cor?: string, tamanho?: string) => {
    setItens(await adicionarAoCarrinho(produto, quantidade, cor, tamanho));
  }, []);

  const alterarQtd = useCallback(async (itemId: string, quantidade: number) => {
    setItens(await alterarQuantidade(itemId, quantidade));
  }, []);

  const remover = useCallback(async (itemId: string) => {
    setItens(await removerDoCarrinho(itemId));
  }, []);

  const limpar = useCallback(async () => {
    setItens(await limparCarrinho());
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      itens,
      carregando,
      totalItens: itens.reduce((soma, i) => soma + i.quantidade, 0),
      subtotal: subtotalCarrinho(itens),
      adicionar,
      alterarQtd,
      remover,
      limpar,
    }),
    [itens, carregando, adicionar, alterarQtd, remover, limpar],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart precisa estar dentro de <CartProvider>');
  return ctx;
}
