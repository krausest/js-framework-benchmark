/*!
 * ${copyright}
 */

// Provides control sap.m.Link.
sap.ui.define(
  [
    "sap/m/library",
    "sap/ui/core/Core",
    "sap/ui/core/Control",
    "sap/ui/core/InvisibleText",
    "sap/ui/core/EnabledPropagator",
    "sap/ui/core/AccessKeysEnablement",
    "sap/ui/core/LabelEnablement",
    "sap/ui/core/library",
    "sap/ui/Device",
    "./MyLinkRenderer",
    "sap/ui/events/KeyCodes",
    "sap/base/security/URLListValidator",
  ],
  function (
    library,
    Core,
    Control,
    InvisibleText,
    EnabledPropagator,
    AccessKeysEnablement,
    LabelEnablement,
    coreLibrary,
    Device,
    MyLinkRenderer,
    KeyCodes,
    URLListValidator
  ) {
    "use strict";

    // shortcut for sap.ui.core.TextDirection
    var TextDirection = coreLibrary.TextDirection;

    // shortcut for sap.ui.core.TextAlign
    var TextAlign = coreLibrary.TextAlign;

    // shortcut for sap.ui.core.aria.HasPopup
    var AriaHasPopup = coreLibrary.aria.HasPopup;

    // shortcut for sap.m.LinkAccessibleRole
    var LinkAccessibleRole = library.LinkAccessibleRole;

    // shortcut for sap.m.EmptyIndicator
    var EmptyIndicatorMode = library.EmptyIndicatorMode;

    /**
     * Constructor for a new <code>Link</code>.
     *
     * @param {string} [sId] ID for the new control, generated automatically if no ID is given
     * @param {object} [mSettings] Initial settings for the new control
     *
     * @class
     * A hyperlink control used to navigate to other apps and web pages or to trigger actions.
     *
     * <h3>Overview</h3>
     *
     * The <code>Link</code> control is a clickable text element visualized in such a way that it stands out
     * from the standard text. On hover, it changes its style to underlined text to provide
     * additional feedback to the user.
     *
     * <h3>Usage</h3>
     *
     * You can set the <code>Link</code> to be enabled or disabled.
     *
     * To create a visual hierarchy in large lists of links, you can set the less important links as
     * <code>subtle</code> or the more important ones as <code>emphasized</code>.
     *
     * To specify where the linked content is opened, you can use the <code>target</code> property.
     *
     * <h3>Responsive behavior</h3>
     *
     * If there is not enough space, the text of the <code>Link</code> becomes truncated.
     * If the <code>wrapping</code> property is set to <code>true</code>, the text will be
     * displayed on several lines, instead of being truncated.
     *
     * @see {@link fiori:https://experience.sap.com/fiori-design-web/link/ Link}
     *
     * @extends sap.ui.core.Control
     * @implements sap.ui.core.IShrinkable, sap.ui.core.IFormContent, sap.ui.core.ITitleContent, sap.ui.core.IAccessKeySupport
     *
     * @author SAP SE
     * @version ${version}
     *
     * @constructor
     * @public
     * @since 1.12
     * @alias sap.m.Link
     */
    var MyLink = Control.extend(
      "sap.m.Link",
      /** @lends sap.m.Link.prototype */ {
        metadata: {
          interfaces: [
            "sap.ui.core.IShrinkable",
            "sap.ui.core.IFormContent",
            "sap.ui.core.ITitleContent",
            "sap.ui.core.IAccessKeySupport",
            "sap.m.IToolbarInteractiveControl",
          ],
          library: "sap.m",
          designtime: "sap/m/designtime/Link.designtime",
          properties: {
            /**
             * Defines the displayed link text.
             */
            text: { type: "string", group: "Data", defaultValue: "" },

            /**
             * Determines whether the link can be triggered by the user.
             */
            enabled: { type: "boolean", group: "Behavior", defaultValue: true },

            /**
             * Specifies a target where the linked content will open.
             *
             * Options are the standard values for window.open() supported by browsers:
             * <code>_self</code>, <code>_top</code>, <code>_blank</code>, <code>_parent</code>, <code>_search</code>.
             * Alternatively, a frame name can be entered. This property is only used when the <code>href</code> property is set.
             */
            target: { type: "string", group: "Behavior", defaultValue: null },

            /**
             * Specifies the value of the HTML <code>rel</code> attribute.
             *
             * <b>Note:</b> A default value of <code>noopener noreferrer</code> is set only to links that have a cross-origin URL
             * and a specified <code>target</code> with value other than <code>_self</code>.
             * @since 1.84
             */
            rel: { type: "string", group: "Behavior", defaultValue: null },

            /**
             * Determines the width of the link (CSS-size such as % or px). When it is set, this is the exact size.
             * When left blank, the text defines the size.
             */
            width: {
              type: "sap.ui.core.CSSSize",
              group: "Dimension",
              defaultValue: null,
            },

            /**
             * Defines the link target URI. Supports standard hyperlink behavior.
             * <b>Note:</b> Don't set <code>href</code> property if an action should be triggered by the link. Instead set <code>accessibleRole</code>
             * property to <code>LinkAccessibleRole.Button</code> and register a <code>press</code> event handler.
             */
            href: {
              type: "sap.ui.core.URI",
              group: "Data",
              defaultValue: null,
            },

            /**
             * Defines whether the link target URI should be validated.
             *
             * If validation fails, the value of the <code>href</code> property will still be set, but will not be applied to the DOM.
             *
             * <b>Note:</b> Additional URLs are allowed through
             * {@link module:sap/base/security/URLListValidator URLListValidator}.
             *
             * @since 1.54.0
             */
            validateUrl: {
              type: "boolean",
              group: "Data",
              defaultValue: false,
            },

            /**
             * Determines whether the link text is allowed to wrap when there is no sufficient space.
             */
            wrapping: {
              type: "boolean",
              group: "Appearance",
              defaultValue: false,
            },

            /**
             * Determines the horizontal alignment of the text.
             * @since 1.28.0
             */
            textAlign: {
              type: "sap.ui.core.TextAlign",
              group: "Appearance",
              defaultValue: TextAlign.Initial,
            },

            /**
             * This property specifies the element's text directionality with enumerated options. By default, the control inherits text direction from the parent DOM.
             * @since 1.28.0
             */
            textDirection: {
              type: "sap.ui.core.TextDirection",
              group: "Appearance",
              defaultValue: TextDirection.Inherit,
            },

            /**
             * Subtle links look more like standard text than like links. They should only be used to help with visual hierarchy between large data lists of important and less important links. Subtle links should not be used in any other use case.
             * @since 1.22
             */
            subtle: { type: "boolean", group: "Behavior", defaultValue: false },

            /**
             * Emphasized links look visually more important than regular links.
             * @since 1.22
             */
            emphasized: {
              type: "boolean",
              group: "Behavior",
              defaultValue: false,
            },

            /**
             * Specifies the value of the <code>aria-haspopup</code> attribute
             *
             * If the value is <code>None</code>, the attribute will not be rendered. Otherwise it will be rendered according to the selected value.
             *
             * NOTE: Use this property only when a link is related to a popover/popup. The value needs to be equal to the main/root role of the popup - e.g. dialog,
             * menu or list (examples: if you have dialog -> dialog, if you have menu -> menu; if you have list -> list; if you have dialog containing a list -> dialog).
             * Do not use it, if you open a standard sap.m.Dialog, MessageBox or other type of dialogs displayed as on overlay over the application.
             *
             * @since 1.86.0
             */
            ariaHasPopup: {
              type: "sap.ui.core.aria.HasPopup",
              group: "Accessibility",
              defaultValue: AriaHasPopup.None,
            },

            /**
             * Describes the accessibility role of the link:<ul>
             * <li><code>LinkAccessibleRole.Default</code> - a navigation is expected to the location given in <code>href</code> property</li>
             * <li><code>LinkAccessibleRole.Button</code> - there will be <code>role</code> attribute with value "Button" rendered. In this scenario the <code>href</code>
             * property value shouldn't be set as navigation isn't expected to occur.</li></ul>
             *
             * @since 1.104.0
             */
            accessibleRole: {
              type: "sap.m.LinkAccessibleRole",
              group: "Accessibility",
              defaultValue: LinkAccessibleRole.Default,
            },

            /**
             * Specifies if an empty indicator should be displayed when there is no text.
             *
             * @since 1.89
             */
            emptyIndicatorMode: {
              type: "sap.m.EmptyIndicatorMode",
              group: "Appearance",
              defaultValue: EmptyIndicatorMode.Off,
            },

            /**
             * Indicates whether the access keys ref of the control should be highlighted.
             * NOTE: this property is used only when access keys feature is turned on.
             *
             * @private
             */
            highlightAccKeysRef: {
              type: "boolean",
              defaultValue: false,
              visibility: "hidden",
            },

            /**
             * Indicates which keyboard key should be pressed to focus the access key ref
             * NOTE: this property is used only when access keys feature is turned on.
             *
             * @private
             */
            accesskey: {
              type: "string",
              defaultValue: "",
              visibility: "hidden",
            },
          },
          associations: {
            /**
             * Association to controls / ids which describe this control (see WAI-ARIA attribute aria-describedby).
             */
            ariaDescribedBy: {
              type: "sap.ui.core.Control",
              multiple: true,
              singularName: "ariaDescribedBy",
            },

            /**
             * Association to controls / ids which label this control (see WAI-ARIA attribute aria-labelledby).
             */
            ariaLabelledBy: {
              type: "sap.ui.core.Control",
              multiple: true,
              singularName: "ariaLabelledBy",
            },
          },
          events: {
            /**
             * Event is fired when the user triggers the link control.
             */
            press: {
              allowPreventDefault: true,
              parameters: {
                /**
                 * Indicates whether the CTRL key was pressed when the link was selected.
                 * @since 1.58
                 */
                ctrlKey: { type: "boolean" },
                /**
                 * Indicates whether the "meta" key was pressed when the link was selected.
                 *
                 * On Macintosh keyboards, this is the command key (⌘).
                 * On Windows keyboards, this is the windows key (⊞).
                 *
                 * @since 1.58
                 */
                metaKey: { type: "boolean" },
              },
            },
          },
          dnd: { draggable: true, droppable: false },
        },

        renderer: MyLinkRenderer,
      }
    );

    EnabledPropagator.call(MyLink.prototype); // inherit "disabled" state from parent controls

    MyLink.prototype.init = function () {
      AccessKeysEnablement.registerControl(this);
    };

    /**
     * Required adaptations before rendering.
     *
     * @private
     */
    MyLink.prototype.onBeforeRendering = function () {};

    MyLink.prototype.getAccessKeysFocusTarget = function () {
      return this.getFocusDomRef();
    };

    MyLink.prototype.onAccKeysHighlightStart = function () {
      setRefLabelsHighlightAccKeysRef.call(this, true);
    };

    MyLink.prototype.onAccKeysHighlightEnd = function () {
      setRefLabelsHighlightAccKeysRef.call(this, false);
    };

    MyLink.prototype.onAfterRendering = function () {
      if (Device.system.phone || Device.system.tablet) {
        var oAnchorElement = this.getDomRef();
        // TODO: Adjust sap.m.internal.ObjectMarkerCustomMyLink rendering part of the sap.m.ObjectMarker implementation
        if (!oAnchorElement) {
          return;
        }
        oAnchorElement.removeEventListener("click", this._onClick);
        if (oAnchorElement.getAttribute("href") == "#") {
          oAnchorElement.addEventListener("click", this._onClick);
        }
      }
    };

    MyLink.prototype.exit = function () {
      if (Device.system.phone || Device.system.tablet) {
        var oAnchorElement = this.getDomRef();
        if (!oAnchorElement) {
          return;
        }
        oAnchorElement.removeEventListener("click", this._onClick);
      }
    };

    MyLink.prototype._onClick = function (oEvent) {
      oEvent.preventDefault();
    };

    /**
     * Handle the key down event for SPACE
     * SHIFT or ESCAPE on pressed SPACE cancels the action
     *
     * @param {jQuery.Event} oEvent The SPACE keyboard key event object
     */
    MyLink.prototype.onkeydown = function (oEvent) {
      if (
        oEvent.which === KeyCodes.SPACE ||
        oEvent.which === KeyCodes.SHIFT ||
        oEvent.which === KeyCodes.ESCAPE
      ) {
        // set inactive state of the button and marked ESCAPE or SHIFT as pressed only if SPACE was pressed before it
        if (oEvent.which === KeyCodes.SPACE) {
          if (this.getEnabled() || this.getHref()) {
            // mark the event for components that needs to know if the event was handled by the MyLink
            oEvent.setMarked();
            oEvent.preventDefault();
            this._bPressedSpace = true;
          }
        }

        if (
          this._bPressedSpace &&
          (oEvent.which === KeyCodes.ESCAPE || oEvent.which === KeyCodes.SHIFT)
        ) {
          this._bPressedEscapeOrShift = true;
        }
      } else {
        if (this._bPressedSpace) {
          oEvent.preventDefault();
        }
      }
    };

    /**
     * Handle the key up event for SPACE.
     *
     * @param {jQuery.Event} oEvent - the keyboard event.
     */
    MyLink.prototype.onkeyup = function (oEvent) {
      if (oEvent.which === KeyCodes.SPACE) {
        if (!this._bPressedEscapeOrShift) {
          this._handlePress(oEvent);

          if (this.getHref() && !oEvent.isDefaultPrevented()) {
            // Normal browser MyLink, the browser does the job. According to the keyboard spec, space should fire press event on keyup.
            // To make the browser REALLY do the same (history, referrer, frames, target,...), create a new "click" event and let the browser "do the needful".

            // first disarm the Space key event
            oEvent.preventDefault(); // prevent any scrolling which the browser might do because from its perspective the MyLink does not handle the "space" key
            oEvent.setMarked();

            // then create the click event
            var oClickEvent = document.createEvent("MouseEvents");
            oClickEvent.initEvent("click" /* event type */, false, true); // non-bubbling, cancelable
            this.getDomRef().dispatchEvent(oClickEvent);
          }
        } else {
          this._bPressedEscapeOrShift = false;
        }
        this._bPressedSpace = false;
      }
    };

    /**
     * Handler for the <code>press</code> event of the MyLink.
     *
     * @param {jQuery.Event} oEvent The <code>press</code> event object
     * @private
     */
    MyLink.prototype._handlePress = function (oEvent) {
      var oTarget = oEvent.target,
        bEmptyHref;

      if (this.getEnabled()) {
        // mark the event for components that needs to know if the event was handled by the MyLink
        oEvent.setMarked();

        bEmptyHref =
          oTarget.classList.contains("sapMLnk") &&
          oTarget.getAttribute("href") == "#";
        if (
          !this.firePress({
            ctrlKey: !!oEvent.ctrlKey,
            metaKey: !!oEvent.metaKey,
          }) ||
          bEmptyHref
        ) {
          // fire event and check return value whether default action should be prevented
          oEvent.preventDefault();
        }
      } else {
        // disabled
        oEvent.preventDefault(); // even prevent URLs from being triggered
      }
    };

    /**
     * Handle when enter is pressed.
     *
     * @param {jQuery.Event} oEvent The event object.
     * @private
     */
    MyLink.prototype.onsapenter = MyLink.prototype._handlePress;
    MyLink.prototype.onclick = MyLink.prototype._handlePress;

    /**
     * Handles the touch event on mobile devices.
     *
     * @param {jQuery.Event} oEvent The <code>touchstart</code> event object
     */
    MyLink.prototype.ontouchstart = function (oEvent) {
      if (this.getEnabled()) {
        // for controls which need to know whether they should handle events bubbling from here
        oEvent.setMarked();
      }
    };

    /* override standard setters */

    MyLink.prototype.setSubtle = function (bSubtle) {
      this.setProperty("subtle", bSubtle);

      if (bSubtle && !MyLink.prototype._sAriaLinkSubtleId) {
        MyLink.prototype._sAriaLinkSubtleId = InvisibleText.getStaticId(
          "sap.m",
          "LINK_SUBTLE"
        );
      }

      return this;
    };

    MyLink.prototype.setEmphasized = function (bEmphasized) {
      this.setProperty("emphasized", bEmphasized);

      if (bEmphasized && !MyLink.prototype._sAriaLinkEmphasizedId) {
        MyLink.prototype._sAriaLinkEmphasizedId = InvisibleText.getStaticId(
          "sap.m",
          "LINK_EMPHASIZED"
        );
      }

      return this;
    };

    /*************************************** Static members ******************************************/

    /**
     * Checks if the given sUri is valid depending on the validateUrl property
     *
     * @param {string} sUri
     * @returns {boolean}
     * @private
     */
    MyLink.prototype._isHrefValid = function (sUri) {
      return this.getValidateUrl() ? URLListValidator.validate(sUri) : true;
    };

    /**
     * Returns the <code>sap.m.Link</code>  accessibility information.
     *
     * @see sap.ui.core.Control#getAccessibilityInfo
     * @protected
     * @returns {sap.ui.core.AccessibilityInfo} The <code>sap.m.Link</code>  accessibility information
     */
    MyLink.prototype.getAccessibilityInfo = function () {
      var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.m"),
        sEmphasizedInfo = this.getEmphasized()
          ? oResourceBundle.getText("LINK_EMPHASIZED")
          : "",
        sSubtleInfo = this.getSubtle()
          ? oResourceBundle.getText("LINK_SUBTLE")
          : "",
        sText = this.getText(),
        sDescription = sText,
        sAccessibleRole = this.getAccessibleRole(),
        sType;

      if (sText) {
        sType =
          sAccessibleRole === LinkAccessibleRole.Default
            ? oResourceBundle.getText("ACC_CTR_TYPE_LINK")
            : oResourceBundle.getText("ACC_CTR_TYPE_BUTTON");

        sEmphasizedInfo && (sDescription += " " + sEmphasizedInfo);
        sSubtleInfo && (sDescription += " " + sSubtleInfo);
      }

      return {
        role:
          sAccessibleRole === LinkAccessibleRole.Default
            ? "link"
            : sAccessibleRole,
        type: sType,
        description: sDescription,
        focusable: this.getEnabled(),
        enabled: this.getEnabled(),
      };
    };

    /*
     * Link must not be stretched in Form because this would stretch the size of the focus outline
     */
    MyLink.prototype.getFormDoNotAdjustWidth = function () {
      return true;
    };

    /*
     * Provides hook for overriding the tabindex in case the link is used in a composite control
     * for example inside ObjectAttribute
     */
    MyLink.prototype._getTabindex = function () {
      return this.getText() && this.getEnabled() ? "0" : "-1";
    };

    /*
     * Determines whether self-reference should be added.
     *
     * @returns {boolean}
     * @private
     */
    MyLink.prototype._determineSelfReferencePresence = function () {
      var aAriaLabelledBy = this.getAriaLabelledBy(),
        bAlreadyHasSelfReference = aAriaLabelledBy.indexOf(this.getId()) !== -1,
        bHasReferencingLabels =
          LabelEnablement.getReferencingLabels(this).length > 0,
        oParent = this.getParent(),
        bAllowEnhancingByParent = !!(
          oParent && oParent.enhanceAccessibilityState
        );

      // When the link has aria-labelledby attribute, screen readers will read the references inside, rather
      // than the link's text. For this reason a self-reference should be added in such cases.
      return (
        !bAlreadyHasSelfReference &&
        (aAriaLabelledBy.length > 0 ||
          bHasReferencingLabels ||
          bAllowEnhancingByParent)
      );
    };

    /**
     * Required by the {@link sap.m.IToolbarInteractiveControl} interface.
     * Determines if the Control is interactive.
     *
     * @returns {boolean} If it is an interactive Control
     *
     * @private
     * @ui5-restricted sap.m.OverflowToolBar, sap.m.Toolbar
     */
    MyLink.prototype._getToolbarInteractive = function () {
      return true;
    };

    var setRefLabelsHighlightAccKeysRef = function (bHighlightAccKeysRef) {
      var aLabels = this.getAriaLabelledBy();

      if (aLabels.length) {
        var oLabel = Core.byId(aLabels[0]);

        oLabel.setProperty("highlightAccKeysRef", bHighlightAccKeysRef);

        if (oLabel.getText && oLabel.getText()) {
          this.setProperty("accesskey", oLabel.getText()[0].toLowerCase());
        }
      }
    };

    return MyLink;
  }
);
