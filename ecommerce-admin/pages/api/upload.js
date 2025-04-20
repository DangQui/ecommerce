import multiparty from 'multiparty';
import { PutObjectCommand, S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import mime from 'mime-types';
import { mongooseConnect } from '@/lib/mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

const bucketName = 'quisk-next-ecommerce';

export default async function handle(req, res) {
  try {
    // Kết nối MongoDB
    await mongooseConnect();

    // Chỉ kiểm tra xem người dùng có đăng nhập không
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      console.log('Không có phiên đăng nhập');
      return res.status(401).json({ error: 'Chưa đăng nhập' });
    }

    const client = new S3Client({
      region: "ap-southeast-2",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });

    if (req.method === 'POST') {
      const form = new multiparty.Form();
      const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve({ fields, files });
        });
      });

      const links = [];
      for (const file of files.file) {
        const ext = file.originalFilename.split('.').pop();
        const newFilename = Date.now() + '.' + ext;
        await client.send(
          new PutObjectCommand({
            Bucket: bucketName,
            Key: newFilename,
            Body: fs.readFileSync(file.path),
            ACL: 'public-read',
            ContentType: mime.lookup(file.path),
          })
        );
        const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
        links.push(link);
      }
      return res.json({ links });
    }

    if (req.method === 'DELETE') {
      const { link } = req.query;
      if (!link) {
        console.log('Thiếu link trong query');
        return res.status(400).json({ error: 'Yêu cầu đường dẫn hình ảnh' });
      }

      const fileName = link.split('/').pop();
      console.log('Xóa file trên S3:', fileName);

      try {
        await client.send(
          new DeleteObjectCommand({
            Bucket: bucketName,
            Key: fileName,
          })
        );
        console.log('Xóa file trên S3 thành công:', fileName);
        return res.json({ message: 'Xóa hình ảnh khỏi S3 thành công' });
      } catch (error) {
        console.error('Lỗi khi xóa hình ảnh trên S3:', error);
        return res.status(500).json({ error: 'Xóa hình ảnh trên S3 thất bại', details: error.message });
      }
    }

    console.log('Phương thức không được hỗ trợ:', req.method);
    return res.status(405).json({ error: 'Phương thức không được hỗ trợ' });
  } catch (error) {
    console.error('Lỗi trong API /api/upload:', error);
    return res.status(500).json({ error: 'Lỗi máy chủ', details: error.message });
  }
}

export const config = {
  api: { bodyParser: false },
};