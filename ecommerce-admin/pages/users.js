import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";

// Thêm styled-components để tạo CSS responsive
import styled from 'styled-components';

const TableWrapper = styled.div`
  overflow-x: auto; /* Cho phép cuộn ngang trên màn hình nhỏ nếu cần */
  
  table.basic {
    width: 100%;
    border-collapse: collapse;
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;

    th, td {
      padding: 10px;
      border-bottom: 1px solid #ddd;
      text-align: left;
      font-size: 14px;
    }

    th {
      background: #f5f5f5;
      font-weight: bold;
    }

    td {
      vertical-align: middle;
    }

    /* Responsive cho màn hình nhỏ hơn 768px */
    @media screen and (max-width: 768px) {
      thead {
        display: none; /* Ẩn tiêu đề bảng trên mobile */
      }

      tr {
        display: block; /* Chuyển mỗi hàng thành một khối */
        margin-bottom: 15px;
        border-bottom: 2px solid #ddd;
      }

      td {
        display: flex; /* Sử dụng flex để hiển thị label và giá trị */
        justify-content: space-between;
        align-items: center;
        padding: 8px;
        border: none;
        border-bottom: 1px solid #eee;
        text-align: right;
        font-size: 13px;

        /* Thêm label cho mỗi ô dữ liệu */
        &:before {
          content: attr(data-label); /* Sử dụng data-label để hiển thị tên cột */
          font-weight: bold;
          text-align: left;
          flex: 1;
          color: #555;
        }

        /* Đảm bảo nút hành động hiển thị tốt trên mobile */
        &:last-child {
          justify-content: center;
          border-bottom: none;

          button {
            width: 100%;
            padding: 8px;
            font-size: 12px;
          }
        }
      }

      /* Điều chỉnh màu sắc trạng thái trên mobile */
      .text-green-600 {
        color: #16a34a;
      }

      .text-red-600 {
        color: #dc2626;
      }
    }

    /* Đảm bảo nút hành động hiển thị tốt trên màn hình lớn */
    @media screen and (min-width: 769px) {
      td:last-child {
        text-align: center;

        button {
          padding: 5px 10px;
          font-size: 14px;
        }
      }
    }
  }
`;

export default function UsersPage() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('/api/users').then(response => {
            setUsers(response.data);
        });
    }, []);

    const toggleDisableUser = async (userId, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            const response = await axios.put('/api/users', {
                userId,
                isDisabled: newStatus,
            });

            if (response.status === 200) {
                setUsers(users.map(user =>
                    user._id === userId ? { ...user, isDisabled: newStatus } : user
                ));
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái người dùng:', error);
        }
    };

    return (
        <Layout>
            <h1>Quản Lý Người Dùng</h1>
            <TableWrapper>
                <table className="basic">
                    <thead>
                        <tr>
                            <th>Họ và Tên</th>
                            <th>Email</th>
                            <th>Số Điện Thoại</th>
                            <th>Ngày Sinh</th>
                            <th>Ngày Tạo</th>
                            <th>Trạng Thái</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 && users.map(user => (
                            <tr key={user._id}>
                                <td data-label="Họ và Tên">{user.fullName}</td>
                                <td data-label="Email">{user.email}</td>
                                <td data-label="Số Điện Thoại">{user.phone}</td>
                                <td data-label="Ngày Sinh">{new Date(user.birthDate).toLocaleDateString('vi-VN')}</td>
                                <td data-label="Ngày Tạo">{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                                <td data-label="Trạng Thái" className={user.isDisabled ? 'text-red-600' : 'text-green-600'}>
                                    {user.isDisabled ? 'Đã vô hiệu hóa' : 'Đang hoạt động'}
                                </td>
                                <td data-label="Hành Động">
                                    <button
                                        onClick={() => toggleDisableUser(user._id, user.isDisabled)}
                                        className={`px-2 py-1 rounded ${user.isDisabled ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                                    >
                                        {user.isDisabled ? 'Bỏ vô hiệu hóa' : 'Vô hiệu hóa'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </TableWrapper>
        </Layout>
    );
}