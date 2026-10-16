import { Suspense } from "react";

const ProductDetailsContent = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return <h1>Product ID: {id}</h1>;
};

const ProductDetailsPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => (
  <Suspense fallback={<p>Carregando produto...</p>}>
    <ProductDetailsContent params={params} />
  </Suspense>
);

export default ProductDetailsPage;
