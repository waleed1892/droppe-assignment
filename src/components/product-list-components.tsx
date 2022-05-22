import * as React from "react";
import lodash from 'lodash'
import { FaStar } from "react-icons/fa";
import styles from "./product-list-components.module.css";
import { product } from "../shop-app";

interface IPostsProps {
  products: any;
  onFav: (productIndex: number) => void;
}


class Posts extends React.Component<IPostsProps, {}> {
  render() {
    const reverseProducts = lodash.reverse(this.props.products)
    const onFav = (index: number) => {
      this.props.onFav(reverseProducts.length - (index + 1))
    }
    return <div>
      {
        reverseProducts.map((product: product, i: number) => <Product index={i} key={i} product={product} onFav={onFav} />)
      }
    </div>
  }
}

export default React.memo(Posts)

export const Product: React.FC<{
  index: number;
  product: { title: string; description: string; price: number; isFavorite: boolean; rating: { rate: number; count: number } };
  onFav: (productIndex: number) => void;
}> = ({ product, onFav, index }) => {
  const { product: productClass, productBody, actionBarItem, actionBarItemLabel } = styles
  // Problem: Now product title can be too long, I just put overflowX as fix now
  return (
    <span className={productClass} style={{ display: 'inline-block', overflowX: 'scroll', float: 'none', clear: 'both' }}>
      <span className={styles['product-title']}>{product.title}</span>

      <p><strong>Rating: {product.rating ? `${product.rating.rate}/5` : ''}</strong></p>

      <p><b>Price: ${+product.price}</b></p>

      <p className={productBody}>
        <span><b>Description:</b></span>
        <br />
        {product.description}
      </p>

      <span className={styles['action_bar']} style={{ display: 'table', width: "100%" }}>
        <span
          className={`${actionBarItem} ${product.isFavorite ? "active" : ""
            }`}
          role="button"
          onClick={() => {
            onFav(index);
          }}
        >
          <FaStar /> <span className={actionBarItemLabel}>{!!(!!(product.isFavorite)) ? 'Remove from favorites' : 'Add to favorites'}</span>
        </span>
      </span>
    </span>
  );
};
