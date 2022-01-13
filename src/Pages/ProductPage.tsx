import { useParams } from "react-router";

const ProductPage = () => {
	const { category, productId } = useParams();

	return <div>{category}/{productId}</div>;
}

export default ProductPage;