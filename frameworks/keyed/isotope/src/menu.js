import "@isotope/core/lib/configurators/attribs";
import "@isotope/core/lib/configurators/classes";
import "@isotope/core/lib/nodes/html";
import "@isotope/core/lib/nodes/text";

const menu = (btns) => (parent) => {
  const container = parent
    .div({ classes: ["jumbotron"] })
    .div({ classes: ["row"] });

  container
    .div({ classes: ["col-md-6"] })
    .h1()
    .text("Isotope");

  const buttonsContainer = container.div({ classes: ["col-md-6"] });

  btns.forEach(({ id, onClick, text }) => {
    const item = buttonsContainer.div({ classes: ["col-sm-6", "smallpad"] });
    item
      .button({
        attribs: { type: "button", id },
        classes: ["btn", "btn-primary", "btn-block"],
      })
      .text(text)
      .on("click", onClick);

    return item;
  });
};

export default menu;
