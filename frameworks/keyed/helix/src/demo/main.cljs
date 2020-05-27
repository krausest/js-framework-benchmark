(ns demo.main
  (:require [helix.core :as helix :refer [defnc $]]
            [helix.dom :as d]
            [helix.hooks :as hooks]
            ["react-dom" :as rdom]
            [demo.state :as s]))


(defnc jumbotron
  [{:keys [dispatch]}]
  {:wrap [(helix/memo)]}
  (d/div
   {:class "jumbotron"}
   (d/div
    {:class "row"}
    (d/div
     {:class "col-md-6"}
     (d/h1 "Helix"))
    (d/div
     {:class "col-md-6"}
     (d/div
      {:class "row"}
      (d/div
       {:class "col-sm-6 smallpad"}
       (d/button {:class " btn btn-primary btn-block"
                  :type "button"
                  :id "run"
                  :on-click #(dispatch [::s/run])}
        "Create 1,000 rows"))
      (d/div
       {:class "col-sm-6 smallpad"}
       (d/button {:class "btn btn-primary btn-block"
                  :type "button"
                  :id "runlots"
                  :on-click #(dispatch [::s/run-lots])}
        "Create 10,000 rows"))
      (d/div
       {:class "col-sm-6 smallpad"}
       (d/button {:class "btn btn-primary btn-block"
                  :type "button"
                  :id "add"
                  :on-click #(dispatch [::s/add])}
        "Append 1,000 rows"))
      (d/div
       {:class "col-sm-6 smallpad"}
       (d/button {:class " btn btn-primary btn-block"
                  :type "button"
                  :id "update"
                  :on-click #(dispatch [::s/update])}
        "Update every 10th row"))
      (d/div
       {:class "col-sm-6 smallpad"}
       (d/button {:class "btn btn-primary btn-block"
                  :type "button"
                  :id "clear"
                  :on-click #(dispatch [::s/clear])}
        "Clear"))
      (d/div
       {:class "col-sm-6 smallpad"}
       (d/button {:class "btn btn-primary btn-block"
                  :type "button"
                  :id "swaprows"
                  :on-click #(dispatch [::s/swap])}
        "Swap rows")))))))


(defnc row [{:keys [data selected? dispatch]}]
  {:wrap [(helix/memo)]}
  (d/tr
   {:class (if selected? "danger")
    :on-click #(dispatch [::s/select (:id data)])}
   (d/td {:class "col-md-1"}
         (:id data))
   (d/td {:class "col-md-4"}
         (d/a (:label data)))
   (d/td
    {:class "col-md-1"}
    (d/a
     {:on-click #(dispatch [::s/delete (:id data)])}
     (d/span {:class "glyphicon glyphicon-remove"
              :aria-hidden "true"})))
   (d/td {:class "col-md-6"})))


(defnc main []
  (let [[{:keys [data selected]} dispatch] (hooks/use-reducer
                                            s/state-reducer
                                            s/initial-state)]
    (d/div
     {:class "container"}
     ($ jumbotron {:dispatch dispatch})
     (d/table
      {:class "table table-hover table-striped test-data"}
      (d/tbody
       (for [{:keys [id] :as d} data]
         ($ row {:key id
                 :data d
                 :selected? (identical? id selected)
                 :dispatch dispatch}))))
     (d/span {:class "preloadicon glyphicon glyphicon-remove"
              :aria-hidden "true"}))))

(defn init! []
  (rdom/render ($ main) (.getElementById js/document. "main")))

(defn after-reload []
  (init!))
