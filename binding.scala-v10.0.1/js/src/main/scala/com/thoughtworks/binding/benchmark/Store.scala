package com.thoughtworks.binding.benchmark

import com.thoughtworks.binding.Binding.{Var, Vars}

import scala.util.Random

/**
  * @author 杨博 (Yang Bo) &lt;pop.atry@gmail.com&gt;
  */
final class Store {

  val data: Vars[(Int, Var[String])] = Vars.empty
  val selected: Var[Option[Int]] = Var(None)
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

  private def buildData(count: Int = 1000) = {
    (for (i <- 0 until count) yield {
      val id = seed
      seed += 1
      val label =
        raw"""${adjectives(Random.nextInt(adjectives.length))} ${colours(
          Random.nextInt(colours.length))} ${nouns(
          Random.nextInt(nouns.length))}"""
      id -> Var(label)
    })(collection.breakOut(scalajs.js.WrappedArray.canBuildFrom))
  }

  def run() = {
    val buffer = data.get
    buffer.clear()
    buffer ++= buildData()
  }

  def runLots() = {
    val buffer = data.get
    buffer.clear()
    buffer ++= buildData(10000)
  }

  def add() = {
    data.get ++= buildData()
  }

  def update() = {
    val buffer = data.get
    val i = buffer.iterator
    for (i <- 0 until buffer.length by 10) {
      val (_, label) = buffer(i)
      label := label.get + " !!!"
    }
  }

  def clear() = {
    data.get.clear()
  }

  def swapRows() = {
    val buffer = data.get
    if (buffer.length >= 10) {
      val tmp = buffer(4)
      buffer(4) = buffer(9)
      buffer(9) = tmp
    }
  }

  def delete(id: Int) = {
    val buffer = data.get
    buffer.remove(buffer.indexWhere {
      case (`id`, _) => true
      case _ => false
    })
  }

  def select(id: Int) = {
    selected := Some(id)
  }

}

object Store {}
