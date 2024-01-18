package data

import (
	"math/rand"
)

var adjectives = []string{"pretty", "large", "big", "small", "tall", "short", "long", "handsome",
	"plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy",
	"odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive",
	"fancy"}
var colors = []string{"red", "yellow", "blue", "green", "pink", "brown", "purple", "brown",
	"white", "black", "orange"}
var nouns = []string{"table", "chair", "house", "bbq", "desk", "car", "pony", "cookie",
	"sandwich", "burger", "pizza", "mouse", "keyboard"}

func randFromSlice(arr []string) string {
	return arr[rand.Intn(len(arr))]
}

var nextId = 1

type Item struct {
	ID    int
	Label string
}

func BuildData(count int) []*Item {
	data := make([]*Item, count)
	for i := 0; i < count; i++ {
		data[i] = &Item{
			ID:    nextId,
			Label: randFromSlice(adjectives) + " " + randFromSlice(colors) + " " + randFromSlice(nouns),
		}
		nextId++
	}
	return data
}
