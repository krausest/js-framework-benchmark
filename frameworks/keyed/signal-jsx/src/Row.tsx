import type { Component, Signal, Patch } from "signal-jsx";

export type Props = {
  ref?: Element;
  id: number;
  selected: Signal<"" | "danger">;
  label: Signal<string>;
};

export function Row(props: Props) {
  const { id, selected, label } = props;
  return (
    <tr ref={props.ref} class={~selected}>
      <td class="col-md-1">{id}</td>
      <td class="col-md-4">
        <a on:click={() => (selected.value = "danger")}>{~label}</a>
      </td>
      <td class="col-md-1">
        <a on:click={() => props.ref!.remove()}>
          <span class="glyphicon glyphicon-remove" aria-hidden="true" />
        </a>
      </td>
      <td class="col-md-6" />
    </tr>
  );
}

export function List(data: Props[]): Component {
  let html = "";
  const patchs: Patch[] = [];

  data.forEach((props) => {
    const { html: innerHTML, patch } = Row(props);
    html += innerHTML;
    patchs.push(patch);
  });

  const patch = (list: NodeList, index: number) => {
    return patchs.reduce((index, patch) => patch(list, index), index);
  };

  return { html, patch };
}
