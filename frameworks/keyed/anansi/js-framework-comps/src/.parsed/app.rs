pub fn app_mount (_node_id : String) { anansi_aux :: APP_STATE . with (| a | { let mut app_state = a . borrow_mut () ;
 let store = if let Some (state) = app_state . as_mut () { state } else { let mut contexts = std :: collections :: HashMap :: new () ;
 anansi_aux :: DOCUMENT . with (| document | { * app_state = anansi_aux :: get_state (& document , & mut contexts) ;
 }) ;
 anansi_aux :: CTX . with (| c | * c . borrow_mut () = contexts) ;
 app_state . as_mut () . unwrap () } ;
 { let rs = anansi_aux :: Obj :: Rs (std :: rc :: Rc :: new (std :: cell :: RefCell :: new (< anansi_aux :: Signal < RefVec < RowData > > > :: resume (store , 0usize)))) ;
 store . objs_mut () [0usize] = rs ;
 } { let rs = anansi_aux :: Obj :: Rs (std :: rc :: Rc :: new (std :: cell :: RefCell :: new (< anansi_aux :: Signal < Option < usize > > > :: resume (store , 1usize)))) ;
 store . objs_mut () [1usize] = rs ;
 } }) ;
 } fn app_on_click_0 () { { let mut _scope = anansi_aux :: lexical_scope () ;
 let mut data = _scope [0usize] . rf . borrow_mut () ;
 let data = data . downcast_mut :: < anansi_aux :: Signal < RefVec < RowData > > > () . expect ("problem restoring variable") ;
 let mut selected = _scope [1usize] . rf . borrow_mut () ;
 let selected = selected . downcast_mut :: < anansi_aux :: Signal < Option < usize > > > () . expect ("problem restoring variable") ;
 { build_data (data , 1_000) ;
 * selected . value_mut () = None ;
 } } app_set_render () ;
 } fn app_on_click_1 () { { let mut _scope = anansi_aux :: lexical_scope () ;
 let mut data = _scope [0usize] . rf . borrow_mut () ;
 let data = data . downcast_mut :: < anansi_aux :: Signal < RefVec < RowData > > > () . expect ("problem restoring variable") ;
 let mut selected = _scope [1usize] . rf . borrow_mut () ;
 let selected = selected . downcast_mut :: < anansi_aux :: Signal < Option < usize > > > () . expect ("problem restoring variable") ;
 { build_data (data , 10_000) ;
 * selected . value_mut () = None ;
 } } app_set_render () ;
 } fn app_on_click_2 () { { let mut _scope = anansi_aux :: lexical_scope () ;
 let mut data = _scope [0usize] . rf . borrow_mut () ;
 let data = data . downcast_mut :: < anansi_aux :: Signal < RefVec < RowData > > > () . expect ("problem restoring variable") ;
 { append_data (& mut data . value_mut () , 1_000) ;
 } } app_set_render () ;
 } fn app_on_click_3 () { { let mut _scope = anansi_aux :: lexical_scope () ;
 let mut data = _scope [0usize] . rf . borrow_mut () ;
 let data = data . downcast_mut :: < anansi_aux :: Signal < RefVec < RowData > > > () . expect ("problem restoring variable") ;
 { for mut row in data . value_mut () . iter_mut () . step_by (10) { row . label_mut () . push_str (" !!!") ;
 } } } app_set_render () ;
 } fn app_on_click_4 () { { let mut _scope = anansi_aux :: lexical_scope () ;
 let mut data = _scope [0usize] . rf . borrow_mut () ;
 let data = data . downcast_mut :: < anansi_aux :: Signal < RefVec < RowData > > > () . expect ("problem restoring variable") ;
 let mut selected = _scope [1usize] . rf . borrow_mut () ;
 let selected = selected . downcast_mut :: < anansi_aux :: Signal < Option < usize > > > () . expect ("problem restoring variable") ;
 { data . value_mut () . clear () ;
 * selected . value_mut () = None ;
 } } app_set_render () ;
 } fn app_on_click_5 () { { let mut _scope = anansi_aux :: lexical_scope () ;
 let mut data = _scope [0usize] . rf . borrow_mut () ;
 let data = data . downcast_mut :: < anansi_aux :: Signal < RefVec < RowData > > > () . expect ("problem restoring variable") ;
 { let value = data . value_mut () ;
 if value . len () > 998 { value . swap (1 , 998) ;
 } } } app_set_render () ;
 } fn app_on_click_6 () { { let mut _scope = anansi_aux :: lexical_scope () ;
 let _row = { let mut var = _scope [1usize] . rf . borrow_mut () ;
 let v = var . downcast_mut :: < anansi_aux :: Signal < RefVec < RowData > > > () . expect ("problem restoring refvec") ;
 v . value () . inner () [_scope [1usize] . index . expect ("problem getting reference index")] . clone () } ;
 let row = _row . borrow_mut () ;
 let mut selected = _scope [0usize] . rf . borrow_mut () ;
 let selected = selected . downcast_mut :: < anansi_aux :: Signal < Option < usize > > > () . expect ("problem restoring variable") ;
 { * selected . value_mut () = Some (* row . id ()) ;
 } } app_set_render () ;
 } fn app_on_click_7 () { { let mut _scope = anansi_aux :: lexical_scope () ;
 let _row = { let mut var = _scope [1usize] . rf . borrow_mut () ;
 let v = var . downcast_mut :: < anansi_aux :: Signal < RefVec < RowData > > > () . expect ("problem restoring refvec") ;
 v . value () . inner () [_scope [1usize] . index . expect ("problem getting reference index")] . clone () } ;
 let row = _row . borrow_mut () ;
 let mut data = _scope [0usize] . rf . borrow_mut () ;
 let data = data . downcast_mut :: < anansi_aux :: Signal < RefVec < RowData > > > () . expect ("problem restoring variable") ;
 { let value = data . value_mut () ;
 let id = * row . id () ;
 release ! (row) ;
 let pos = value . iter () . position (| r | { * r . id () == id }) . expect ("problem finding position") ;
 value . remove (pos) ;
 } } app_set_render () ;
 } fn app_render () -> Rsx { let mut _scope = anansi_aux :: lexical_scope () ;
 let mut data = _scope [0usize] . rf . borrow_mut () ;
 let data = data . downcast_mut :: < anansi_aux :: Signal < RefVec < RowData > > > () . expect ("problem restoring variable") ;
 let mut selected = _scope [1usize] . rf . borrow_mut () ;
 let selected = selected . downcast_mut :: < anansi_aux :: Signal < Option < usize > > > () . expect ("problem restoring variable") ;
 Rsx :: Component (Comp { children : { let mut _children = vec ! [] ;
 _children . push (element ! ("DIV" , attributes ! [("class" . to_string () , "container" . to_string ()) ,] , { let mut _children = vec ! [] ;
 _children . push (element ! ("DIV" , attributes ! [("class" . to_string () , "jumbotron" . to_string ()) ,] , { let mut _children = vec ! [] ;
 _children . push (element ! ("DIV" , attributes ! [("class" . to_string () , "row" . to_string ()) ,] , { let mut _children = vec ! [] ;
 _children . push (element ! ("DIV" , attributes ! [("class" . to_string () , "col-md-6" . to_string ()) ,] , { let mut _children = vec ! [] ;
 _children . push (element ! ("H1" , attributes ! [] , { let mut _children = vec ! [] ;
 _children . push (Rsx :: new_text ("Anansi" . to_string ())) ;
 _children })) ;
 _children })) ;
 _children . push (element ! ("DIV" , attributes ! [("class" . to_string () , "col-md-6" . to_string ()) ,] , { let mut _children = vec ! [] ;
 _children . push (element ! ("DIV" , attributes ! [("class" . to_string () , "row" . to_string ()) ,] , { let mut _children = vec ! [] ;
 _children . push (element ! ("DIV" , attributes ! [("class" . to_string () , "col-sm-6 smallpad" . to_string ()) ,] , { let mut _children = vec ! [] ;
 _children . push (element ! ("BUTTON" , attributes ! [("id" . to_string () , "run" . to_string ()) , ("class" . to_string () , "btn btn-primary btn-block" . to_string ()) , ("type" . to_string () , "button" . to_string ()) , ("on:click" . to_string () , format ! ("app_on_click_0[0 1]")) ,] , { let mut _children = vec ! [] ;
 _children . push (Rsx :: new_text ("Create 1,000 rows" . to_string ())) ;
 _children })) ;
 _children })) ;
 _children . push (element ! ("DIV" , attributes ! [("class" . to_string () , "col-sm-6 smallpad" . to_string ()) ,] , { let mut _children = vec ! [] ;
 _children . push (element ! ("BUTTON" , attributes ! [("id" . to_string () , "runlots" . to_string ()) , ("class" . to_string () , "btn btn-primary btn-block" . to_string ()) , ("type" . to_string () , "button" . to_string ()) , ("on:click" . to_string () , format ! ("app_on_click_1[0 1]")) ,] , { let mut _children = vec ! [] ;
 _children . push (Rsx :: new_text ("Create 10,000 rows" . to_string ())) ;
 _children })) ;
 _children })) ;
 _children . push (element ! ("DIV" , attributes ! [("class" . to_string () , "col-sm-6 smallpad" . to_string ()) ,] , { let mut _children = vec ! [] ;
 _children . push (element ! ("BUTTON" , attributes ! [("id" . to_string () , "add" . to_string ()) , ("class" . to_string () , "btn btn-primary btn-block" . to_string ()) , ("type" . to_string () , "button" . to_string ()) , ("on:click" . to_string () , format ! ("app_on_click_2[0]")) ,] , { let mut _children = vec ! [] ;
 _children . push (Rsx :: new_text ("Append 1,000 rows" . to_string ())) ;
 _children })) ;
 _children })) ;
 _children . push (element ! ("DIV" , attributes ! [("class" . to_string () , "col-sm-6 smallpad" . to_string ()) ,] , { let mut _children = vec ! [] ;
 _children . push (element ! ("BUTTON" , attributes ! [("id" . to_string () , "update" . to_string ()) , ("class" . to_string () , "btn btn-primary btn-block" . to_string ()) , ("type" . to_string () , "button" . to_string ()) , ("on:click" . to_string () , format ! ("app_on_click_3[0]")) ,] , { let mut _children = vec ! [] ;
 _children . push (Rsx :: new_text ("Update every 10th row" . to_string ())) ;
 _children })) ;
 _children })) ;
 _children . push (element ! ("DIV" , attributes ! [("class" . to_string () , "col-sm-6 smallpad" . to_string ()) ,] , { let mut _children = vec ! [] ;
 _children . push (element ! ("BUTTON" , attributes ! [("id" . to_string () , "clear" . to_string ()) , ("class" . to_string () , "btn btn-primary btn-block" . to_string ()) , ("type" . to_string () , "button" . to_string ()) , ("on:click" . to_string () , format ! ("app_on_click_4[0 1]")) ,] , { let mut _children = vec ! [] ;
 _children . push (Rsx :: new_text ("Clear" . to_string ())) ;
 _children })) ;
 _children })) ;
 _children . push (element ! ("DIV" , attributes ! [("class" . to_string () , "col-sm-6 smallpad" . to_string ()) ,] , { let mut _children = vec ! [] ;
 _children . push (element ! ("BUTTON" , attributes ! [("id" . to_string () , "swaprows" . to_string ()) , ("class" . to_string () , "btn btn-primary btn-block" . to_string ()) , ("type" . to_string () , "button" . to_string ()) , ("on:click" . to_string () , format ! ("app_on_click_5[0]")) ,] , { let mut _children = vec ! [] ;
 _children . push (Rsx :: new_text ("Swap Rows" . to_string ())) ;
 _children })) ;
 _children })) ;
 _children })) ;
 _children })) ;
 _children })) ;
 _children })) ;
 _children . push (element ! ("TABLE" , attributes ! [("class" . to_string () , "table table-hover table-striped test-data" . to_string ()) ,] , { let mut _children = vec ! [] ;
 _children . push (element ! ("TBODY" , attributes ! [] , { let mut _children = vec ! [] ;
 _children . push (anansi_aux :: Rsx :: new_keyed ({ let mut _keys = vec ! [] ;
 for row in data . value_mut () . iter_mut () { _keys . push (element ! ("TR" , attributes ! [("key" . to_string () , anansi_aux :: html_escape (& format ! ("{}" , row . id ()))) , ("class" . to_string () , if * selected . value () == Some (* row . id ()) { "danger" } else { "" } . to_string ()) ,] , { let mut _children = vec ! [] ;
 _children . push (element ! ("TD" , attributes ! [("class" . to_string () , "col-md-1" . to_string ()) ,] , { let mut _children = vec ! [] ;
 _children . push (Rsx :: new_text (anansi_aux :: html_escape (& format ! ("{}" , row . id ())))) ;
 _children })) ;
 _children . push (element ! ("TD" , attributes ! [("class" . to_string () , "col-md-4" . to_string ()) ,] , { let mut _children = vec ! [] ;
 _children . push (element ! ("A" , attributes ! [("on:click" . to_string () , format ! ("app_on_click_6[1 0-{}]" , row . pos ())) ,] , { let mut _children = vec ! [] ;
 _children . push (Rsx :: new_text (anansi_aux :: html_escape (& format ! ("{}" , row . label ())))) ;
 _children })) ;
 _children })) ;
 _children . push (element ! ("TD" , attributes ! [("class" . to_string () , "col-md-1" . to_string ()) ,] , { let mut _children = vec ! [] ;
 _children . push (element ! ("A" , attributes ! [("on:click" . to_string () , format ! ("app_on_click_7[0 0-{}]" , row . pos ())) ,] , { let mut _children = vec ! [] ;
 _children . push (element ! ("SPAN" , attributes ! [("class" . to_string () , "glyphicon glyphicon-remove" . to_string ()) , ("aria-hidden" . to_string () , "true" . to_string ()) ,] , { let mut _children = vec ! [] ;
 _children })) ;
 _children })) ;
 _children })) ;
 _children . push (element ! ("TD" , attributes ! [("class" . to_string () , "col-md-6" . to_string ()) ,] , { let mut _children = vec ! [] ;
 _children })) ;
 _children })) } _keys })) ;
 _children })) ;
 _children })) ;
 _children . push (element ! ("SPAN" , attributes ! [("class" . to_string () , "preloadicon glyphicon glyphicon-remove" . to_string ()) , ("aria-hidden" . to_string () , "true" . to_string ()) ,] , { let mut _children = vec ! [] ;
 _children })) ;
 _children })) ;
 _children } }) } fn app_set_render () { anansi_aux :: IDS . with (| ids | { let mut v = vec ! [] ;
 v . push (0usize . to_string ()) ;
 v . push (1usize . to_string ()) ;
 * ids . borrow_mut () = v ;
 }) ;
 let _rsx = app_render () ;
 anansi_aux :: rerender (_rsx) ;
 } pub struct App ;
 impl < 'c > anansi_aux :: components :: Component < 'c > for App { type Properties = anansi_aux :: EmptyProp ;
 fn init (_props : anansi_aux :: EmptyProp , _p : & mut anansi_aux :: components :: Pauser) -> String { let mut data = < anansi_aux :: Signal < RefVec < RowData > >> :: new (RefVec :: new ()) ;
 let mut selected = < anansi_aux :: Signal < Option < usize > >> :: new (None) ;
 let mut _c = String :: new () ;
 _c . push_str ("
        <div class=\"container\">
            <div class=\"jumbotron\"><div class=\"row\">
            <div class=\"col-md-6\"><h1>Anansi</h1></div>
            <div class=\"col-md-6\"><div class=\"row\">
                <div class=\"col-sm-6 smallpad\">
                    <button id=\"run\" class=\"btn btn-primary btn-block\" type=\"button\" ") ;
 _c . push_str (& format ! ("on:click=\"app_on_click_0[0 1]\" a:id=\"{}\"" , _p . add ())) ;
 _c . push_str (">Create 1,000 rows</button>
                </div>
                <div class=\"col-sm-6 smallpad\">
                    <button id=\"runlots\" class=\"btn btn-primary btn-block\" type=\"button\" ") ;
 _c . push_str (& format ! ("on:click=\"app_on_click_1[0 1]\" a:id=\"{}\"" , _p . add ())) ;
 _c . push_str (">Create 10,000 rows</button>
                </div>
                <div class=\"col-sm-6 smallpad\">
                    <button id=\"add\" class=\"btn btn-primary btn-block\" type=\"button\" ") ;
 _c . push_str (& format ! ("on:click=\"app_on_click_2[0]\" a:id=\"{}\"" , _p . add ())) ;
 _c . push_str (">Append 1,000 rows</button>
                </div>
                <div class=\"col-sm-6 smallpad\">
                    <button id=\"update\" class=\"btn btn-primary btn-block\" type=\"button\" ") ;
 _c . push_str (& format ! ("on:click=\"app_on_click_3[0]\" a:id=\"{}\"" , _p . add ())) ;
 _c . push_str (">Update every 10th row</button>
                </div>
                <div class=\"col-sm-6 smallpad\">
                    <button id=\"clear\" class=\"btn btn-primary btn-block\" type=\"button\" ") ;
 _c . push_str (& format ! ("on:click=\"app_on_click_4[0 1]\" a:id=\"{}\"" , _p . add ())) ;
 _c . push_str (">Clear</button>
                </div>
                <div class=\"col-sm-6 smallpad\">
                    <button id=\"swaprows\" class=\"btn btn-primary btn-block\" type=\"button\" ") ;
 _c . push_str (& format ! ("on:click=\"app_on_click_5[0]\" a:id=\"{}\"" , _p . add ())) ;
 _c . push_str (">Swap Rows</button>
                </div>
            </div></div>
            </div></div>
            <table class=\"table table-hover table-striped test-data\">
                <tbody>
                    ") ;
 for row in data . value_mut () . iter_mut () { _c . push_str ("
                        <tr key=") ;
 _c . push_str (& anansi_aux :: html_escape (& format ! ("{}" , row . id ()))) ;
 _c . push_str (" class=") ;
 if * selected . value () == Some (* row . id ()) { _c . push_str ("
                            ") ;
 _c . push_str ("danger") ;
 _c . push_str ("                        ") ;
 } else { _c . push_str ("
                            ") ;
 _c . push_str ("") ;
 _c . push_str ("                        ") ;
 } _c . push_str (">
                            <td class=\"col-md-1\">") ;
 _c . push_str (& anansi_aux :: html_escape (& format ! ("{}" , row . id ()))) ;
 _c . push_str ("</td>
                            <td class=\"col-md-4\"><a ") ;
 _c . push_str (& format ! ("on:click=\"app_on_click_6[0 0-{}]\" a:id=\"{}\"" , row . pos () , _p . add ())) ;
 _c . push_str (">") ;
 _c . push_str (& anansi_aux :: html_escape (& format ! ("{}" , row . label ()))) ;
 _c . push_str ("</a></td>
                            <td class=\"col-md-1\"><a ") ;
 _c . push_str (& format ! ("on:click=\"app_on_click_7[0 0-{}]\" a:id=\"{}\"" , row . pos () , _p . add ())) ;
 _c . push_str ("><span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span></a></td>
                            <td class=\"col-md-6\"/>
                        </tr>
                    ") ;
 } _c . push_str ("
                </tbody>
            </table>
            <span class=\"preloadicon glyphicon glyphicon-remove\" aria-hidden=\"true\"></span>
        </div>
    ") ;
 _p . push_subs (data . get_subs ()) ;
 _p . push_obj (serde_json :: to_string (& data . into_inner ()) . unwrap ()) ;
 _p . push_subs (selected . get_subs ()) ;
 _p . push_obj (serde_json :: to_string (& selected . into_inner ()) . unwrap ()) ;
 _c } } impl App { pub const CB : & 'static [(& 'static str , fn (String) , fn ())] = & [("app_on_click_0" , app_mount , app_on_click_0) , ("app_on_click_1" , app_mount , app_on_click_1) , ("app_on_click_2" , app_mount , app_on_click_2) , ("app_on_click_3" , app_mount , app_on_click_3) , ("app_on_click_4" , app_mount , app_on_click_4) , ("app_on_click_5" , app_mount , app_on_click_5) , ("app_on_click_6" , app_mount , app_on_click_6) , ("app_on_click_7" , app_mount , app_on_click_7)] ;
 pub fn restart (_props : anansi_aux :: EmptyProp) -> Rsx { app_render () } }