import * as React from "react";
import { Button } from "./button";
import styles from "./form.module.css";

type IFormProps = {
  "on-submit": (payload: { title: string; description: string; price: string, rating: { rate: number } }) => void;
}

export const Form: React.FC<IFormProps> = (props) => {
  let formRef = React.useRef<HTMLFormElement>(null);
  let titleRef = React.useRef<HTMLInputElement>(null);
  let priceRef = React.useRef<HTMLInputElement>(null);
  let descriptionRef = React.useRef<HTMLTextAreaElement>(null);
  const [rating, setRating] = React.useState<number>(0)

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!titleRef.current?.value) {
      alert("Your product needs a title");

      return;
    }

    if (!descriptionRef.current?.value || !priceRef.current?.value) {
      alert("Your product needs some content");

      return;
    }


    if (!new RegExp(/^\d+(.\d+)?$/).test(priceRef.current.value)) {
      alert('Your product needs valid price')
      return;
    }

    props["on-submit"]({
      title: titleRef.current && titleRef.current.value,
      description: descriptionRef.current && descriptionRef.current.value,
      price: priceRef.current && priceRef.current.value,
      rating: { rate: rating }
    });

    formRef.current?.reset();
  };

  const changeRating = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRating(Number(e.target.value))
  }

  return (
    <form className={styles.form} onSubmit={(event) => handleSubmit(event)} ref={formRef}>
      <span className={styles.label}>Product title: *</span>

      <input
        ref={titleRef}
        placeholder="Title..."
        defaultValue=""
        className={styles.input}
      />

      <span className={styles.label}>Product details: *</span>

      <input
        ref={priceRef}
        placeholder="Price..."
        defaultValue=""
        className={styles.input}
      />

      <textarea
        ref={descriptionRef}
        placeholder="Start typing product description here..."
        defaultValue=""
        className={styles.textarea}
      />
      <div className={styles.slider}>
        <div>Ratings: <strong>{rating}</strong></div>
        <input type="range" onChange={changeRating} defaultValue={0} min="0" max={5} step="0.1" />
        <div className={styles.range}>
          <p>0</p>
          <p>5</p>
        </div>
      </div>
      <Button>Add a product</Button>
    </form>
  );
};
