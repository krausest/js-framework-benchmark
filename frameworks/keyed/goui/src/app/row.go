package app

import (
	"main/src/data"
	"strconv"

	"github.com/twharmon/goui"
)

type RowProps struct {
	Selected bool
	SetState func(func(*AppState) *AppState)
	Item     *data.Item
}

func (rp RowProps) Key() string {
	return strconv.Itoa(rp.Item.ID)
}

func (rp RowProps) Memo() goui.Deps {
	return goui.Deps{rp.Selected, rp.Item.Label}
}

func Row(props RowProps) *goui.Node {
	id := props.Item.ID

	handleSelect := goui.UseCallback(func(*goui.MouseEvent) {
		props.SetState(func(state *AppState) *AppState {
			return &AppState{
				Selected: id,
				Items:    state.Items,
			}
		})
	}, goui.Deps{id})

	handleDelete := goui.UseCallback(func(*goui.MouseEvent) {
		props.SetState(func(state *AppState) *AppState {
			for i := range state.Items {
				if state.Items[i].ID == id {
					state.Items = append(state.Items[:i], state.Items[i+1:]...)
					return &AppState{
						Selected: state.Selected,
						Items:    state.Items,
					}
				}
			}
			return state
		})
	}, goui.Deps{id})

	trClass := ""
	if props.Selected {
		trClass = "danger"
	}

	return goui.Element("tr", &goui.Attributes{
		Class: trClass,
		Children: goui.Children{
			goui.Element("td", &goui.Attributes{
				Class:    "col-md-1",
				Children: goui.Children{goui.Text(strconv.Itoa(id))},
			}),
			goui.Element("td", &goui.Attributes{
				Class: "col-md-4",
				Children: goui.Children{
					goui.Element("a", &goui.Attributes{
						OnClick:  handleSelect,
						Children: goui.Children{goui.Text(props.Item.Label)},
					}),
				},
			}),
			goui.Element("td", &goui.Attributes{
				Class: "col-md-1",
				Children: goui.Children{
					goui.Element("a", &goui.Attributes{
						OnClick:  handleDelete,
						Children: trashIcon,
					}),
				},
			}),
			emptyTd,
		},
	})
}

var emptyTd = goui.Element("td", &goui.Attributes{Class: "col-md-6"})
var trashIcon = goui.Children{
	goui.Element("span", &goui.Attributes{
		Class:      "glyphicon glyphicon-remove",
		AriaHidden: true,
	}),
}
