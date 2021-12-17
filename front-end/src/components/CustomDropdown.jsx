import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'
import api from '../apis/apiFetch';
import '../App.css';
const categoryNameRegex = /^[a-zA-Z0-9\s]*$/;
const prefixRegex = /^[a-zA-Z0-9]*$/;

const CustomDropdown = ({ items, setSelectedCategory, setNewCategory }) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(items[0].name);
    const [addCategoryForm, setAddCategoryForm] = useState(false);
    const [prefix, setPrefix] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [isFilled, setIsFilled] = useState(false);
    const toggle = () => setOpen(!open);
    function handleOnClick(item) {
        setSelected(item);
        setOpen(!open);
    }

    function addNewCategory(name, prefix) {
        // setErrors(!errors);
        let categoryExists = items.filter(item => item.name === name).length > 0;
        let prefixExists = items.filter(item => item.prefix === prefix).length > 0;

        let message = '';
        // check category name
        if (!categoryName.match(categoryNameRegex)) {
            message += 'Name must contain only characters, numbers and whitespaces in between!\n';
        }
        if (categoryExists) {
            message += 'Category is already existed. Please enter a different category\n';
        }

        // check prefix
        if (!prefix.match(prefixRegex)) {
            message += "Prefix must contain only characters and numbers!\n"
        }
        if (prefixExists) {
            message += 'Prefix is already existed. Please enter a different prefix\n';
        }

        if (message !== '') {
            document.getElementById('errorMessage').innerText = message;
            return;
        }

        // add category to the list
        let newCategory = {
            prefix: prefix.toUpperCase(),
            name: name,
        };
        api.create('category/new', newCategory).then(response => {
            setNewCategory(response)
        });
        resetNewCategory();
        resetInputForm();
        // alert('New Category! \nName: ' + newCategory.name + '\nprefix: ' + newCategory.prefix);
    }

    function resetNewCategory() {
        setCategoryName('');
        setPrefix('');
    }
    function resetInputForm() {
        document.getElementById('name').value = '';
        document.getElementById('prefix').value = '';
    }
    return (
        <div className="category-dropdown">
            {/* dropdown header */}
            <div
                tabIndex={0}
                className="ui selection dropdown"
                style={{ width: '70%', paddingRight: 8, paddingBottom: 0 }}
                onClick={() => toggle(!open)}
            >
                <div style={{ display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <p>{selected.name}</p>
                    <FontAwesomeIcon icon={faAngleDown} color='black' />
                </div>
            </div>

            {/* dropdown options */}
            {open && (
                <div
                    style={{ width: '70%', right: 30, position: 'absolute', zIndex: 3, backgroundColor: 'lightgray', border: '1px solid black' }}>
                    <ul>
                        {/* list category name */}
                        <li style={{ padding: '0.25rem 1.5rem', height: 200, overflow: 'scroll', }}>
                            {items.map(item => (
                                <li
                                    className="dropdown-item"
                                    style={{ marginBottom: 16 }}
                                    key={item.prefix}
                                    onClick={() => {
                                        handleOnClick(item);
                                        setSelectedCategory(item);
                                    }}>
                                    <span>{item.name}</span>
                                </li>
                            ))}
                        </li>
                        {/* form add new category */}
                        <div className="dropdown-divider" style={{ borderTopColor: 'black' }}>

                        </div>
                        {!addCategoryForm && <li onClick={() => setAddCategoryForm(!addCategoryForm)} style={{
                            color: 'red',
                            textDecoration: 'underline',
                            fontStyle: 'italic',
                            padding: '0.25rem 1.5rem',
                            position: 'sticky'
                        }}>Add new category</li>}

                        {addCategoryForm &&
                            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', position: 'sticky', padding: '0.25rem 1.5rem' }}>
                                <div style={{ display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

                                    {/* input form */}
                                    <div style={{ display: 'flex', flex: 8, flexDirection: 'row' }}>
                                        <input style={{ flex: 6 }} id="name" name="categoryName" maxLength={30} type="text"
                                            placeholder="Bluetooth Mouse"
                                            onChange={(event) => {
                                                setCategoryName(event.target.value);
                                                setIsFilled(event.target.value.length != 0 && prefix.length != 0 ? true : false);
                                            }} />

                                        <input style={{ flex: 2 }} id="prefix" maxLength={3} type="text"
                                            placeholder="BM"
                                            onKeyUp={(event) => {
                                                setPrefix(event.target.value);
                                                setIsFilled(event.target.value.length != 0 && categoryName.length != 0 ? true : false);
                                            }} />
                                    </div>

                                    {/* navigate icon button */}
                                    <button style={{ border: 'none', background: 'transparent' }} disabled={!isFilled} onClick={(e) => {
                                        e.preventDefault()
                                        addNewCategory(categoryName, prefix)
                                    }} >
                                        <FontAwesomeIcon style={{ flex: 1 }} icon={faCheck} color='red' />
                                    </button>
                                    <FontAwesomeIcon style={{ flex: 1 }} icon={faTimes} color='black' onClick={() => {
                                        setAddCategoryForm(!addCategoryForm);
                                        resetNewCategory();
                                    }} />
                                </div>
                                <p id='errorMessage' style={{ color: 'red' }}></p>
                            </div>
                        }
                    </ul>
                </div>
            )}
        </div>
    );
}

export default CustomDropdown;
