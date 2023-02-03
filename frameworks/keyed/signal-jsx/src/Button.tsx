type Props = {
  id: string;
  text: string;
  fn: () => void;
};

export function Button({ id, text, fn }: Props) {
  return (
    <div class="col-sm-6 smallpad">
      <button
        id={id}
        class="btn btn-primary btn-block"
        type="button"
        on:click={fn}
      >
        {text}
      </button>
    </div>
  );
}
