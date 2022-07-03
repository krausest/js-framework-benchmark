import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { categories} from '../Common';
import { selectAllCategories, selectCategory, setStateFromClipboard, State } from '../reducer';
import DropDown from './DropDown';
import { DropDownContents } from './DropDownContents';

const CopyPasteSelection = () => 
{
    console.log("CopyPasteSelection");
    const dispatch = useDispatch();    
    const state = useSelector<State, State>(state => state);

    const copy = () => {
        const serializedState = {
            frameworks: state.frameworks.filter(f => state.selectedFrameworksDropDown.has(f)).map(f => f.dir),
            benchmarks: state.benchmarks.filter(f => state.selectedBenchmarks.has(f)).map(f => f.id),
            displayMode: state.displayMode,
            categories: categories.filter(c => state.categories.has(c.id)).map(c => c.id)
        };
        const json = JSON.stringify(serializedState);
        navigator.clipboard.writeText(json);
        window.location.hash = btoa(json);
    };
    const paste = async () => {
        try {
            const jsonState = JSON.parse(await navigator.clipboard.readText());    
            dispatch(setStateFromClipboard(jsonState));
        } catch (e) {
            alert("Sorry - couldn't parse pasted selection");
            console.log("pasting state failed", e);
        }
    };
    return <>
        <p>Copy/paste current selection</p>
        <div className="hspan" />
        <button className='iconbutton' onClick={copy}>
            {/* svg from https://ionic.io/ionicons */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><title>Copy</title><rect x="128" y="128" width="336" height="336" rx="57" ry="57" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="32"/><path d="M383.5 128l.5-24a56.16 56.16 0 00-56-56H112a64.19 64.19 0 00-64 64v216a56.16 56.16 0 0056 56h24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"/></svg>
        </button>
        <button className='iconbutton' onClick={paste}>
            {/* svg from https://ionic.io/ionicons */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><title>Clipboard</title><path d="M336 64h32a48 48 0 0148 48v320a48 48 0 01-48 48H144a48 48 0 01-48-48V112a48 48 0 0148-48h32" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="32"/><rect x="176" y="32" width="160" height="64" rx="26.13" ry="26.13" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="32"/></svg>            
        </button>
    </>
}

export default CopyPasteSelection;