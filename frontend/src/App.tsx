import { useRef } from "react";
import { api } from "./api";
import { useState, useEffect } from "react";

interface Product {
  id: number;
  name: string;
  grupo: string;
  preco: number;
  quantity: number;
}

function App() {
  const nameRef = useRef<HTMLInputElement>(null);
  const grupoRef = useRef<HTMLInputElement>(null);
  const precoRef = useRef<HTMLInputElement>(null);
  const quantityRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (
      !nameRef.current?.value ||
      !grupoRef.current?.value ||
      !precoRef.current?.value ||
      !quantityRef.current?.value
    ) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      await api.post("/products", {
        name: nameRef.current.value,
        grupo: grupoRef.current.value,
        preco: parseFloat(precoRef.current.value),
        quantity: parseInt(quantityRef.current.value, 0),
      });
      alert("Produto cadastrado com sucesso!");
      nameRef.current.value = "";
      grupoRef.current.value = "";
      precoRef.current.value = "";
      quantityRef.current.value = "";
      loadProducts();
    } catch (error) {
      console.error("Erro ao cadastrar produto: ", error);
      alert("Erro ao conectar com o servidor.");
    }

    const response = await api.get("/products");
    setProducts(response.data);
  }

  const [products, setProducts] = useState<Product[]>([]);

  async function loadProducts() {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.log("Erro ao carregar produtos: ", error);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function CleanInventory() {
    const confirm = window.confirm(
      "Tem certeza que deseja limpar o inventário? Esta ação não pode ser desfeita.",
    );
    if (confirm) {
      try {
        const response = await api.delete("/products");
        if (response.status >= 200 && response.status < 300) {
          alert("Inventário limpo com sucesso!");
          setProducts([]);
        }
      } catch (error) {
        console.error("Erro ao limpar inventário: ", error);
        alert("Erro ao conectar com o servidor.");
      }
    }
  }

  const handleDelete = async (id: number) => {
    const confirm = window.confirm(
      "Tem certeza que deseja deletar este item do inventario? Esta ação não pode ser desfeita.",
    );
    if (confirm) {
      try {
        await api.delete(`/products/${id}`);
        setProducts((prev) => prev.filter((item) => item.id !== id));
        alert("Produto deletado com sucesso!");
      } catch (error) {
        console.error("Erro ao deletar produto: ", error);
        alert("Erro ao tentar excluir item do inventário.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Inventario Do <span className="text-orange-600">SrWilson</span>
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-blue-600">
              Nome do Produto
            </label>
            <input
              type="text"
              ref={nameRef}
              placeholder="ex: teclado"
              className="w-full px-3 py-2
             border border-gray-300 rounded-md focus:outline-none focus:ring-2
              focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-blue-600">Grupo</label>
            <input
              type="text"
              ref={grupoRef}
              placeholder="ex: eletrônicos "
              className="w-full px-3 py-2
             border border-gray-300 rounded-md focus:outline-none focus:ring-2
              focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-blue-600">Preço</label>
            <input
              type="number"
              step="0.1"
              ref={precoRef}
              placeholder="ex: 100.00 "
              className="w-full px-3 py-2
             border border-gray-300 rounded-md focus:outline-none focus:ring-2
              focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-blue-600">
              Quantidade
            </label>
            <input
              type="number"
              ref={quantityRef}
              placeholder="ex: 10 "
              className="w-full px-3 py-2
             border border-gray-300 rounded-md focus:outline-none focus:ring-2
              focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-orange-600 hover:bg-orange-700 text-black font-bold py-2 px-4 rounded-md transition-colors shadow-sm"
          >
            Cadastrar
          </button>
        </form>
      </div>
      <div className="mt-8 bg-darkblue p-6 rounded-lg shadow-md w-full-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className=" bg-orange-400 text-gray-800bg-orange-400 hover:bg-orange-500 text-black px-4 py-2 rounded-md transition-colors text-sm font-medium">
            Produtos Cadastrados
          </h2>

          <button
            onClick={CleanInventory}
            className="bg-red-500 hover:bg-red-600 text-black font-bold py-2 px-4
          rounded-md transition-colors shadow-sm"
          >
            Limpar Inventario
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse ">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border border-gray-300">Nome</th>
                <th className="py-2 px-4 border border-gray-300">Grupo</th>
                <th className="py-2 px-4 border border-gray-300">Preço</th>
                <th className="py-2 px-4 border border-gray-300">Quantidade</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border border-gray-300">
                    {product.name}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {product.grupo}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    R$ {product.preco.toFixed(2)}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {product.quantity}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-black hover:bg-gray-700 text-black py-1 px-3 rounded-md transition-colors"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 && (
            <p className="text-center text-gray-500 mt-4">
              Nenhum produto encontrado.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
