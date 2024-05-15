(ns demo.main
  (:require [reagent.core :as r]
            ["react-dom/client" :refer [createRoot]]
            [cljs.core :as core]
            [re-frame.core :as rf]))

;; Data

(def adjectives ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"])
(def colours ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"])
(def nouns ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"])

;; Subs

(rf/reg-sub
 ::selected
 (fn [db _]
   (::selected db)))

(rf/reg-sub
 ::selected?
 :<- [::selected]
 (fn [selected [_ id]]
   (= selected id)))

(rf/reg-sub
 ::data-ids
 (fn [db _]
   (::data-ids db)))

(rf/reg-sub
 ::data
 (fn [db [_ id]]
   (get-in db [::data id])))

;; Events

(rf/reg-event-db
 ::initialize
 (fn [_ _]
   {::data-ids []}))

(rf/reg-event-db
 ::unselect
 (fn [db _]
   (dissoc db ::selected)))

(rf/reg-event-db
 ::select
 (fn [db [_ id]]
   (assoc db ::selected id)))

(rf/reg-event-db
 ::delete
 (fn [db [_ id]]
   (-> db
       (update ::data-ids (fn [ids] (into [] (remove #{id} ids))))
       (dissoc [::data id]))))

(rf/reg-event-fx
 ::build-data
 (fn [_ [_ n]]
   {:fx [[:dispatch [::clear]]
         [:dispatch [::append-data n]]]}))

(rf/reg-event-db
 ::clear
 (fn [db _]
   (-> db
       (assoc ::data {})
       (assoc ::data-ids []))))

(defn random-label []
  (str (rand-nth adjectives) " "
       (rand-nth colours) " "
       (rand-nth nouns)))

(rf/reg-event-db
 ::append-data
 (fn [db [_ n]]
   (let [start (::max-id db 0)
         ids (range (inc start) (+ start n 1))
         new-data
         (map #(vector % {:id %
                          :label (random-label)})
              ids)]
     (-> db
         (assoc ::max-id (+ start n))
         (update ::data-ids into ids)
         (update ::data merge new-data)))))

(rf/reg-event-db
 ::update-some
 (fn [db _]
   (let [updated-data
         (transduce
          (comp
           (map-indexed vector)
           (filter (fn [[idx _id]] (zero? (mod idx 10))))
           (map (fn [[_idx id]]
                  [id (-> (get-in db [::data id])
                          (update :label str " !!!"))])))
          merge
          {}
          (::data-ids db))]
     (update db ::data merge updated-data))))

(rf/reg-event-db
 ::swap-rows
 (fn [db _]
   (let [ids (::data-ids db)]
     (if (> (count ids) 998)
       (assoc db ::data-ids
              (-> ids
                  (assoc 1 (get ids 998))
                  (assoc 998 (get ids 1))))
       db))))

;; Components

(defn row [id]
  (let [onclick (fn [_e] (rf/dispatch [::select id]))
        ondelete (fn [_e] (rf/dispatch [::delete id]))]
    (fn rowfn []
      (let [data @(rf/subscribe [::data id])
            selected? @(rf/subscribe [::selected? id])]
        [:tr
         {:class (when selected? "danger")}
         [:td.col-md-1 (:id data)]
         [:td.col-md-4
          [:a {:onClick onclick}
           (:label data)]]
         [:td.col-md-1
          [:a {:onClick ondelete}
           [:span.glyphicon.glyphicon-remove
            {:aria-hidden "true"}]]]
         [:td.col-md-6]]))))

(defn table []
  [:table.table.table-hover.table-striped.test-data
   [:tbody
    (for [id @(rf/subscribe [::data-ids])]
      ^{:key id} [row id])]])

(defn ui []
  (let [run
        (fn run [_]
          (rf/dispatch [::build-data 1000])
          (rf/dispatch [::unselect]))
        run-lots
        (fn run-lots [_]
          (rf/dispatch [::build-data 10000])
          (rf/dispatch [::unselect]))
        add
        (fn add [_]
          (rf/dispatch [::append-data 1000]))
        update-some
        (fn update-some []
          (rf/dispatch [::update-some]))
        clear
        (fn clear []
          (rf/dispatch [::clear])
          (rf/dispatch [::unselect]))
        swap-rows
        (fn swap-rows []
          (rf/dispatch [::swap-rows]))]
    (fn []
      [:div.container
       [:div.jumbotron
        [:div.row
         [:div.col-md-6
          [:h1 "Re-frame"]]
         [:div.col-md-6
          [:div.row
           [:div.col-sm-6.smallpad
            [:button.btn.btn-primary.btn-block
             {:type "button"
              :id "run"
              :on-click run}
             "Create 1,000 rows"]]
           [:div.col-sm-6.smallpad
            [:button.btn.btn-primary.btn-block
             {:type "button"
              :id "runlots"
              :on-click run-lots}
             "Create 10,000 rows"]]
           [:div.col-sm-6.smallpad
            [:button.btn.btn-primary.btn-block
             {:type "button"
              :id "add"
              :on-click add}
             "Append 1,000 rows"]]
           [:div.col-sm-6.smallpad
            [:button.btn.btn-primary.btn-block
             {:type "button"
              :id "update"
              :on-click update-some}
             "Update every 10th row"]]
           [:div.col-sm-6.smallpad
            [:button.btn.btn-primary.btn-block
             {:type "button"
              :id "clear"
              :on-click clear}
             "Clear"]]
           [:div.col-sm-6.smallpad
            [:button.btn.btn-primary.btn-block
             {:type "button"
              :id "swaprows"
              :on-click swap-rows}
             "Swap rows"]]]]]]
       [table]
       [:span.preloadicon.glyphicon.glyphicon-remove
        {:aria-hidden "true"}]])))

;; Entry point

(defonce root (createRoot (js/document.getElementById "main")))

(defn render
  []
  (.render root (r/as-element
                 [ui])))

(defn main
  []
  (rf/dispatch-sync [::initialize])
  (render))

(main)
