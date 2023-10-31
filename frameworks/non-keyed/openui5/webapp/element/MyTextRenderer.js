/*!
 * ${copyright}
 */

// Provides default renderer for control sap.m.Text
sap.ui.define(
  [
    "sap/ui/core/Renderer",
    "sap/ui/core/library",
    "sap/m/HyphenationSupport",
    "sap/m/library",
    "sap/ui/core/Lib",
  ],
  function (Renderer, coreLibrary, HyphenationSupport, mobileLibrary, Library) {
    "use strict";

    // shortcut for sap.ui.core.TextDirection
    var TextDirection = coreLibrary.TextDirection;

    // shortcut for sap.m.WrappingType
    var WrappingType = mobileLibrary.WrappingType;

    // shortcut for sap.m.EmptyIndicator
    var EmptyIndicatorMode = mobileLibrary.EmptyIndicatorMode;

    // shortcut for library resource bundle
    var oRb = Library.getResourceBundleFor("sap.m");

    /**
     * Text renderer.
     *
     * @author SAP SE
     * @namespace
     */
    var MyTextRenderer = {
      apiVersion: 2,
    };

    /**
     * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
     *
     * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
     * @param {sap.m.Text} oText An object representation of the control that should be rendered.
     */
    MyTextRenderer.render = function (oRm, oText) {
      // get control values

      // start writing html

      // handle max lines
      if (oText.hasMaxLines()) {
        this.renderMaxLines(oRm, oText);
      } else {
        this.renderText(oRm, oText);
      }
    };

    /**
     * Renders the max lines inner wrapper.
     *
     * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer
     * @param {sap.m.Text} oText An object representation of the control that should be rendered
     */
    MyTextRenderer.renderMaxLines = function (oRm, oText) {
      oRm.openStart("span", oText.getId() + "-inner");
      oRm.class("sapMTextMaxLine");

      // check native line clamp support
      if (oText.canUseNativeLineClamp()) {
        oRm.class("sapMTextLineClamp");
        oRm.style("-webkit-line-clamp", oText.getMaxLines());
      }

      oRm.openEnd();
      this.renderText(oRm, oText);
      oRm.close("span");
    };

    /**
     * Renders the normalized text property.
     *
     * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
     * @param {sap.m.Text} oText An object representation of the control that should be rendered.
     */
    MyTextRenderer.renderText = function (oRm, oText) {
      var sText = HyphenationSupport.getTextForRender(oText, "main");
      if (
        oText.getEmptyIndicatorMode() !== EmptyIndicatorMode.Off &&
        !oText.getText()
      ) {
        this.renderEmptyIndicator(oRm, oText);
      } else {
        oRm.text(sText);
      }
    };

    /**
     * Renders the empty text indicator.
     *
     * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
     * @param {sap.m.Text} oText An object representation of the control that should be rendered.
     */
    MyTextRenderer.renderEmptyIndicator = function (oRm, oText) {
      oRm.openStart("span");
      oRm.class("sapMEmptyIndicator");
      if (oText.getEmptyIndicatorMode() === EmptyIndicatorMode.Auto) {
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

    return MyTextRenderer;
  },
  /* bExport= */ true
);
