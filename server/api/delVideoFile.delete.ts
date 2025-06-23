import fs from 'fs';
import path from 'path';
export default defineEventHandler(async (event) => {
  const {url} = getQuery(event);
  const videoPath = path.join(process.cwd(), 'assets', 'videos', `${url}`);
  
  if (fs.existsSync(videoPath)) {
    fs.unlinkSync(videoPath);
    return { message: `视频文件 ${url}删除成功` };
  } else {
    return { error: `视频文件 ${url}不存在` };
  }
})