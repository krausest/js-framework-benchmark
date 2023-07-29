import { elementOpen, elementClose } from "incremental-dom";

export function GlyphIconSpan() {
    // <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>

    elementOpen(
        'span', null, null,
        // attributes
        'class', 'preloadicon glyphicon glyphicon-remove',
        'aria-hidden', 'true'
    );

    elementClose('span');
}