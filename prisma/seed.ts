import "dotenv/config";
import { prisma } from "../lib/prisma";

const products = [
  { name: "Cimento CP II 50 kg", price: "38.90", stock: 40 },
  { name: "Areia média (saco 20 kg)", price: "8.50", stock: 100 },
  { name: "Tijolo cerâmico 8 furos", price: "1.20", stock: 500 },
  { name: "Bloco de concreto 14 × 19 × 39 cm", price: "4.80", stock: 120 },
  { name: "Cal hidratada 20 kg", price: "19.90", stock: 25 },
  { name: "Tinta acrílica branca 18 L", price: "289.90", stock: 12 },
  { name: "Tinta acrílica branca 3,6 L", price: "79.90", stock: 20 },
  { name: "Pincel para pintura 2 pol.", price: "18.50", stock: 30 },
  { name: "Rolo de pintura 23 cm", price: "24.90", stock: 18 },
  { name: "Fita isolante 20 m", price: "9.90", stock: 35 },
  { name: "Disjuntor monopolar 20 A", price: "16.90", stock: 22 },
  { name: "Torneira plástica para jardim", price: "14.50", stock: 15 },
];

async function main() {
  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log(`${products.length} produtos cadastrados.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });