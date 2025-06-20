import fs from 'fs';
import path from 'path';
// 定义目标目录
const VIDEO_DIR = path.resolve('./assets/videos');

// 确保目录存在
if (!fs.existsSync(VIDEO_DIR)) {
  fs.mkdirSync(VIDEO_DIR, { recursive: true });
}

export default defineEventHandler(async (event) => {
  const formData = await readFormData(event);
  const videoFile = formData.get('video') as File;

  if (!videoFile) {
    return { success: false, message: '未找到视频文件' };
  }

  // 获取文件名并保存到目标目录
  const filename = `${Date.now()}-${videoFile.name}`;
  const filePath = path.join(VIDEO_DIR, filename);

  // 将文件写入磁盘（这里假设使用 Node.js 的 fs 模块）
  const data = await videoFile.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(data));

  return {
    success: true,
    message: '上传成功',
    filename:filename
  };
});