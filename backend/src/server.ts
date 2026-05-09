import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
// import pool from "pg";

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// rota para listar todos os produtos

app.get("/products", async (req: Request, res: Response) => {
  try {
    const allProducts = await prisma.product.findMany();
    res.json(allProducts);
  } catch (error) {
    res.status(500).json({ error: "Erro ao procurar produtos" });
  }
});

// rota para criar um novo produto

app.post("/products", async (req: Request, res: Response) => {
  const { name, grupo, preco, quantity } = req.body;
  try {
    const newProduct = await prisma.product.create({
      data: {
        name: name,
        grupo: grupo,
        preco: parseFloat(preco),
        quantity: parseInt(quantity, 0),
      },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.log("Erro ", error);
    res.status(500).json({ error: "Erro ao criar produto" });
  }
});

// rota para atualizar um produto existente
app.put("/products/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, grupo, preco, quantity } = req.body;
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name: name,
        grupo: grupo,
        preco: parseFloat(preco),
        quantity: parseInt(quantity, 0),
      },
    });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
});

// rota para deletar um produto
app.delete("/products", async (request, reply) => {
  try {
    await prisma.product.deleteMany();

return reply.status(200).send({ message: "Produtos deletados com sucesso!" });
} catch (err) {
  return reply.status(500).send({ error: "Erro ao deletar produtos" });
}
});

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const checkProduct = await prisma.product.delete({
      where: { id: Number(id) },
    });
    return res.status(200).json({ message: "Item excluído com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    return res.status(500).json({ message: "erro ao tentar excluir item" });
  }
};

app.delete("/products/:id", deleteProduct);


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
