
        export function getMetaContents(meta_name) {
            const selector = document.querySelector(`meta[name="${meta_name}"]`);
            if (!selector) {
                return null;
            }
            return selector.content;
        }
    