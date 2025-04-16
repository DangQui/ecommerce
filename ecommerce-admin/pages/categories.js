import Layout from "@/components/Layout";
import { Category } from "@/models/Category";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from 'react-sweetalert2';

function Categories({swal}) {
    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState("");
    const [parentCategory, setParentCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    function fetchCategories() {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        });
    }

    async function saveCategory(ev) {
        ev.preventDefault();    
        const data = {
            name, 
            parentCategory, 
            properties: properties.map(p => ({
                name:p.name, 
                values:p.values.split(',')
            })),
        };
        console.log("Data to save:", data); // Thêm log để kiểm tra
        if (editedCategory){
            data._id = editedCategory._id;
            await axios.put('/api/categories', data);
            setEditedCategory(null);
        } else {
            await axios.post('/api/categories', data);
        }
        setName('');
        setParentCategory('');
        setProperties([]);
        fetchCategories();
    }

    function editCategory(Category) {
        setEditedCategory(Category);
        setName(Category.name);
        // Kiểm tra nếu không có danh mục cha thì đặt parentCategory thành chuỗi rỗng
        setParentCategory(Category.parent ? Category.parent._id : '');
        setProperties(
            Category.properties.map(({name, values}) => ({
                name,
                values: values.join(',')
            }))
        );
    }

    function deleteCategory(Category) {
        swal.fire({
            title: 'Bạn có chắc chắn không?',
            text: `Bạn có muốn xóa ${Category.name} không?`,
            showCancelButton: true,
            cancelButtonText: 'Hủy',
            confirmButtonText: 'Xóa',
            confirmButtonColor: '#d55',
            reverseButtons: true,
        }).then(async result => {
            if (result.isConfirmed) {
                const {_id} = Category;
                await axios.delete('/api/categories?_id=' + _id);
                fetchCategories();
            }
        });
    }

    function addProperty() {
        setProperties(prev => {
            return [...prev, {name: '', values: ''}];
        });
    }

    function handlePropertyNameChange(index, property, newName) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        })
    }
    
    function handlePropertyValuesChange(index, property, newValues) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        })
    }

    function removeProperty(indexToRemove) {
        setProperties(prev => {
            return [...prev].filter((p, pIndex) => {
                return pIndex != indexToRemove;
            });
        });
    }

    return (
        <Layout>
            <h1>Danh Mục Sản Phẩm</h1>
            <label>{editedCategory ? `Chỉnh sửa ${editedCategory.name} ` : 'Tạo danh mục mới'}</label>
            <form onSubmit={saveCategory}>
                <div className="flex gap-1">
                    <input
                        type="text" 
                        placeholder="Nhập tên danh mục" 
                        onChange={ev => setName(ev.target.value)} 
                        value={name}
                    />
                    <select 
                            onChange={ev => setParentCategory(ev.target.value)}
                            value={parentCategory}>
                        <option value="">Không có danh mục</option>
                        {categories.length > 0 && categories.map(Category => (
                            <option key={Category._id} value={Category._id}>{Category.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-2">
                    <label className="block">Thuộc tính</label>
                    <button 
                        onClick={addProperty}
                        type="button"
                        className="btn-default text-sm mb-2 cursor-pointer">
                        Thêm thuộc tính mới
                    </button>
                    {properties.length > 0 && properties.map((property, index) => (
                        <div className="flex gap-1 mb-2" key={index}>
                            <input type="text" 
                                    value={property.name} 
                                    className="!mb-0"
                                    onChange={ev => handlePropertyNameChange(
                                        index, 
                                        property, 
                                        ev.target.value)}
                                    placeholder="Nhập tên thuộc tính (ví dụ: màu)" />
                            <input type="text" 
                                    value={property.values}
                                    className="!mb-0"
                                    onChange={ev => handlePropertyValuesChange(
                                        index, 
                                        property, 
                                        ev.target.value)} 
                                    placeholder="Nhập giá trị, cách nhau bằng dấu phẩy" />
                            <button 
                                onClick={() => removeProperty(index)}
                                type="button"
                                className="btn-red cursor-pointer">
                                Xóa
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-1">
                    {editedCategory && (
                        <button 
                            type="button"
                            onClick={() => {
                                setEditedCategory(null);
                                setName('');
                                setParentCategory('');
                                setProperties([]);
                            }}
                            className="btn-red cursor-pointer">Hủy bỏ</button>
                    )}
                    <button 
                        type="submit" 
                        className="btn-primary py-1">
                        Lưu
                    </button>
                </div>
            </form>

            {!editedCategory && (
                <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Sản phẩm</td>
                        <td>Danh mục</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 && categories.map(Category => (
                        <tr key={Category._id}>
                            <td>{Category.name}</td>
                            <td>{Category?.parent?.name}</td>
                            <td>
                                <button onClick={() => editCategory(Category)} className="btn-default mr-1">Chỉnh sửa</button>
                                <button onClick={() => deleteCategory(Category)} className="btn-red">Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}
        </Layout>
    );
}

export default withSwal(({swal}, ref) => (
    <Categories swal={swal} />
));