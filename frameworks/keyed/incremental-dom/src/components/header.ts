import { elementOpen, close, text } from 'incremental-dom';

export function H1(value: string) {
    elementOpen('h1');
    text(value);
    close();
}