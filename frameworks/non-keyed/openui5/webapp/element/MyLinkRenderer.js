/*!
 * ${copyright}
 */

sap.ui.define(
  [
    "sap/ui/core/Renderer",
    "sap/ui/core/library",
    "sap/ui/core/AccessKeysEnablement",
    "sap/ui/util/defaultLinkTypes",
    "sap/m/library",
    "sap/ui/core/Core",
  ],
  function (
    Renderer,
    coreLibrary,
    AccessKeysEnablement,
    defaultLinkTypes,
    mobileLibrary,
    Core
  ) {
    "use strict";

    // shortcut for sap.ui.core.TextDirection
    var TextDirection = coreLibrary.TextDirection;

    // shortcut for sap.ui.core.aria.HasPopup
    var AriaHasPopup = coreLibrary.aria.HasPopup;

    // shortcut for sap.m.LinkAccessibleRole
    var LinkAccessibleRole = mobileLibrary.LinkAccessibleRole;

    /**
     * Link renderer
     * @namespace
     */
    var MyLinkRenderer = {
      apiVersion: 2,
    };

    // shortcut for sap.m.EmptyIndicator
    var EmptyIndicatorMode = mobileLibrary.EmptyIndicatorMode;

    // shortcut for library resource bundle
    var oRb = Core.getLibraryResourceBundle("sap.m");

    /**
     * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
     *
     * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
     * @param {sap.m.List} oControl an object representation of the control that should be rendered
     */
    MyLinkRenderer.render = function (oRm, oControl) {
      var sTextDir = oControl.getTextDirection(),
        sTextAlign = Renderer.getTextAlign(oControl.getTextAlign(), sTextDir),
        bShouldHaveOwnLabelledBy = oControl._determineSelfReferencePresence(),
        sHasPopupType = oControl.getAriaHasPopup(),
        sRel = defaultLinkTypes(oControl.getRel(), oControl.getTarget()),
        sHref = oControl.getHref(),
        sAccessibleRole = oControl.getAccessibleRole(),
        oAccAttributes = {
          labelledby: bShouldHaveOwnLabelledBy
            ? { value: oControl.getId(), append: true }
            : undefined,
          haspopup:
            sHasPopupType === AriaHasPopup.None
              ? null
              : sHasPopupType.toLowerCase(),
        },
        bEnabled = oControl.getEnabled(),
        sTypeSemanticInfo = "",
        sAcccessKey = oControl.getProperty("accesskey");

      // Link is rendered as a "<a>" element
      oRm.openStart("a", oControl);

      oRm.class("sapMLnk");
      if (oControl.getSubtle()) {
        oRm.class("sapMLnkSubtle");
        sTypeSemanticInfo += oControl._sAriaLinkSubtleId;
      }

      if (oControl.getEmphasized()) {
        oRm.class("sapMLnkEmphasized");
        sTypeSemanticInfo += " " + oControl._sAriaLinkEmphasizedId;
      }

      if (sAcccessKey) {
        oRm.attr("data-ui5-accesskey", sAcccessKey);
      }

      switch (sAccessibleRole) {
        case LinkAccessibleRole.Button:
          oAccAttributes.role = LinkAccessibleRole.Button.toLowerCase();
          break;
        default:
          // Set a valid non empty value for the href attribute representing that there is no navigation,
          // so we don't confuse the screen readers.
          sHref =
            sHref && oControl._isHrefValid(sHref) && oControl.getEnabled()
              ? sHref
              : "#";
          oRm.attr("href", sHref);
      }

      oAccAttributes.describedby = sTypeSemanticInfo
        ? { value: sTypeSemanticInfo.trim(), append: true }
        : undefined;

      if (!bEnabled) {
        oRm.class("sapMLnkDsbl");
        oRm.attr("aria-disabled", "true");
      }
      oRm.attr("tabindex", oControl._getTabindex());

      if (oControl.getWrapping()) {
        oRm.class("sapMLnkWrapping");
      }

      if (
        oControl.getEmptyIndicatorMode() !== EmptyIndicatorMode.Off &&
        !oControl.getText()
      ) {
        oRm.class("sapMLinkContainsEmptyIdicator");
      }

      if (oControl.getTooltip_AsString()) {
        oRm.attr("title", oControl.getTooltip_AsString());
      }

      if (oControl.getTarget()) {
        oRm.attr("target", oControl.getTarget());
      }

      if (sRel) {
        oRm.attr("rel", sRel);
      }

      if (oControl.getWidth()) {
        oRm.style("width", oControl.getWidth());
      } else {
        oRm.class("sapMLnkMaxWidth");
      }

      if (sTextAlign) {
        oRm.style("text-align", sTextAlign);
      }

      // check if textDirection property is not set to default "Inherit" and add "dir" attribute
      if (sTextDir !== TextDirection.Inherit) {
        oRm.attr("dir", sTextDir.toLowerCase());
      }

      oControl.getDragDropConfig().forEach(function (oDNDConfig) {
        if (!oDNDConfig.getEnabled()) {
          oRm.attr("draggable", false);
        }
      });

      oRm.accessibilityState(oControl, oAccAttributes);
      // opening <a> tag
      oRm.openEnd();
      oRm.openStart("span");
      oRm.class("glyphicon");
      oRm.class("glyphicon-remove");
      oRm.openEnd();
      oRm.close("span");

      //   if (this.writeText) {
      //     this.writeText(oRm, oControl);
      //   } else {
      //     this.renderText(oRm, oControl);
      //   }

      oRm.close("a");
    };

    /**
     * Renders the normalized text property.
     *
     * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
     * @param {sap.m.Link} oControl An object representation of the control that should be rendered.
     */
    MyLinkRenderer.renderText = function (oRm, oControl) {
      var sText = oControl.getText();

      if (
        oControl.getEmptyIndicatorMode() !== EmptyIndicatorMode.Off &&
        !oControl.getText()
      ) {
        this.renderEmptyIndicator(oRm, oControl);
      } else {
        oRm.text(sText);
      }
    };

    /**
     * Renders the empty text indicator.
     *
     * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
     * @param {sap.m.Link} oLink An object representation of the control that should be rendered.
     */
    MyLinkRenderer.renderEmptyIndicator = function (oRm, oLink) {
      oRm.openStart("span");
      oRm.class("sapMEmptyIndicator");
      oRm.class("sapMLnkDsbl");
      if (oLink.getEmptyIndicatorMode() === EmptyIndicatorMode.Auto) {
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

    return MyLinkRenderer;
  },
  /* bExport= */ true
);
