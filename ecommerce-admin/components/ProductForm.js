import Layout from "@/components/Layout";
import axios from "axios";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

// Hàm format số với dấu chấm (ví dụ: 1234567 -> 1.234.567)
function formatNumberWithDots(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Hàm loại bỏ dấu chấm để lấy giá trị số thực tế (ví dụ: 1.234.567 -> 1234567)
function parseNumberWithDots(value) {
  return value.replace(/\./g, "");
}

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [category, setCategory] = useState(assignedCategory || '');
  const [productProperties, setProductProperties] = useState(assignedProperties || {});
  const [price, setPrice] = useState(existingPrice || ""); // Giá trị thực tế (không có dấu chấm)
  const [displayPrice, setDisplayPrice] = useState(
    existingPrice ? formatNumberWithDots(existingPrice) : "" // Giá trị hiển thị (có dấu chấm)
  );
  const [images, setImages] = useState(existingImages || []);
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    axios.get('/api/categories').then(result => {
        setCategories(result.data);
    })
  }, []);

  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
      title, 
      description, 
      price, 
      images, 
      category, 
      properties: productProperties,
    }; // price ở đây là giá trị thực tế (không có dấu chấm)
    if (_id) {
      // Cập nhật sản phẩm
      await axios.put("/api/products", { ...data, _id });
    } else {
      // Thêm mới sản phẩm
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  }

  if (goToProducts) {
    router.push("/products");
  }

  async function upLoadImages(ev) {
    const files = ev.target?.files;
    if (files.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload", data);
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });
      setIsUploading(false);
    }
  }

  function updateImagesOrder(images) {
    setImages(images);
  }

  function setProductProp(propName, value) {
    setProductProperties(prev => {
      const newProductProps = {...prev};
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({_id}) => _id === category);
    propertiesToFill.push(...catInfo.properties);
    while(catInfo?.parent?._id) {
      const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id);
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }

  // Hàm xử lý khi người dùng nhập giá
  function handlePriceChange(ev) {
    const inputValue = ev.target.value;
    // Loại bỏ các ký tự không phải số và dấu chấm
    const numericValue = parseNumberWithDots(inputValue);
    // Chỉ cho phép số
    if (numericValue === "" || !isNaN(numericValue)) {
      setPrice(numericValue); // Lưu giá trị thực tế (không có dấu chấm)
      setDisplayPrice(numericValue ? formatNumberWithDots(numericValue) : ""); // Cập nhật giá trị hiển thị (có dấu chấm)
    }
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Tên sản phẩm</label>
      <input
        type="text"
        placeholder="Nhập tên sản phẩm"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <label>Danh mục</label>
      <select value={category} 
              onChange={ev => setCategory(ev.target.value)}>
        <option value="">Chưa phân loại</option>
        {categories.length > 0 &&
            categories.map((c) => (
            <option key={c._id} value={c._id}>
                {c.name}
            </option>
        ))}
      </select>
      {propertiesToFill.length > 0 && propertiesToFill.map(p => (
        <div key={p.name} className="">
          <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
          <div>
            <select value={productProperties[p.name]} 
                    onChange={ev => setProductProp(p.name, ev.target.value)}
            >
              {p.values.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>
      ))}
      <label>Hình ảnh</label>
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable
          list={images}
          className="flex flex-wrap gap-1"
          setList={updateImagesOrder}
        >
          {!!images?.length &&
            images.map((link) => (
              <div key={link} className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
                <img src={link} alt="" className="rounded-lg" />
              </div>
            ))}
        </ReactSortable>
        {isUploading && (
          <div className="h-24 flex items-center">
            <Spinner />
          </div>
        )}
        <label
          className="w-24 h-24 text-center 
          flex flex-col items-center justify-center text-sm gap-1
          !text-indigo-600 rounded-sm bg-white cursor-pointer shadow-sm border
          border-indigo-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 
              21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Tải ảnh lên</div>
          <input type="file" onChange={upLoadImages} className="hidden" />
        </label>
      </div>
      <label>Mô tả</label>
      <textarea
        placeholder="Nhập mô tả sản phẩm"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />
      <label>Giá (VND)</label>
      <input
        type="text" // Đổi type từ "number" thành "text" để hiển thị dấu chấm
        placeholder="Nhập giá sản phẩm"
        value={displayPrice} // Hiển thị giá trị có dấu chấm
        onChange={handlePriceChange} // Xử lý khi người dùng nhập
      />
      <button type="submit" className="btn-primary">Lưu</button>
    </form>
  );
}