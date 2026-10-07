import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_CART = '@pitzone/cart';
const KEY_LAST_ORDER = '@pitzone/last-order';
const KEY_ORDERS = '@pitzone/orders';
const KEY_ADDRESSES = '@pitzone/addresses';
const KEY_FAVORITES = '@pitzone/store-favorites';

async function readJson<T>(key: string): Promise<T | null> {
  const value = await AsyncStorage.getItem(key);
  return value ? (JSON.parse(value) as T) : null;
}

async function writeJson<T>(key: string, value: T) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// ---------------------------------------------------------------------------
// Catálogo (mock — trocar pelo endpoint da loja quando o back-end tiver um)
// ---------------------------------------------------------------------------

export type CategoriaId = 'miniaturas' | 'roupas' | 'acessorios' | 'mochilas' | 'equipes';

export type Categoria = {
  id: CategoriaId;
  nome: string;
  icone: keyof typeof import('@expo/vector-icons')['Ionicons']['glyphMap'];
};

export const CATEGORIAS: Categoria[] = [
  { id: 'miniaturas', nome: 'Miniaturas', icone: 'car-sport-outline' },
  { id: 'roupas', nome: 'Roupas', icone: 'shirt-outline' },
  { id: 'acessorios', nome: 'Acessórios', icone: 'glasses-outline' },
  { id: 'mochilas', nome: 'Mochilas', icone: 'bag-handle-outline' },
  { id: 'equipes', nome: 'Equipes', icone: 'shield-outline' },
];

export type Produto = {
  id: string;
  categoria: CategoriaId;
  nome: string;
  equipe?: string;
  preco: number;
  cores?: string[]; // hex, pra bolinha de seleção de cor
  tamanhos?: string[];
  destaque?: boolean;
  imagem: string;
};

