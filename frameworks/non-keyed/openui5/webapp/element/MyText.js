/*!
 * ${copyright}
 */

// Provides control sap.m.Text
sap.ui.define(
  [
    "sap/m/library",
    "sap/base/i18n/Localization",
    "sap/ui/core/Core",
    "sap/ui/core/Control",
    "sap/ui/core/library",
    "sap/ui/Device",
    "sap/m/HyphenationSupport",
    "./MyTextRenderer",
  ],
  function (
    library,
    Localization,
    Core,
    Control,
    coreLibrary,
    Device,
    HyphenationSupport,
    MyTextRenderer
  ) {
    "use strict";

    // shortcut for sap.ui.core.TextAlign
    var TextAlign = coreLibrary.TextAlign;

    // shortcut for sap.ui.core.TextDirection
    var TextDirection = coreLibrary.TextDirection;

    // shortcut for sap.m.WrappingType
    var WrappingType = library.WrappingType;

    // shortcut for sap.m.EmptyIndicator
    var EmptyIndicatorMode = library.EmptyIndicatorMode;

    /**
     * Constructor for a new Text.
     *
     * @param {string} [sId] ID for the new control, generated automatically if no ID is given
     * @param {object} [mSettings] Initial settings for the new control
     *
     * @class
     * The <code>Text</code> control can be used for embedding longer text paragraphs,
     * that need text wrapping, into your app.
     * If the configured text value contains HTML code or script tags, those will be
     * escaped.
     *
     * As of version 1.60, you can hyphenate the text with the use of the
     * <code>wrappingType</code> property. For more information, see
     * {@link topic:6322164936f047de941ec522b95d7b70 Text Controls Hyphenation}.
     *
     * <b>Note:</b> Line breaks will always be visualized except when the
     * <code>wrapping</code> property is set to <code>false</code>. In addition, tabs and
     * whitespace can be preserved by setting the <code>renderWhitespace</code> property
     * to <code>true</code>.
     *
     * @extends sap.ui.core.Control
     * @implements sap.ui.core.IShrinkable, sap.ui.core.IFormContent, sap.ui.core.ISemanticFormContent
     *
     * @author SAP SE
     * @version ${version}
     *
     * @constructor
     * @public
     * @alias sap.m.Text
     * @see {@link fiori:https://experience.sap.com/fiori-design-web/text/ Text}
     * @see {@link topic:f94deb45de184a3a87850b75d610d9c0 Text}
     */
    var MyText = Control.extend(
      "sap.m.Text",
      /** @lends sap.m.Text.prototype */ {
        metadata: {
          interfaces: [
            "sap.ui.core.IShrinkable",
            "sap.ui.core.IFormContent",
            "sap.ui.core.ISemanticFormContent",
            "sap.m.IHyphenation",
            "sap.m.IToolbarInteractiveControl",
          ],
          library: "sap.m",
          properties: {
            /**
             * Determines the text to be displayed.
             */
            text: { type: "string", defaultValue: "", bindable: "bindable" },

            /**
             * Available options for the text direction are LTR and RTL. By default the control inherits the text direction from its parent control.
             */
            textDirection: {
              type: "sap.ui.core.TextDirection",
              group: "Appearance",
              defaultValue: TextDirection.Inherit,
            },

            /**
             * Enables text wrapping.
             */
            wrapping: {
              type: "boolean",
              group: "Appearance",
              defaultValue: true,
            },

            /**
             * Defines the type of text wrapping to be used (hyphenated or normal).
             *
             * <b>Note:</b> This property takes effect only when the <code>wrapping</code>
             * property is set to <code>true</code>.
             *
             * @since 1.60
             */
            wrappingType: {
              type: "sap.m.WrappingType",
              group: "Appearance",
              defaultValue: WrappingType.Normal,
            },

            /**
             * Sets the horizontal alignment of the text.
             */
            textAlign: {
              type: "sap.ui.core.TextAlign",
              group: "Appearance",
              defaultValue: TextAlign.Begin,
            },

            /**
             * Sets the width of the Text control. By default, the Text control uses the full width available. Set this property to restrict the width to a custom value.
             */
            width: {
              type: "sap.ui.core.CSSSize",
              group: "Dimension",
              defaultValue: null,
            },

            /**
             * Limits the number of lines for wrapping texts.
             *
             * <b>Note</b>: The multi-line overflow indicator depends on the browser line clamping support. For such browsers, this will be shown as ellipsis, for the other browsers the overflow will just be hidden.
             * @since 1.13.2
             */
            maxLines: { type: "int", group: "Appearance", defaultValue: null },

            /**
             * Specifies how whitespace and tabs inside the control are handled. If true, whitespace will be preserved by the browser.
             * Depending on wrapping property text will either only wrap on line breaks or wrap when necessary, and on line breaks.
             *
             * @since 1.51
             */
            renderWhitespace: {
              type: "boolean",
              group: "Appearance",
              defaultValue: false,
            },

            /**
             * Specifies if an empty indicator should be displayed when there is no text.
             *
             * @since 1.87
             */
            emptyIndicatorMode: {
              type: "sap.m.EmptyIndicatorMode",
              group: "Appearance",
              defaultValue: EmptyIndicatorMode.Off,
            },
          },

          designtime: "sap/m/designtime/Text.designtime",
        },

        renderer: MyTextRenderer,
      }
    );

    /**
     * Default line height value as a number when line height is normal.
     *
     * This value is required during max height calculation for the browsers that do not support line clamping.
     * It is better to define line height in CSS instead of "normal" to get consistent <code>maxLines</code> results since normal line height
     * not only varies from browser to browser but it also varies from one font face to another and can also vary within a given face.
     *
     * @since 1.22
     * @protected
     * @type {int}
     */
    MyText.prototype.normalLineHeight = 1.2;

    /**
     * Determines per instance whether line height should be cached or not.
     *
     * Default value is true.
     *
     * @since 1.22
     * @protected
     * @type {boolean}
     */
    MyText.prototype.cacheLineHeight = true;

    /**
     * Ellipsis(...) text to indicate more text when clampText function is used.
     *
     * Can be overwritten with 3dots(...) if fonts do not support this UTF-8 character.
     *
     * @since 1.13.2
     * @protected
     * @type {string}
     */
    MyText.prototype.ellipsis = "...";

    /**
     * Defines whether browser supports native line clamp or not
     *
     * @since 1.13.2
     * @returns {boolean}
     * @protected
     * @readonly
     * @static
     */
    MyText.hasNativeLineClamp =
      "webkitLineClamp" in document.documentElement.style;

    /**
     * To prevent from the layout thrashing of the <code>textContent</code> call, this method
     * first tries to set the <code>nodeValue</code> of the first child if it exists.
     *
     * @protected
     * @param {HTMLElement} oDomRef DOM reference of the text node container.
     * @param {string} [sNodeValue] new Node value.
     * @since 1.30.3
     */
    MyText.setNodeValue = function (oDomRef, sNodeValue) {
      sNodeValue = sNodeValue || "";
      var aChildNodes = oDomRef.childNodes;
      if (
        aChildNodes.length === 1 &&
        aChildNodes[0].nodeType === window.Node.TEXT_NODE
      ) {
        aChildNodes[0].nodeValue = sNodeValue;
      } else {
        oDomRef.textContent = sNodeValue;
      }
    };

    /**
     * Gets the text.
     *
     * @public
     * @param {boolean} bNormalize Indication for normalized text.
     * @returns {string} Text value.
     */
    MyText.prototype.getText = function (bNormalize) {
      // returns the text value and normalize line-ending character for rendering
      var sText = this.getProperty("text");

      // handle line ending characters for renderer
      if (bNormalize) {
        return sText.replace(/\r\n|\n\r|\r/g, "\n");
      }

      return sText;
    };
    /**
     * Overwrites onAfterRendering
     *
     * @public
     */
    MyText.prototype.onAfterRendering = function () {
      // required adaptations after rendering
      // check visible, max-lines and line-clamping support
      if (
        this.getVisible() &&
        this.hasMaxLines() &&
        !this.canUseNativeLineClamp()
      ) {
        if (Core.isThemeApplied()) {
          // set max-height for maxLines support
          this.clampHeight();
        } else {
          Core.attachThemeChanged(this._handleThemeLoad, this);
        }
      }
    };

    /**
     * Fired when the theme is loaded
     *
     * @private
     */
    MyText.prototype._handleThemeLoad = function () {
      // set max-height for maxLines support
      this.clampHeight();

      Core.detachThemeChanged(this._handleThemeLoad, this);
    };

    /**
     * Determines whether max lines should be rendered or not.
     *
     * @protected
     * @returns {HTMLElement|null} Max lines of the text.
     * @since 1.22
     */
    MyText.prototype.hasMaxLines = function () {
      return this.getWrapping() && this.getMaxLines() > 1;
    };

    /**
     * Returns the text node container's DOM reference.
     * This can be different from <code>getDomRef</code> when inner wrapper is needed.
     *
     * @protected
     * @returns {HTMLElement|null} DOM reference of the text.
     * @since 1.22
     */
    MyText.prototype.getTextDomRef = function () {
      if (!this.getVisible()) {
        return null;
      }

      if (this.hasMaxLines()) {
        return this.getDomRef("inner");
      }

      return this.getDomRef();
    };

    /**
     * Decides whether the control can use native line clamp feature or not.
     *
     * In RTL mode native line clamp feature is not supported.
     *
     * @since 1.20
     * @protected
     * @return {boolean}
     */
    MyText.prototype.canUseNativeLineClamp = function () {
      // has line clamp feature
      if (!MyText.hasNativeLineClamp) {
        return false;
      }

      // is text direction rtl
      if (this.getTextDirection() == TextDirection.RTL) {
        return false;
      }

      // is text direction inherited as rtl
      if (
        this.getTextDirection() == TextDirection.Inherit &&
        Localization.getRTL()
      ) {
        return false;
      }

      return true;
    };

    /**
     * Caches and returns the computed line height of the text.
     *
     * @protected
     * @param {HTMLElement} [oDomRef] DOM reference of the text container.
     * @returns {int} returns calculated line height
     * @see sap.m.Text#cacheLineHeight
     * @since 1.22
     */
    MyText.prototype.getLineHeight = function (oDomRef) {
      // return cached value if possible and available
      if (this.cacheLineHeight && this._fLineHeight) {
        return this._fLineHeight;
      }

      // check whether dom ref exist or not
      oDomRef = oDomRef || this.getTextDomRef();
      if (!oDomRef) {
        return 0;
      }

      // check line-height
      var oStyle = window.getComputedStyle(oDomRef),
        sLineHeight = oStyle.lineHeight,
        fLineHeight;

      // calculate line-height in px
      if (/px$/i.test(sLineHeight)) {
        // we can rely on calculated px line-height value
        fLineHeight = parseFloat(sLineHeight);
      } else if (/^normal$/i.test(sLineHeight)) {
        // use default value to calculate normal line-height
        fLineHeight = parseFloat(oStyle.fontSize) * this.normalLineHeight;
      } else {
        // calculate line-height with using font-size and line-height
        fLineHeight = parseFloat(oStyle.fontSize) * parseFloat(sLineHeight);
      }

      // on rasterizing the font, sub pixel line-heights are converted to integer
      // for most of the font rendering engine but this is not the case for firefox
      if (!Device.browser.firefox) {
        fLineHeight = Math.floor(fLineHeight);
      }

      // cache line height
      if (this.cacheLineHeight && fLineHeight) {
        this._fLineHeight = fLineHeight;
      }

      // return
      return fLineHeight;
    };

    /**
     * Returns the max height according to max lines and line height calculation.
     * This is not calculated max height!
     *
     * @protected
     * @param {HTMLElement} [oDomRef] DOM reference of the text container.
     * @returns {int} The clamp height of the text.
     * @since 1.22
     */
    MyText.prototype.getClampHeight = function (oDomRef) {
      oDomRef = oDomRef || this.getTextDomRef();
      return this.getMaxLines() * this.getLineHeight(oDomRef);
    };

    /**
     * Sets the max height to support <code>maxLines</code> property.
     *
     * @protected
     * @param {HTMLElement} [oDomRef] DOM reference of the text container.
     * @returns {int} Calculated max height value.
     * @since 1.22
     */
    MyText.prototype.clampHeight = function (oDomRef) {
      oDomRef = oDomRef || this.getTextDomRef();
      if (!oDomRef) {
        return 0;
      }

      // calc the max height and set on dom
      var iMaxHeight = this.getClampHeight(oDomRef);
      if (iMaxHeight) {
        oDomRef.style.maxHeight = iMaxHeight + "px";
      }

      return iMaxHeight;
    };

    /**
     * Clamps the wrapping text according to max lines and returns the found ellipsis position.
     * Parameters can be used for better performance.
     *
     * @protected
     * @param {HTMLElement} [oDomRef] DOM reference of the text container.
     * @param {int} [iStartPos] Start point of the ellipsis search.
     * @param {int} [iEndPos] End point of the ellipsis search.
     * @returns {int|undefined} Returns found ellipsis position or <code>undefined</code>.
     * @since 1.20
     */
    MyText.prototype.clampText = function (oDomRef, iStartPos, iEndPos) {
      // check DOM reference
      oDomRef = oDomRef || this.getTextDomRef();
      if (!oDomRef) {
        return;
      }

      // init
      var iEllipsisPos;
      var sText = this.getText(true);
      var iMaxHeight = this.getClampHeight(oDomRef);

      // init positions
      iStartPos = iStartPos || 0;
      iEndPos = iEndPos || sText.length;

      // update only the node value without layout thrashing
      MyText.setNodeValue(oDomRef, sText.slice(0, iEndPos));

      // if text overflow
      if (oDomRef.scrollHeight > iMaxHeight) {
        // cache values
        var oStyle = oDomRef.style,
          sHeight = oStyle.height,
          sEllipsis = this.ellipsis,
          iEllipsisLen = sEllipsis.length;

        // set height during ellipsis search
        oStyle.height = iMaxHeight + "px";

        // implementing binary search to find the position of ellipsis
        // complexity O(logn) so 1024 characters text can be found within 10 steps!
        while (iEndPos - iStartPos > iEllipsisLen) {
          // check the middle position and update text
          iEllipsisPos = (iStartPos + iEndPos) >> 1;

          // update only the node value without layout thrashing
          MyText.setNodeValue(
            oDomRef,
            sText.slice(0, iEllipsisPos - iEllipsisLen) + sEllipsis
          );

          // check overflow
          if (oDomRef.scrollHeight > iMaxHeight) {
            iEndPos = iEllipsisPos;
          } else {
            iStartPos = iEllipsisPos;
          }
        }

        // last check maybe we overflowed on last character
        if (oDomRef.scrollHeight > iMaxHeight && iStartPos > 0) {
          iEllipsisPos = iStartPos;
          oDomRef.textContent =
            sText.slice(0, iEllipsisPos - iEllipsisLen) + sEllipsis;
        }

        // reset height
        oStyle.height = sHeight;
      }

      // return the found position
      return iEllipsisPos;
    };

    /**
     * Gets the accessibility information for the text.
     *
     * @protected
     * @returns {sap.ui.core.AccessibilityInfo} Accessibility information for the text.
     * @see sap.ui.core.Control#getAccessibilityInfo
     */
    MyText.prototype.getAccessibilityInfo = function () {
      return { description: this.getText() };
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
    MyText.prototype._getToolbarInteractive = function () {
      return false;
    };

    /**
     * Gets a map of texts which should be hyphenated.
     *
     * @private
     * @returns {Object<string,string>} The texts to be hyphenated.
     */
    MyText.prototype.getTextsToBeHyphenated = function () {
      return {
        main: this.getText(true),
      };
    };

    /**
     * Gets the DOM refs where the hyphenated texts should be placed.
     *
     * @private
     * @returns {map|null} The elements in which the hyphenated texts should be placed
     */
    MyText.prototype.getDomRefsForHyphenatedTexts = function () {
      return {
        main: this.getTextDomRef(),
      };
    };

    // Add hyphenation to Text functionality
    HyphenationSupport.mixInto(MyText.prototype);

    return MyText;
  }
);
