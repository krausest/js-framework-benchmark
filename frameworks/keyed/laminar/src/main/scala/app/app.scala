package app

case class Item(id: Int, label: String)

enum Command:
  case Set1kRows
  case Set10kRows
  case Add1kRows
  case UpdateEvery10thRow
  case DeleteAllRows
  case SwapTwoRows
  case DeleteRow(id: Int)
  case SelectRow(id: Int)

object State:
  
  import com.raquo.airstream.core.Observer
  import com.raquo.airstream.state.{StrictSignal, Var}
  import Command.*
  
  def currentItems:     StrictSignal[Vector[Item]] = items.signal
  def currentSelection: StrictSignal[Option[Int]]  = selection.signal
  
  private def generateItem(): Item = Item(nextId(), Data.generateLabel())
  
  private var lastId:   Int = 0
  private def nextId(): Int = { lastId += 1; lastId }
  
  private val items:     Var[Vector[Item]] = Var(Vector.empty)
  private val selection: Var[Option[Int]]  = Var(None)
  
  val commandObserver: Observer[Command] = Observer[Command]:
    case Set1kRows          => items.set(Vector.fill(1000)(generateItem()))
    case Set10kRows         => items.set(Vector.fill(10000)(generateItem()))
    case Add1kRows          => items.update(_ ++ Vector.fill(1000)(generateItem()))
    case UpdateEvery10thRow => items.update: items =>
      (items.indices by 10).foldLeft(items): (items, i) =>
        val item = items(i)
        items.updated(i, item.copy(label = item.label + " !!!"))
    case DeleteAllRows      => items.set(Vector.empty)
    case SwapTwoRows        => items.update: items =>
      if items.length >= 999 then items.updated(1, items(998)).updated(998, items(1)) else items
    case DeleteRow(id)      => items.update: items =>
      val index = items.indexWhere(_.id == id)
      if index != -1 then items.patch(index, Nil, 1) else items
    case SelectRow(id)      => selection.set(Some(id))
  
end State

object Data:
  
  import scala.collection.immutable.ArraySeq
  import scala.util.Random
  
  def generateLabel(): String =
    inline def adjective = adjectives(Random.nextInt(adjectives.length))
    inline def colour    = colours(Random.nextInt(colours.length))
    inline def noun      = nouns(Random.nextInt(nouns.length))
    
    s"$adjective $colour $noun"
  
  private val adjectives = ArraySeq(
    "pretty",
    "large",
    "big",
    "small",
    "tall",
    "short",
    "long",
    "handsome",
    "plain",
    "quaint",
    "clean",
    "elegant",
    "easy",
    "angry",
    "crazy",
    "helpful",
    "mushy",
    "odd",
    "unsightly",
    "adorable",
    "important",
    "inexpensive",
    "cheap",
    "expensive",
    "fancy",
  )
  
  private val colours = ArraySeq(
    "red",
    "yellow",
    "blue",
    "green",
    "pink",
    "brown",
    "purple",
    "brown",
    "white",
    "black",
    "orange",
  )
  
  private val nouns = ArraySeq(
    "table",
    "chair",
    "house",
    "bbq",
    "desk",
    "car",
    "pony",
    "cookie",
    "sandwich",
    "burger",
    "pizza",
    "mouse",
    "keyboard",
  )
  
end Data