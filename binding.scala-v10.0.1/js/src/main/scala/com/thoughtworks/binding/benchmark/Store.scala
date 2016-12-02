package com.thoughtworks.binding.benchmark

import com.thoughtworks.binding.Binding.{Var, Vars}

import scala.util.Random

/**
  * @author 杨博 (Yang Bo) &lt;pop.atry@gmail.com&gt;
  */
final class Store {

  val data: Var[Vars[(Int, String)]] = Var(Vars.empty)
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
    for (i <- 0 until count) yield {
      val id = seed
      seed += 1
      val label =
        raw"""${adjectives(Random.nextInt(adjectives.length))} ${colours(
          Random.nextInt(colours.length))} ${nouns(
          Random.nextInt(nouns.length))}"""
      id -> label
    }
  }

  def run() = {
    data := Vars(buildData(): _*)
  }

  def runLots() = {
    data := Vars(buildData(10000): _*)
  }

  def add() = {
    data.get.get ++= buildData()
  }

  def update() = {
    val buffer = data.get.get
    for (i <- 0 until buffer.length by 10) {
      val (id, label) = buffer(i)
      buffer(i) = id -> raw"""$label !!!"""
    }
  }

  def clear() = {
    data := Vars()
  }

  def swapRows() = {
    val buffer = data.get.get
    if (buffer.length >= 10) {
      val tmp = buffer(4)
      buffer(4) = buffer(9)
      buffer(9) = tmp
    }
  }

  def delete(id: Int) = {
    val buffer = data.get.get
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
