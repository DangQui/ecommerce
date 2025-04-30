import Layout from "@/components/Layout";
import axios from "axios";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
import { useNotification } from "@/context/NotificationContext";

function formatNumberWithDots(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

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
  const notificationContext = useNotification();
  const showNotification = notificationContext?.showNotification || ((message, type) => {
    alert(message);
  });

  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [category, setCategory] = useState(assignedCategory || '');
  const [productProperties, setProductProperties] = useState(assignedProperties || {});
  const [price, setPrice] = useState(existingPrice || "");
  const [displayPrice, setDisplayPrice] = useState(
    existingPrice ? formatNumberWithDots(existingPrice) : ""
  );
  const [images, setImages] = useState(existingImages || []);
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    });
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
    };
    try {
      if (_id) {
        await axios.put("/api/products", { ...data, _id });
        showNotification("Cập nhật sản phẩm thành công");
      } else {
        await axios.post("/api/products", data);
        showNotification("Thêm sản phẩm thành công");
      }
      setGoToProducts(true);
    } catch (error) {
      showNotification(error.response?.data?.error || "Lưu sản phẩm thất bại", "error");
    }
  }

  if (goToProducts) {
    router.push("/products");
  }

  async function upLoadImages(ev) {
    const files = ev.target?.files;
    if (files.length > 0) {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      const data = new FormData();
      let hasInvalidFile = false;

      for (const file of files) {
        if (validImageTypes.includes(file.type)) {
          data.append("file", file);
        } else {
          hasInvalidFile = true;
        }
      }

      if (hasInvalidFile) {
        showNotification("Chỉ được tải lên các tệp hình ảnh (jpg, png, gif, webp)", "error");
      }

      if (data.has("file")) {
        setIsUploading(true);
        try {
          const res = await axios.post("/api/upload", data);
          setImages((oldImages) => [...oldImages, ...res.data.links]);
          showNotification("Tải ảnh lên thành công");
        } catch (error) {
          showNotification("Tải ảnh lên thất bại", "error");
        } finally {
          setIsUploading(false);
        }
      }
    }
  }

  function updateImagesOrder(images) {
    setImages(images);
  }

  async function removeImage(link) {
    try {
      await axios.delete(`/api/upload?link=${encodeURIComponent(link)}`);
      setImages((oldImages) => oldImages.filter((image) => image !== link));
      showNotification("Xóa hình ảnh thành công");
    } catch (error) {
      showNotification("Xóa hình ảnh thất bại", "error");
    }
  }

  function setProductProp(propName, value) {
    setProductProperties(prev => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    propertiesToFill.push(...catInfo.properties);
    while (catInfo?.parent?._id) {
      const parentCat = categories.find(({ _id }) => _id === catInfo?.parent?._id);
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }

  function handlePriceChange(ev) {
    const inputValue = ev.target.value;
    const numericValue = parseNumberWithDots(inputValue);
    if (numericValue === "" || !isNaN(numericValue)) {
      setPrice(numericValue);
      setDisplayPrice(numericValue ? formatNumberWithDots(numericValue) : "");
    }
  }

  return (
    <form onSubmit={saveProduct} className="relative">
      <label>Tên sản phẩm</label>
      <input
        type="text"
        placeholder="Nhập tên sản phẩm"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <label>Danh mục</label>
      <select value={category} onChange={ev => setCategory(ev.target.value)}>
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
            <select
              value={productProperties[p.name]}
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
              <div
                key={link}
                className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200 relative group"
              >
                <img src={link} alt="" className="rounded-lg h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(link)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity delete-button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
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
        type="text"
        placeholder="Nhập giá sản phẩm"
        value={displayPrice}
        onChange={handlePriceChange}
      />
      <button type="submit" className="btn-primary">Lưu</button>
    </form>
  );
}
