(ns demo.main
  (:require [reagent.core :as r]
            [reagent.dom :as rdom]
            [demo.utils :as u]))

(defn is-selected? [selected id]
  (= id @selected))

(defn row [data selected on-click on-delete]
  (let [selected? @(r/track is-selected? selected (:id data))]
    [:tr
     {:class (if selected? "danger")}
     [:td.col-md-1 (:id data)]
     [:td.col-md-4
      [:a {:on-click (fn [e] (on-click (:id data)))}
       (:label data)]]
     [:td.col-md-1
      [:a {:on-click (fn [e] (on-delete (:id data)))}
       [:span.glyphicon.glyphicon-remove
        {:aria-hidden "true"}]]]
     [:td.col-md-6]]))

(defn main []
  (let [id-atom (atom 0)
        data (r/atom [])
        selected (r/atom nil)
        run
        (fn run [_]
          (reset! data (vec (u/build-data id-atom 1000)))
          (reset! selected nil))
        run-lots
        (fn run-lots [_]
          (reset! data (vec (u/build-data id-atom 10000)))
          (reset! selected nil))
        add
        (fn add [_]
          (swap! data u/add id-atom))
        update-some
        (fn update-some []
          (swap! data u/update-some))
        clear
        (fn clear []
          (reset! selected nil)
          (reset! data []))
        swap-rows
        (fn swap-rows []
          (swap! data u/swap-rows))
        select
        (fn select [id]
          (reset! selected id))
        delete
        (fn delete [id]
          (swap! data u/delete-row id))]
    (fn []
      [:div.container
       [:div.jumbotron
        [:div.row
         [:div.col-md-6
          [:h1 "Reagent"]]
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
       [:table.table.table-hover.table-striped.test-data
        [:tbody
         (for [d @data]
           ^{:key (:id d)}
           [row
            d
            selected
            select
            delete])]]
       [:span.preloadicon.glyphicon.glyphicon-remove
        {:aria-hidden "true"}]])))

(rdom/render [main] (.getElementById js/document "main"))
