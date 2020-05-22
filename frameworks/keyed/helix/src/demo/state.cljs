(ns demo.state)

(def adjectives ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"])
(def colours ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"])
(def nouns ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"])

(defrecord Data [id label])

(def id 0)

(defn build-data [count]
  ;; eagerly build data
  (loop [i 0
         data #js []]
    (if (< i count)
      (recur
       (inc i)
       (doto data
         (.push (->Data
                 (set! id (inc id))
                 (str (rand-nth adjectives)
                      " "
                      (rand-nth colours)
                      " "
                      (rand-nth nouns))))))
      ;; done
      (vec data))))

(defn add [data]
  (let [last-id (:id (last data) 0)]
    (into data (build-data 1000))))

(defn update-some [data]
  (reduce (fn [data index]
            (update data index update :label str " !!!"))
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

(def initial-state
  {:data []
   :selected nil})

(defn state-reducer
  [state [action payload]]
  (case action
    ::run {:data (build-data 1000)
          :selected nil}
    ::run-lots {:data (build-data 10000)
               :selected nil}

    ::add (update state :data add)
    ::update (update state :data update-some)
    ::swap (update state :data swap-rows)
    ::select (assoc state :selected payload)
    ::delete (update state :data delete-row payload)
    ::clear initial-state))
