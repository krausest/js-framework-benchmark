package app

import com.raquo.laminar.api.L.{*, given}
import org.scalajs.dom

object JsApp:
  
  import com.raquo.airstream.split.DuplicateKeysConfig
  
  def main(args: Array[String]): Unit =
    lazy val container = dom.document.getElementById("main")
    lazy val app       = renderApp()
    
    render(container, app)
  
  private def renderApp(): HtmlElement =
    div(cls := "container",
      div(cls := "jumbotron",
        div(cls := "row",
          div(cls := "col-md-6",
            h1("Laminar"),
          ),
          div(cls := "col-md-6",
            div(cls := "row",
              renderButton(id = "run",      text = "Create 1,000 rows",     action = Command.Set1kRows),
              renderButton(id = "runlots",  text = "Create 10,000 rows",    action = Command.Set10kRows),
              renderButton(id = "add",      text = "Append 1,000 rows",     action = Command.Add1kRows),
              renderButton(id = "update",   text = "Update every 10th row", action = Command.UpdateEvery10thRow),
              renderButton(id = "clear",    text = "Clear",                 action = Command.DeleteAllRows),
              renderButton(id = "swaprows", text = "Swap Rows",             action = Command.SwapTwoRows),
            ),
          ),
        ),
      ),
      table(cls := "table table-hover table-striped test-data",
        tbody(idAttr := "tbody",
          children <-- State.currentItems.split(_.id, duplicateKeys = DuplicateKeysConfig.noWarnings)(renderRow),
        ),
      ),
    )
  
  private def renderButton(id: String, text: String, action: Command): HtmlElement =
    div(cls := "col-sm-6 smallpad",
      button(tpe := "button", cls := "btn btn-primary btn-block", idAttr := id,
        onClick.mapTo(action) --> State.commandObserver,
        text,
      )
    )
  
  private def renderRow(id: Int, item: Item, currentItem: Signal[Item]): HtmlElement =
    tr(cls.toggle("danger") <-- State.currentSelection.map(_.contains(id)),
      td(cls := "col-md-1",
        id.text,
      ),
      td(cls := "col-md-4",
        a(cls := "lbl",
          onClick.mapTo(Command.SelectRow(id)) --> State.commandObserver,
          child.text <-- currentItem.map(_.label),
        ),
      ),
      td(cls := "col-md-1",
        a(cls := "remove",
          onClick.mapTo(Command.DeleteRow(id)) --> State.commandObserver,
          span(cls := "remove glyphicon glyphicon-remove", dataAttr("aria-hidden") := "true"),
        ),
      ),
      td(cls := "col-md-6"),
    )