(ns demo.main
  (:require [helix.core :as hx :refer [defnc $]]
            [helix.dom :as d]
            [helix.hooks :as hooks :refer [use-state use-effect]]
            ["react-dom" :as rdom]
            [demo.utils :as u]))

(def start-time (atom nil))
(def last-measure (atom nil))

(defn start-measure [name]
  (reset! start-time (.now js/performance))
  (reset! last-measure name))

(defn stop-measure []
  (if-let [last @last-measure]
    (.setTimeout js/window
                 (fn []
                   (reset! last-measure nil)
                   (let [stop (.now js/performance)]
                     (.log js/console (str last " took " (- stop @start-time)))))
                 0)))


(defnc row [{:keys [data selected? on-click on-delete]}]
  (d/tr {:class (if selected? "danger")}
    (d/td {:class "col-md-1"}
          (:id data))
    (d/td {:class "col-md-4"}
          (d/a {:on-click (fn [e] (on-click (:id data)))}
               (:label data)))
    (d/td {:class "col-md-1"}
     (d/a {:on-click (fn [e] (on-delete (:id data)))}
          (d/span {:class "glyphicon glyphicon-remove"
                   :aria-hidden "true"})))
    (d/td {:class "col-md-6"})))

(defonce id-atom (atom 0))

(defnc main []
  (js/console.log "re-render")
  (let [[data set-data] (use-state [])
        [selected set-selected] (use-state nil)
        print-duration
        (fn print-duration []
          (stop-measure))
        run
        (fn run [_]
          (start-measure "run")
          (set-data (vec (u/build-data id-atom 1000)))
          (set-selected nil))
        run-lots
        (fn run-lots [_]
          (start-measure "runLots")
          (set-data (vec (u/build-data id-atom 10000)))
          (set-selected nil))
        add
        (fn add [_]
          (start-measure "add")
          (set-data u/add id-atom))
        update-some
        (fn update-some []
          (start-measure "update")
          (set-data u/update-some))
        clear
        (fn clear []
          (start-measure "clear")
          (set-selected nil)
          (set-data []))
        swap-rows
        (fn swap-rows []
          (start-measure "swapRows")
          (set-data u/swap-rows))
        select
        (fn select [id]
          (start-measure "select")
          (set-selected id))
        delete
        (fn delete [id]
          (start-measure "delete")
          (set-data u/delete-row id))]
    (use-effect :always
      (print-duration))
    (d/div
     {:class "container"}
     (d/div
      {:class "jumbotron"}
      (d/div
       {:class "row"}
       (d/div {:class "col-md-6"}
              (d/h1 (str "Helix (total rows " (count data) ")")))
       (d/div {:class "col-md-6"}
              (d/div {:class "row"}
                     (d/div {:class "col-sm-6 smallpad"}
                            (d/button {:class " btn btn-primary btn-block"
                                       :type "button"
                                       :id "run"
                                       :on-click run}
                                      "Create 1,000 rows"))
                     (d/div {:class "col-sm-6 smallpad"}
                            (d/button {:class "btn btn-primary btn-block"
                                       :type "button"
                                       :id "runlots"
                                       :on-click run-lots}
                                      "Create 10,000 rows"))
                     (d/div {:class "col-sm-6 smallpad"}
                            (d/button {:class "btn btn-primary btn-block"
                                       :type "button"
                                       :id "add"
                                       :on-click add}
                                      "Append 1,000 rows"))
                     (d/div {:class "col-sm-6 smallpad"}
                            (d/button {:class " btn btn-primary btn-block"
                                       :type "button"
                                       :id "update"
                                       :on-click update-some}
                                      "Update every 10th row"))
                     (d/div {:class "col-sm-6 smallpad"}
                            (d/button {:class "btn btn-primary btn-block"
                                      :type "button"
                                      :id "clear"
                                      :on-click clear}
                             "Clear"))
                     (d/div {:class "col-sm-6 smallpad"}
                            (d/button {:class "btn btn-primary btn-block"
                                       :type "button"
                                       :id "swaprows"
                                       :on-click swap-rows}
                                      "Swap rows"))))))
     (d/table {:class "table table-hover table-striped test-data"}
        (d/tbody
         (for [{:keys [id] :as d} data]
           ($ row {:key id
                   :data d
                   :selected? (identical? id selected)
                   :on-select select
                   :on-delete delete}))))
     (d/span {:class "preloadicon glyphicon glyphicon-remove"
              :aria-hidden "true"}))))

(defn init! []
  (rdom/render ($ main) (.getElementById js/document. "main")))

(defn after-reload []
  (init!))
