import React from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

const DropFileTypes = ({ inputChange }) => (
    <UncontrolledDropdown>
        <DropdownToggle caret>FileType</DropdownToggle>
        <DropdownMenu>
            <DropdownItem name="format" onClick={inputChange} value=".audio">Audio</DropdownItem>
            <DropdownItem name="format" onClick={inputChange} value=".image">Image</DropdownItem>
            <DropdownItem name="format" onClick={inputChange} value=".video">Video</DropdownItem>
            <DropdownItem name="format" onClick={inputChange} value=".word">Word</DropdownItem>
            <DropdownItem name="format" onClick={inputChange} value=".excel">Excel</DropdownItem>
            <DropdownItem name="format" onClick={inputChange} value=".powerpoint">Powerpoint</DropdownItem>
            <DropdownItem name="format" onClick={inputChange} value=".pdf">Pdf</DropdownItem>
            <DropdownItem name="format" onClick={inputChange} value=".archive">Archive</DropdownItem>
            <DropdownItem name="format" onClick={inputChange} value=".text">Text</DropdownItem>
            <DropdownItem name="format" onClick={inputChange} value=".code">Code</DropdownItem>
            <DropdownItem name="format" onClick={inputChange} value=".file">File</DropdownItem>
        </DropdownMenu>
    </UncontrolledDropdown>
);

export default DropFileTypes;
