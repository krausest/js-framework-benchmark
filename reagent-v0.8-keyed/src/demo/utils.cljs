(ns demo.utils)

(defn build-data [id-atom count]
  (let [adjectives ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"]
        colours ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"]
        nouns ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"]]
    (->> (repeatedly (fn []
                       {:id (swap! id-atom inc)
                        :label (str (rand-nth adjectives) " " (rand-nth colours) " " (rand-nth nouns))}))
         (take count)
         vec)))

(defn add [data id-atom]
  (into data (build-data id-atom 1000)))

(defn update-some [data]
  (reduce (fn [data index]
            (update-in data [index :label] str " !!!"))
          data
          (range 0 (count data) 10)))

(defn swap-rows [data]
  (if (> (count data) 998)
    (-> data
        (assoc 1 (get data 998))
        (assoc 998 (get data 1)))
    data))

(defn delete-row [data id]
  (vec (remove (comp (partial = id) :id) data)))
