import { elementOpen, close, text, Key } from 'incremental-dom';

export function Button(id: string, innerText: string, onClick: () => void, key: Key = null) {
    elementOpen(
        'button', key, null,
        // attributes
        'class', 'btn btn-primary btn-block',
        'id', id
    );
    text(innerText)
    const el = close();
    el.addEventListener('click', onClick);
}