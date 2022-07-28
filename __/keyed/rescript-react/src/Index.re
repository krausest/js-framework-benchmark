
switch(ReactDOM.querySelector("#main")){
| Some(root) => ReactDOM.render(<Main />, root)
| None => () // do nothing
}