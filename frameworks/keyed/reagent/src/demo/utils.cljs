(ns demo.utils)

(def adjectives ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"])
(def colours ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"])
(def nouns ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"])

(defrecord Data [id label])

(defn build-data [id-atom count]
  (repeatedly count (fn []
                      (->Data (swap! id-atom inc) (str (rand-nth adjectives) " " (rand-nth colours) " " (rand-nth nouns))))))

(defn add [data id-atom]
  (into data (build-data id-atom 1000)))

(defn update-some [data]
  (reduce (fn [data index]
            (let [row (get data index)]
              (assoc data index (assoc row :label (str (:label row) " !!!")))))
          data
          (range 0 (count data) 10)))

(defn swap-rows [data]
  (if (> (count data) 998)
    (-> data
        (assoc 1 (get data 998))
        (assoc 998 (get data 1)))
    data))

(defn delete-row [data id]
  (vec (remove #(identical? id (:id %)) data)))
