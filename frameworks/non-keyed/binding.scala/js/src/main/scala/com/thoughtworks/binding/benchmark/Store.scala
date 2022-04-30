package com.thoughtworks.binding.benchmark

import com.thoughtworks.binding.Binding.{Var, Vars}

import scala.util.Random

/**
  * @author 杨博 (Yang Bo) &lt;pop.atry@gmail.com&gt;
  */
final class Store {
  import Store.Row

  val data: Vars[Row] = Vars.empty
  val selected: Var[Option[Row]] = Var(None)
  var seed = 1

  val adjectives = Array("pretty",
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
                         "fancy")

  val colours = Array("red",
                      "yellow",
                      "blue",
                      "green",
                      "pink",
                      "brown",
                      "purple",
                      "brown",
                      "white",
                      "black",
                      "orange")

  val nouns = Array("table",
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
                    "keyboard")

  @inline
  private def newLabel() = {
    raw"""${
      adjectives(Random.nextInt(adjectives.length))
    } ${
      colours(Random.nextInt(colours.length))
    } ${
      nouns(Random.nextInt(nouns.length))
    }"""
  }

  @inline
  private def newId() = {
    val id = seed
    seed += 1
    id
  }

  private def buildData(count: Int = 1000) = {
    (for (i <- 0 until count) yield {
      new Row(newId(), Var(newLabel()))
    })(collection.breakOut(scalajs.js.WrappedArray.canBuildFrom))
  }

  private def replace(count: Int = 1000) = {
    val buffer = data.get
    buffer.clear()
    buffer ++= buildData(count)
  }

  @inline
  def run() = {
    replace(1000)
  }

  @inline
  def runLots() = {
    replace(10000)
  }

  @inline
  def add() = {
    data.get ++= buildData()
  }

  def update() = {
    val buffer = data.get
    val i = buffer.iterator
    for (i <- 0 until buffer.length by 10) {
      val label = buffer(i).label
      label := label.get + " !!!"
    }
  }

  @inline
  def clear() = {
    data.get.clear()
  }

  def swapRows() = {
    val buffer = data.get
    if (buffer.length > 998) {
      val row1 = buffer(1)
      val row998 = buffer(998)
      buffer(998) = row1
      buffer(1) = row998
    }
  }

  @inline
  def delete(row: Row) = {
    val buffer = data.get
    buffer -= row
  }

  @inline
  def select(row: Row) = {
    selected := Some(row)
  }

}

object Store {

  final class Row(val id: Int, val label: Var[String])

}
