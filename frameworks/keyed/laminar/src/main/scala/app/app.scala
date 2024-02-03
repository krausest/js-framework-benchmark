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
    case UpdateEvery10thRow => items.update(_.zipWithIndex.map:
      case (item, index) if index % 10 == 0 => item.copy(label = item.label + " !!!")
      case (item, _)                        => item
    )
    case DeleteAllRows      => items.set(Vector.empty)
    case SwapTwoRows        => items.update:
      case items if items.length > 998 => items.updated(1, items(998)).updated(998, items(1))
      case items                       => items
    case DeleteRow(id)      => items.update(_.filterNot(_.id == id))
    case SelectRow(id)      => selection.set(Some(id))
  
end State

object Data:
  
  import scala.collection.immutable.ArraySeq
  
  def generateLabel(): String =
    import scala.util.Random
    
    val adjective = adjectives(Random.nextInt(adjectives.length))
    val colour    = colours(Random.nextInt(colours.length))
    val noun      = nouns(Random.nextInt(nouns.length))
    
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