export const PRODUTOS: Produto[] = [
  // Miniaturas
  { id: 'min-mclaren-piastri', categoria: 'miniaturas', nome: 'Miniatura McLaren MCL38 #81 — Oscar Piastri', equipe: 'McLaren', preco: 297.9, imagem: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800' },
  { id: 'min-redbull-verstappen', categoria: 'miniaturas', nome: 'Miniatura Red Bull RB20 #1 — Max Verstappen', equipe: 'Red Bull Racing', preco: 297.9, imagem: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800' },
  { id: 'min-ferrari-leclerc', categoria: 'miniaturas', nome: 'Ferrari — Charles Leclerc, boneco com capacete', equipe: 'Scuderia Ferrari', preco: 319.9, imagem: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800' },
  { id: 'min-mercedes-hamilton', categoria: 'miniaturas', nome: 'Mercedes — Lewis Hamilton, boneco com capacete', equipe: 'Mercedes AMG', preco: 319.9, imagem: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800' },

  // Roupas
  {
    id: 'rou-jaqueta-ferrari',
    categoria: 'roupas',
    nome: 'Jaqueta Scuderia Ferrari 2025',
    equipe: 'Scuderia Ferrari',
    preco: 1699.0,
    cores: ['#E10600', '#111111'],
    tamanhos: ['P', 'M', 'G', 'GG'],
    destaque: true,
    imagem: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800',
  },
  {
    id: 'rou-camiseta-mclaren',
    categoria: 'roupas',
    nome: 'Camiseta McLaren Racing',
    equipe: 'McLaren',
    preco: 156.0,
    cores: ['#FF8000', '#111111'],
    tamanhos: ['P', 'M', 'G', 'GG'],
    destaque: true,
    imagem: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
  },
  {
    id: 'rou-bone-mercedes',
    categoria: 'roupas',
    nome: 'Boné Mercedes-AMG Petronas',
    equipe: 'Mercedes AMG',
    preco: 89.9,
    cores: ['#00D2BE', '#111111'],
    tamanhos: ['Único'],
    destaque: true,
    imagem: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800',
  },

  // Acessórios
  { id: 'ace-garrafa-cadillac', categoria: 'acessorios', nome: 'Garrafa Térmica Cadillac', equipe: 'Cadillac', preco: 156.0, destaque: true, imagem: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800' },
  { id: 'ace-oculos-ferrari', categoria: 'acessorios', nome: 'Óculos de Sol Scuderia Ferrari', equipe: 'Scuderia Ferrari', preco: 249.9, imagem: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800' },
  { id: 'ace-chaveiro-redbull', categoria: 'acessorios', nome: 'Chaveiro Red Bull Racing', equipe: 'Red Bull Racing', preco: 49.9, imagem: 'https://images.unsplash.com/photo-1580130732478-4e339fb6836f?w=800' },

  // Mochilas
  { id: 'moc-ferrari', categoria: 'mochilas', nome: 'Mochila Scuderia Ferrari', equipe: 'Scuderia Ferrari', preco: 359.9, cores: ['#E10600', '#111111'], imagem: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800' },
  { id: 'moc-redbull', categoria: 'mochilas', nome: 'Mochila Red Bull Racing', equipe: 'Red Bull Racing', preco: 329.9, cores: ['#1E2A78', '#E10600'], imagem: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800' },

  // Equipes (coleções)
  { id: 'equ-mclaren', categoria: 'equipes', nome: 'Coleção McLaren 2026', equipe: 'McLaren', preco: 1699.0, imagem: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800' },
  { id: 'equ-ferrari', categoria: 'equipes', nome: 'Coleção Scuderia Ferrari 2026', equipe: 'Scuderia Ferrari', preco: 1699.0, imagem: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800' },
];

export const PRODUTOS_DESTAQUE = PRODUTOS.filter((p) => p.destaque);

export function produtosPorCategoria(categoria: CategoriaId) {
  return PRODUTOS.filter((p) => p.categoria === categoria);
}

export function buscarProdutos(termo: string) {
  const alvo = termo.trim().toLowerCase();
  if (!alvo) return PRODUTOS;
  return PRODUTOS.filter((p) => p.nome.toLowerCase().includes(alvo) || p.equipe?.toLowerCase().includes(alvo));
}

export function produtoPorId(id: string) {
  return PRODUTOS.find((p) => p.id === id);
}

// ---------------------------------------------------------------------------
// Carrinho (persistido em AsyncStorage)
// ---------------------------------------------------------------------------

export type ItemCarrinho = {
  itemId: string; // produtoId + cor + tamanho, pra permitir o mesmo produto com variações diferentes
  produtoId: string;
  nome: string;
  preco: number;
  quantidade: number;
  cor?: string;
  tamanho?: string;
  imagem: string;
};

function montarItemId(produtoId: string, cor?: string, tamanho?: string) {
  return [produtoId, cor ?? '', tamanho ?? ''].join('::');
}

export async function getCarrinho(): Promise<ItemCarrinho[]> {
  return (await readJson<ItemCarrinho[]>(KEY_CART)) ?? [];
}

async function salvarCarrinho(itens: ItemCarrinho[]) {
  await writeJson(KEY_CART, itens);
  return itens;
}

export async function adicionarAoCarrinho(produto: Produto, quantidade: number, cor?: string, tamanho?: string) {
  const itens = await getCarrinho();
  const itemId = montarItemId(produto.id, cor, tamanho);
  const existente = itens.find((i) => i.itemId === itemId);

  const novosItens = existente
    ? itens.map((i) => (i.itemId === itemId ? { ...i, quantidade: i.quantidade + quantidade } : i))
    : [...itens, { itemId, produtoId: produto.id, nome: produto.nome, preco: produto.preco, quantidade, cor, tamanho, imagem: produto.imagem }];

  return salvarCarrinho(novosItens);
}

export async function alterarQuantidade(itemId: string, quantidade: number) {
  const itens = await getCarrinho();
  const novosItens =
    quantidade <= 0 ? itens.filter((i) => i.itemId !== itemId) : itens.map((i) => (i.itemId === itemId ? { ...i, quantidade } : i));
  return salvarCarrinho(novosItens);
}

export async function removerDoCarrinho(itemId: string) {
  const itens = await getCarrinho();
  return salvarCarrinho(itens.filter((i) => i.itemId !== itemId));
}

export async function limparCarrinho() {
  return salvarCarrinho([]);
}

export function subtotalCarrinho(itens: ItemCarrinho[]) {
  return itens.reduce((soma, i) => soma + i.preco * i.quantidade, 0);
}

// ---------------------------------------------------------------------------
// Frete, endereço e pedido
// ---------------------------------------------------------------------------

export type FreteOpcaoId = 'padrao' | 'expresso';

export const FRETE_OPCOES: { id: FreteOpcaoId; nome: string; prazo: string; preco: number }[] = [
  { id: 'padrao', nome: 'Frete Padrão', prazo: 'Previsão de 7 a 10 dias úteis', preco: 29.9 },
  { id: 'expresso', nome: 'Frete Expresso', prazo: 'Previsão de 2 a 4 dias úteis', preco: 59.9 },
];

export const ENDERECO_PADRAO = {
  id: 'casa',
  rotulo: 'CASA',
  linha1: 'Rua das Oliveiras, 240 — apto 102',
  linha2: 'Bairro Jardim Europa — São Paulo/SP',
  cep: 'CEP 04.567-120',
};

export type Endereco = typeof ENDERECO_PADRAO;

export async function getEnderecos(): Promise<Endereco[]> {
  const salvos = await readJson<Endereco[]>(KEY_ADDRESSES);
  return salvos?.length ? salvos : [ENDERECO_PADRAO];
}

export async function salvarEnderecos(enderecos: Endereco[]) {
  return writeJson(KEY_ADDRESSES, enderecos);
}

export async function getFavoritos(): Promise<string[]> {
  return (await readJson<string[]>(KEY_FAVORITES)) ?? [];
}

export async function alternarFavorito(produtoId: string) {
  const favoritos = await getFavoritos();
  const atualizados = favoritos.includes(produtoId) ? favoritos.filter((id) => id !== produtoId) : [...favoritos, produtoId];
  await writeJson(KEY_FAVORITES, atualizados);
  return atualizados;
}

export async function getProdutosFavoritos(): Promise<Produto[]> {
  const favoritos = await getFavoritos();
  return favoritos.map((id) => produtoPorId(id)).filter((produto): produto is Produto => Boolean(produto));
}

export type MetodoPagamentoId = 'credito' | 'debito' | 'pix' | 'boleto';

export const METODOS_PAGAMENTO: { id: MetodoPagamentoId; nome: string }[] = [
  { id: 'credito', nome: 'Cartão de Crédito' },
  { id: 'debito', nome: 'Cartão de Débito' },
  { id: 'pix', nome: 'PIX' },
  { id: 'boleto', nome: 'Boleto' },
];

export type Pedido = {
  id: string;
  data: string;
  itens: ItemCarrinho[];
  freteId: FreteOpcaoId;
  metodoPagamentoId: MetodoPagamentoId;
  subtotal: number;
  frete: number;
  total: number;
  status: 'confirmado';
  comprovante?: string;
};

function gerarIdPedido() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

export async function confirmarPedido(
  itens: ItemCarrinho[],
  freteId: FreteOpcaoId,
  metodoPagamentoId: MetodoPagamentoId,
): Promise<Pedido> {
  const subtotal = subtotalCarrinho(itens);
  const frete = FRETE_OPCOES.find((f) => f.id === freteId)?.preco ?? 0;

  const pedido: Pedido = {
    id: gerarIdPedido(),
    data: new Date().toISOString(),
    itens,
    freteId,
    metodoPagamentoId,
    subtotal,
    frete,
    total: subtotal + frete,
    status: 'confirmado',
    comprovante: gerarComprovante(metodoPagamentoId),
  };

  await writeJson(KEY_LAST_ORDER, pedido);
  const pedidos = (await readJson<Pedido[]>(KEY_ORDERS)) ?? [];
  await writeJson(KEY_ORDERS, [pedido, ...pedidos]);
  await limparCarrinho();
  return pedido;
}

export async function getUltimoPedido() {
  return readJson<Pedido>(KEY_LAST_ORDER);
}

export async function getPedidos() {
  const pedidos = await readJson<Pedido[]>(KEY_ORDERS);
  if (pedidos?.length) return pedidos;
  const ultimo = await getUltimoPedido();
  return ultimo ? [ultimo] : [];
}

function gerarComprovante(metodo: MetodoPagamentoId) {
  if (metodo === 'pix') return `00020126580014BR.GOV.BCB.PIX0136PITZONE-${gerarIdPedido()}5204000053039865802BR`;
  if (metodo === 'boleto') return `34191.79001 01043.510047 91020.150008 8 ${gerarIdPedido()}`;
  return `Transação simulada ${gerarIdPedido()}`;
}
