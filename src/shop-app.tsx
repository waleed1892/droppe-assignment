import * as React from "react";
import lodash from 'lodash';
import Modal from "react-modal";
import { FaTimes } from "react-icons/fa";
import { Button } from "./components/button";
import ProductList from "./components/product-list-components";
import { Form } from "./components/form";
import logo from "./images/droppe-logo.png";
import img1 from "./images/img1.png";
import img2 from "./images/img2.png";
import styles from "./shopApp.module.css";

export type product = {
  title: string; description: string, price: number, rating: { rate: number, count: number }, isFavorite: boolean
}

export class ShopApp extends React.Component<
  {},
  { products: product[]; isOpen: boolean; isShowingMessage: boolean; message: string; numFavorites: number; prodCount: number }
> {
  constructor(props: any) {
    super(props);

    this.favClick = this.favClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getProducts = this.getProducts.bind(this)
    this.addProduct = this.addProduct.bind(this)
    this.toggleModal = this.toggleModal.bind(this)

    this.state = { products: [], isOpen: false, isShowingMessage: false, message: '', numFavorites: 0, prodCount: 0 };


  }

  componentDidMount() {
    document.title = "Droppe refactor app"
    this.getProducts()
  }

  toggleModal() {
    let open = true
    if (this.state.isOpen === true) {
      open = false
    }
    this.setState({ isOpen: open })
  }

  getProducts() {
    fetch('https://fakestoreapi.com/products').then(res => res.json())
      .then(data => {
        this.setState({
          products: data,
          prodCount: data.length
        });
      });
  }

  favClick(productIndex: number) {
    const prods = lodash.cloneDeep(this.state.products)
    const product = prods[productIndex]
    let totalFavs = this.state.numFavorites
    if (product.isFavorite) {
      product.isFavorite = false
      totalFavs = totalFavs - 1
    } else {
      product.isFavorite = true
      totalFavs = totalFavs + 1
    }
    prods[productIndex] = product

    this.setState(() => ({ products: prods, numFavorites: totalFavs }));
  }

  addProduct(payload: product, updated: product[]) {
    // **this POST request doesn't actually post anything to any database**
    fetch('https://fakestoreapi.com/products', {
      method: "POST",
      body: JSON.stringify(
        {
          title: payload.title,
          price: payload.price,
          description: payload.description,
          rating: payload.rating
        }
      )
    })
      .then(res => res.json())
      .then(json => {
        this.setState({
          products: updated,
          prodCount: updated.length,
          isShowingMessage: false
        })
      })
  }

  onSubmit(payload: product) {
    const updated = lodash.clone(this.state.products);
    updated.push({
      title: payload.title,
      description: payload.description,
      price: payload.price,
      rating: payload.rating,
      isFavorite: false
    });

    this.setState({
      isOpen: false,
    }, () => {
      this.setState({
        isShowingMessage: true,
        message: 'Adding product...'
      }, () => {
        this.addProduct(payload, updated)
      })
    })
  }

  render() {
    const { products, isOpen } = this.state;
    return (
      <React.Fragment>
        <div className={styles.header}>
          <div className={['container', styles.headerImageWrapper].join(' ')}>
            <img src={logo} className={styles.headerImage} />
          </div>
        </div>

        <>
          <span
            className={['container', styles.main].join(' ')}
            style={{ margin: '50px inherit', display: 'flex', justifyContent: 'space-evenly' }}
          >
            <img src={img1} style={{ maxHeight: "15em", display: 'block' }} />
            <img src={img2} style={{ maxHeight: "15rem", display: 'block' }} />
          </span>
        </>

        <div className={['container', styles.main].join(' ')} style={{ paddingTop: 0 }}>
          <div className={styles.buttonWrapper}>
            <span role="button">
              <Button
                onClick={this.toggleModal}
              >Send product proposal</Button>
            </span>
            {this.state.isShowingMessage && <div className={styles.messageContainer}>
              <i>{this.state.message}</i>
            </div>}
          </div>

          <div className={styles.statsContainer}>
            <span>Total products: {this.state.prodCount}</span>
            {' - '}
            <span>Number of favorites: {this.state.numFavorites}</span>
          </div>

          {products && !!products.length ? <ProductList products={products} onFav={this.favClick} /> : <div></div>}
        </div>

        <>
          <Modal
            isOpen={isOpen}
            className={styles.reactModalContent}
            overlayClassName={styles.reactModalOverlay}
          >
            <div className={styles.modalContentHelper}>
              <div
                className={styles.modalClose}
                onClick={this.toggleModal}
              ><FaTimes /></div>

              <Form
                on-submit={this.onSubmit}
              />
            </div>
          </Modal>
        </>
      </React.Fragment>
    );
  }
}
