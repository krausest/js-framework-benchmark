/*!
 * ${copyright}
 */

sap.ui.define(
  [
    "sap/ui/core/Renderer",
    "sap/ui/core/library",
    "sap/ui/core/Core",
    "sap/ui/Device",
    "sap/base/Log",
    "sap/m/library",
    "sap/m/ListItemBaseRenderer",
  ],
  function (
    Renderer,
    coreLibrary,
    Core,
    Device,
    Log,
    library,
    ListItemBaseRenderer
  ) {
    "use strict";

    // shortcut for sap.m.PopinDisplay
    var PopinDisplay = library.PopinDisplay;

    // shortcut for sap.ui.core.VerticalAlign
    var VerticalAlign = coreLibrary.VerticalAlign;

    /**
     * ColumnListItem renderer.
     * @namespace
     */
    var MyColumnListItemRenderer = Renderer.extend(ListItemBaseRenderer);
    MyColumnListItemRenderer.apiVersion = 2;

    /**
     * Renders the HTML for the given control, using the provided
     * {@link sap.ui.core.RenderManager}.
     *
     * @param {sap.ui.core.RenderManager} rm
     *            RenderManager that can be used to render the control's DOM
     * @param {sap.m.ColumnListItem} oLI
     *            The item to be rendered
     */
    MyColumnListItemRenderer.render = function (rm, oLI) {
      var oTable = oLI.getTable();
      if (!oTable) {
        return;
      }

      ListItemBaseRenderer.render.apply(this, arguments);

      if (oLI.getVisible() && oTable.hasPopin()) {
        this.renderPopin(rm, oLI, oTable);
      }
    };

    MyColumnListItemRenderer.makeFocusable = function (rm) {
      if (Device.system.desktop) {
        rm.attr("tabindex", "-1");
        rm.class("sapMTblCellFocusable");
      }
    };

    MyColumnListItemRenderer.openStartGridCell = function (
      rm,
      oLI,
      sTag,
      sId,
      sClass
    ) {
      rm.openStart(sTag, sId);
      rm.class(sClass);
      rm.attr("role", "gridcell");
      rm.attr("aria-colindex", oLI.aAriaOwns.push(sId));
      this.makeFocusable(rm);
      if (oLI.isSelectable()) {
        rm.attr("aria-selected", oLI.getSelected());
      }
      return rm;
    };

    // render type highlight always within a cell
    MyColumnListItemRenderer.renderHighlight = function (rm, oLI) {};

    MyColumnListItemRenderer.renderNavigated = function (rm, oLI) {};

    // render type content always within a cell
    MyColumnListItemRenderer.renderType = function (rm, oLI) {
      var oTable = oLI.getTable();
      if (!oTable || !oTable.doItemsNeedTypeColumn()) {
        return;
      }

      this.openStartGridCell(
        rm,
        oLI,
        "td",
        oLI.getId() + "-TypeCell",
        "sapMListTblNavCol"
      ).openEnd();

      // let the list item base render the type
      ListItemBaseRenderer.renderType.apply(this, arguments);

      rm.close("td");
    };

    // wrap mode content with a cell
    MyColumnListItemRenderer.renderModeContent = function (rm, oLI) {
      this.openStartGridCell(
        rm,
        oLI,
        "td",
        oLI.getId() + "-ModeCell",
        "sapMListTblSelCol"
      ).openEnd();

      // let the list item base render the mode control
      ListItemBaseRenderer.renderModeContent.apply(this, arguments);

      rm.close("td");
    };

    // ColumnListItem does not respect counter property of the LIB
    MyColumnListItemRenderer.renderCounter = function (rm, oLI) {};

    // Returns aria accessibility role
    MyColumnListItemRenderer.getAriaRole = function (oLI) {
      return "row";
    };

    MyColumnListItemRenderer.getAccessbilityPosition = function (oLI) {
      var oTable = oLI.getTable();
      if (oTable) {
        var iRowIndex =
          oTable.getVisibleItems().indexOf(oLI) + oTable.hasHeaderRow() + 1;
        return {
          rowindex: iRowIndex,
        };
      }
    };

    MyColumnListItemRenderer.renderLIAttributes = function (rm, oLI) {
      rm.class("sapMListTblRow");
      var vAlign = oLI.getVAlign();
      if (vAlign != VerticalAlign.Inherit) {
        rm.class("sapMListTblRow" + vAlign);
      }

      var oTable = oLI.getTable();
      if (oTable) {
        if (oTable.getAlternateRowColors()) {
          rm.class("sapMListTblRowAlternate");
        }
      }
    };

    /**
     * Overwriting hook method of ListItemBase
     *
     * @public
     *
     * @param {sap.ui.core.RenderManager} rm RenderManager
     * @param {sap.m.ListItemBase} oLI List item
     */
    MyColumnListItemRenderer.renderLIContentWrapper = function (rm, oLI) {
      var oTable = oLI.getTable();
      if (!oTable) {
        return;
      }

      var aColumns = oTable.getColumns(true),
        aCells = oLI.getCells();

      // remove cloned headers
      oLI._destroyClonedHeaders();

      aColumns.forEach(function (oColumn, iColumnIndex) {
        if (!oColumn.getVisible() || oColumn.isHidden()) {
          return;
        }

        var aStyleClass = oColumn.getStyleClass().split(" ").filter(Boolean),
          sCellId = oLI.getId() + "-cell" + iColumnIndex,
          oCell = aCells[oColumn.getInitialOrder()],
          vAlign = oColumn.getVAlign(),
          bRenderCell = true;

        this.openStartGridCell(rm, oLI, "td", sCellId, "sapMListTblCell");
        rm.attr("data-sap-ui-column", oColumn.getId());
        rm.style("text-align", oColumn.getCssAlign());
        aStyleClass.forEach(function (sClassName) {
          rm.class(sClassName);
        });
        if (vAlign != VerticalAlign.Inherit) {
          rm.style("vertical-align", vAlign.toLowerCase());
        }

        // merge duplicate cells
        if (oCell && !oTable.hasPopin() && oColumn.getMergeDuplicates()) {
          var sFuncWithParam = oColumn.getMergeFunctionName(),
            aFuncWithParam = sFuncWithParam.split("#"),
            sFuncParam = aFuncWithParam[1],
            sFuncName = aFuncWithParam[0];

          if (typeof oCell[sFuncName] != "function") {
            Log.warning(
              "mergeFunctionName property is defined on " +
                oColumn +
                " but this is not function of " +
                oCell
            );
          } else if (oTable._bRendering || !oCell.bOutput) {
            var vLastColumnValue = oColumn.getLastValue(),
              vCellValue = oCell[sFuncName](sFuncParam);

            if (vLastColumnValue === vCellValue) {
              // it is not necessary to render the cell content but screen readers need the content to announce it
              bRenderCell = Core.getConfiguration().getAccessibility();
              oCell.addStyleClass("sapMListTblCellDupCnt");
              rm.class("sapMListTblCellDup");
            } else {
              oColumn.setLastValue(vCellValue);
            }
          } else if (oCell.hasStyleClass("sapMListTblCellDupCnt")) {
            rm.class("sapMListTblCellDup");
          }
        }

        rm.openEnd();

        if (oCell && bRenderCell) {
          this.applyAriaLabelledBy(oColumn.getHeader(), oCell, true);
          rm.renderControl(oCell);
        }

        rm.close("td");
      }, this);
    };

    MyColumnListItemRenderer.renderDummyCell = function (rm, oTable) {
      rm.openStart("td");
      rm.class("sapMListTblDummyCell");
      rm.attr("role", "presentation");
      rm.openEnd();
      rm.close("td");
    };

    MyColumnListItemRenderer.applyAriaLabelledBy = function (
      oHeader,
      oCell,
      bRemove
    ) {
      if (
        !oHeader ||
        !oHeader.getText ||
        !oHeader.getVisible() ||
        !oCell.getAriaLabelledBy
      ) {
        return;
      }

      if (bRemove) {
        oCell.removeAriaLabelledBy(oHeader);
      } else if (!oCell.getAriaLabelledBy().includes(oHeader.getId())) {
        oCell.addAriaLabelledBy(oHeader);
      }
    };

    /**
     * Renders pop-ins for Table Rows
     *
     * @private
     *
     * @param {sap.ui.core.RenderManager} rm RenderManager
     * @param {sap.m.ListItemBase} oLI List item
     * @param {sap.m.Table} oTable Table control
     */
    MyColumnListItemRenderer.renderPopin = function (rm, oLI, oTable) {
      // popin row
      rm.openStart("tr", oLI.getPopin());
      rm.class("sapMListTblSubRow");
      rm.attr("role", "none");
      rm.attr("tabindex", "-1");
      rm.attr("data-sap-ui-related", oLI.getId());
      rm.openEnd();

      this.renderHighlight(rm, oLI);

      // cell
      rm.openStart("td", oLI.getId() + "-subcell");
      rm.class("sapMListTblSubRowCell");
      rm.attr("role", "none");
      rm.attr(
        "colspan",
        oTable.getColCount() -
          2 /* Highlight and Navigated cells are always rendered in popin */
      );
      rm.openEnd();

      // container
      this.openStartGridCell(
        rm,
        oLI,
        "div",
        oLI.getId() + "-subcont",
        "sapMListTblSubCnt"
      );
      rm.class("sapMListTblSubCnt" + oTable.getPopinLayout());
      rm.openEnd();

      var aCells = oLI.getCells(),
        aColumns = oTable.getColumns(true);

      aColumns.forEach(function (oColumn) {
        if (!oColumn.getVisible() || !oColumn.isPopin()) {
          return;
        }

        var oCell = aCells[oColumn.getInitialOrder()];
        var oHeader = oColumn.getHeader();
        if (!oHeader && !oCell) {
          return;
        }

        var aStyleClass = oColumn.getStyleClass().split(" ").filter(Boolean),
          sPopinDisplay = oColumn.getPopinDisplay(),
          oOriginalHeader = oHeader;

        /* row start */
        rm.openStart("div");
        rm.class("sapMListTblSubCntRow");
        if (sPopinDisplay == PopinDisplay.Inline) {
          rm.class("sapMListTblSubCntRowInline");
        }
        aStyleClass.forEach(function (sClassName) {
          rm.class(sClassName);
        });
        rm.openEnd();

        /* header cell */
        if (oHeader && sPopinDisplay != PopinDisplay.WithoutHeader) {
          rm.openStart("div").class("sapMListTblSubCntHdr").openEnd();
          if (oTable._aPopinHeaders.indexOf(oHeader) === -1) {
            oTable._aPopinHeaders.push(oOriginalHeader);
          }
          oHeader = oHeader.clone();
          oColumn.addDependent(oHeader);
          oLI._addClonedHeader(oHeader);
          rm.renderControl(oHeader);
          rm.openStart("span").class("sapMListTblSubCntSpr");
          rm.attr(
            "data-popin-colon",
            Core.getLibraryResourceBundle("sap.m").getText(
              "TABLE_POPIN_LABEL_COLON"
            )
          );
          rm.openEnd().close("span");
          rm.close("div");
        }

        /* value cell */
        if (oCell) {
          rm.openStart("div");
          rm.class("sapMListTblSubCntVal");
          rm.class("sapMListTblSubCntVal" + sPopinDisplay);
          rm.openEnd();
          this.applyAriaLabelledBy(oOriginalHeader, oCell);
          rm.renderControl(oCell);
          rm.close("div");
        }

        /* row end */
        rm.close("div");
      }, this);

      // container
      rm.close("div");

      // cell
      rm.close("td");

      this.renderNavigated(rm, oLI);

      // popin row
      rm.close("tr");
    };

    /**
     * Overwriting hook method of ListItemBase.
     *
     * @param {sap.ui.core.RenderManager} rm RenderManager
     * @param {sap.m.ListItemBase} [oLI] List item
     */
    MyColumnListItemRenderer.addLegacyOutlineClass = function (rm, oLI) {
      var oTable = oLI.getTable();
      if (oTable) {
        if (oTable.hasPopin() || oTable.shouldRenderDummyColumn()) {
          rm.class("sapMTableRowCustomFocus");
        }
      }
    };

    MyColumnListItemRenderer.renderContentLatter = function (rm, oLI) {
      var oTable = oLI.getTable();
      if (oTable && oTable.shouldRenderDummyColumn()) {
        if (!oTable.hasPopin()) {
          ListItemBaseRenderer.renderContentLatter.apply(this, arguments);
          MyColumnListItemRenderer.renderDummyCell(rm, oTable);
        } else {
          MyColumnListItemRenderer.renderDummyCell(rm, oTable);
          ListItemBaseRenderer.renderContentLatter.apply(this, arguments);
        }
      } else {
        ListItemBaseRenderer.renderContentLatter.apply(this, arguments);
      }
    };

    return MyColumnListItemRenderer;
  },
  /* bExport= */ true
);
