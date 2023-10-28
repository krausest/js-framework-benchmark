/*!
 * ${copyright}
 */

sap.ui.define(
  ["sap/m/library", "sap/ui/core/Lib"],
  function (library, Library) {
    "use strict";

    /**
     * ObjectIdentifier renderer.
     * @namespace
     */
    var MyObjectIdentifierRenderer = {
      apiVersion: 2,
    };

    // shortcut for sap.m.EmptyIndicator
    var EmptyIndicatorMode = library.EmptyIndicatorMode;

    // shortcut for library resource bundle
    var oRb = Library.getResourceBundleFor("sap.m");

    /**
     * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
     *
     * @param {sap.ui.core.RenderManager}
     *            oRm The RenderManager that can be used for writing to the render
     *            output buffer
     * @param {sap.m.ObjectIdentifier}
     *            oOI An object representation of the control that should be
     *            rendered
     */
    MyObjectIdentifierRenderer.render = function (oRm, oOI) {
      var sTooltip;

      // Return immediately if control is invisible
      if (!oOI.getVisible()) {
        return;
      }

      // write the HTML into the render manager
    };

    /**
     * Renders the empty text indicator.
     *
     * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
     * @param {sap.m.ObjectIdentifier} oOI An object representation of the control that should be rendered.
     */
    MyObjectIdentifierRenderer.renderEmptyIndicator = function (oRm, oOI) {
      oRm.openStart("span");
      oRm.class("sapMEmptyIndicator");
      if (oOI.getEmptyIndicatorMode() === EmptyIndicatorMode.Auto) {
        oRm.class("sapMEmptyIndicatorAuto");
      }
      oRm.openEnd();
      oRm.openStart("span");
      oRm.attr("aria-hidden", true);
      oRm.openEnd();
      oRm.text(oRb.getText("EMPTY_INDICATOR"));
      oRm.close("span");
      //Empty space text to be announced by screen readers
      oRm.openStart("span");
      oRm.class("sapUiPseudoInvisibleText");
      oRm.openEnd();
      oRm.text(oRb.getText("EMPTY_INDICATOR_TEXT"));
      oRm.close("span");
      oRm.close("span");
    };

    return MyObjectIdentifierRenderer;
  },
  /* bExport= */ true
);
