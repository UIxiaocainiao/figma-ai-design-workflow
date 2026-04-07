const fs = require("fs");
const path = require("path");

let qiniu;

try {
  qiniu = require("qiniu");
} catch (error) {
  console.error("缺少依赖：qiniu");
  console.error("请先执行 npm install qiniu --save-dev");
  process.exit(1);
}

// ===== 这里改成你自己的配置 =====
const BUCKET = "designpeng"; // 七牛空间名
const DIST_DIR = path.join(__dirname, "..", "dist"); // 如果你的实际产物目录不是 dist，就改这里
const SITE_DOMAIN = "https://design.pengshz.cn"; // 你的 CDN 域名
const KEY_PREFIX = ""; // 如果上传到子目录，例如 "site/"，这里填 "site/"
// ==============================

const ACCESS_KEY = process.env.QINIU_ACCESS_KEY;
const SECRET_KEY = process.env.QINIU_SECRET_KEY;

if (!ACCESS_KEY || !SECRET_KEY) {
  console.error("缺少环境变量：QINIU_ACCESS_KEY 或 QINIU_SECRET_KEY");
  process.exit(1);
}

if (!fs.existsSync(DIST_DIR)) {
  console.error(`打包目录不存在：${DIST_DIR}`);
  console.error("请先执行 npm run build");
  process.exit(1);
}

const mac = new qiniu.auth.digest.Mac(ACCESS_KEY, SECRET_KEY);

// 上传器
const config = new qiniu.conf.Config();
const formUploader = new qiniu.form_up.FormUploader(config);
const putExtra = new qiniu.form_up.PutExtra();
const bucketManager = new qiniu.rs.BucketManager(mac, config);

// CDN 管理器
const cdnManager = new qiniu.cdn.CdnManager(mac);

function createUploadToken(key) {
  // 使用 bucket:key 形式，允许覆盖同名文件；bucket 形式只适合新增文件。
  const putPolicy = new qiniu.rs.PutPolicy({ scope: `${BUCKET}:${key}` });
  return putPolicy.uploadToken(mac);
}

function getResponseHeadersForKey(key) {
  if (key.endsWith(".html")) {
    return {
      "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
    };
  }

  if (key.startsWith("assets/")) {
    return {
      "Cache-Control": "public, max-age=31536000, immutable",
    };
  }

  return null;
}

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      results.push(fullPath);
    }
  }

  return results;
}

function toQiniuKey(localFile) {
  const relativePath = path.relative(DIST_DIR, localFile).replace(/\\/g, "/");
  return `${KEY_PREFIX}${relativePath}`;
}

function uploadFile(localFile) {
  const key = toQiniuKey(localFile);
  const uploadToken = createUploadToken(key);

  return new Promise((resolve, reject) => {
    formUploader.putFile(uploadToken, key, localFile, putExtra, function (err, body, info) {
      if (err) return reject(err);

      if (info.statusCode === 200) {
        console.log(`上传成功: ${key}`);
        resolve(key);
      } else {
        reject(new Error(`上传失败: ${key}, 状态码: ${info.statusCode}, 响应: ${JSON.stringify(body)}`));
      }
    });
  });
}

function changeHeaders(key, headers) {
  return new Promise((resolve, reject) => {
    bucketManager.changeHeaders(BUCKET, key, headers, function (err, body, info) {
      if (err) return reject(err);

      if (info.statusCode === 200) {
        console.log(`响应头更新成功: ${key}`);
        resolve(body);
      } else {
        reject(
          new Error(
            `响应头更新失败: ${key}, 状态码: ${info.statusCode}, 响应: ${JSON.stringify(body)}`,
          ),
        );
      }
    });
  });
}

function refreshUrls(urls) {
  return new Promise((resolve, reject) => {
    cdnManager.refreshUrls(urls, function (err, respBody, respInfo) {
      if (err) return reject(err);

      if (respInfo.statusCode === 200) {
        console.log("CDN 刷新提交成功");
        console.log(respBody);
        resolve(respBody);
      } else {
        reject(new Error(`CDN 刷新失败: ${respInfo.statusCode} ${respBody}`));
      }
    });
  });
}

async function main() {
  const files = walk(DIST_DIR);

  if (!files.length) {
    console.log("打包目录里没有文件可上传");
    return;
  }

  console.log(`开始上传，共 ${files.length} 个文件...`);

  const uploadedKeys = [];
  for (const file of files) {
    const key = await uploadFile(file);
    const headers = getResponseHeadersForKey(key);

    if (headers) {
      await changeHeaders(key, headers);
    }

    uploadedKeys.push(key);
  }

  // 生成要刷新的 URL
  // 一般静态站最关键的是首页 + index.html
  // 如果你上传的是完整静态产物，也可以把所有上传过的文件 URL 一起刷掉
  const refreshList = [
    `${SITE_DOMAIN}/`,
    `${SITE_DOMAIN}/index.html`,
    ...uploadedKeys.map((key) => `${SITE_DOMAIN}/${key}`)
  ];

  // 去重，避免重复提交
  const uniqueRefreshList = [...new Set(refreshList)];

  console.log("开始刷新 CDN：");
  uniqueRefreshList.forEach((url) => console.log(url));

  await refreshUrls(uniqueRefreshList);

  console.log("全部完成：上传 + CDN 刷新已提交");
}

main().catch((err) => {
  console.error("部署失败：", err);
  process.exit(1);
});
