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
const BUILD_META_FILENAME = "version.json";
// ==============================

const ACCESS_KEY = process.env.QINIU_ACCESS_KEY;
const SECRET_KEY = process.env.QINIU_SECRET_KEY;
const DRY_RUN = process.env.QINIU_DRY_RUN === "1";

if ((!ACCESS_KEY || !SECRET_KEY) && !DRY_RUN) {
  console.error("缺少环境变量：QINIU_ACCESS_KEY 或 QINIU_SECRET_KEY");
  process.exit(1);
}

if (!fs.existsSync(DIST_DIR)) {
  console.error(`打包目录不存在：${DIST_DIR}`);
  console.error("请先执行 npm run build");
  process.exit(1);
}

const mac = new qiniu.auth.digest.Mac(ACCESS_KEY || "dry-run-ak", SECRET_KEY || "dry-run-sk");
const BUILD_ID = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const DEPLOYED_AT = new Date().toISOString();
const ENTRY_CACHE_CONTROL = "no-cache, no-store, max-age=0, must-revalidate";
const ASSET_CACHE_CONTROL = "public, max-age=31536000, immutable";
const normalizedSiteDomain = SITE_DOMAIN.replace(/\/+$/, "");

// 上传器
const config = new qiniu.conf.Config();
const formUploader = new qiniu.form_up.FormUploader(config);
const bucketManager = new qiniu.rs.BucketManager(mac, config);

// CDN 管理器
const cdnManager = new qiniu.cdn.CdnManager(mac);

function createUploadToken(key) {
  // 使用 bucket:key 形式，允许覆盖同名文件；bucket 形式只适合新增文件。
  const putPolicy = new qiniu.rs.PutPolicy({ scope: `${BUCKET}:${key}` });
  return putPolicy.uploadToken(mac);
}

function normalizeKey(key) {
  if (KEY_PREFIX && key.startsWith(KEY_PREFIX)) {
    return key.slice(KEY_PREFIX.length);
  }

  return key;
}

function isEntryKey(key) {
  const normalizedKey = normalizeKey(key);
  return normalizedKey.endsWith(".html") || normalizedKey === BUILD_META_FILENAME;
}

function getResponseHeadersForKey(key) {
  const normalizedKey = normalizeKey(key);

  if (normalizedKey.endsWith(".html") || normalizedKey === BUILD_META_FILENAME) {
    return {
      "Cache-Control": ENTRY_CACHE_CONTROL,
    };
  }

  if (normalizedKey.startsWith("assets/")) {
    return {
      "Cache-Control": ASSET_CACHE_CONTROL,
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

function changeMime(key, mimeType) {
  if (DRY_RUN) {
    console.log(`[dry-run] MIME 更新: ${key} -> ${mimeType}`);
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    bucketManager.changeMime(BUCKET, key, mimeType, function (err, body, info) {
      if (err) return reject(err);

      if (info.statusCode === 200) {
        console.log(`MIME 更新成功: ${key} -> ${mimeType}`);
        resolve(body);
      } else {
        reject(
          new Error(
            `MIME 更新失败: ${key}, 状态码: ${info.statusCode}, 响应: ${JSON.stringify(body)}`,
          ),
        );
      }
    });
  });
}

function writeBuildMetadata() {
  const indexHtmlPath = path.join(DIST_DIR, "index.html");

  if (!fs.existsSync(indexHtmlPath)) {
    throw new Error(`找不到入口文件：${indexHtmlPath}`);
  }

  const indexHtml = fs.readFileSync(indexHtmlPath, "utf8");
  const metaTag = `<meta name="x-build-id" content="${BUILD_ID}" />`;
  let nextHtml = indexHtml.replace(/<meta name="x-build-id" content="[^"]*" \/>\s*/g, "");

  if (nextHtml.includes("</head>")) {
    nextHtml = nextHtml.replace("</head>", `    ${metaTag}\n  </head>`);
  } else {
    nextHtml += `\n${metaTag}\n`;
  }

  fs.writeFileSync(indexHtmlPath, nextHtml, "utf8");

  const versionPayload = {
    buildId: BUILD_ID,
    deployedAt: DEPLOYED_AT,
  };

  fs.writeFileSync(
    path.join(DIST_DIR, BUILD_META_FILENAME),
    `${JSON.stringify(versionPayload, null, 2)}\n`,
    "utf8",
  );

  console.log(`构建版本已写入: ${BUILD_ID}`);
}

function toQiniuKey(localFile) {
  const relativePath = path.relative(DIST_DIR, localFile).replace(/\\/g, "/");
  return `${KEY_PREFIX}${relativePath}`;
}

function uploadFile(localFile) {
  const key = toQiniuKey(localFile);
  const uploadToken = createUploadToken(key);
  // 每个文件都使用独立的 PutExtra，避免第一个文件的 mimeType 污染后续上传。
  const putExtra = new qiniu.form_up.PutExtra();

  if (DRY_RUN) {
    console.log(`[dry-run] 上传: ${key}`);
    return Promise.resolve({ key, mimeType: putExtra.mimeType });
  }

  return new Promise((resolve, reject) => {
    formUploader.putFile(uploadToken, key, localFile, putExtra, function (err, body, info) {
      if (err) return reject(err);

      if (info.statusCode === 200) {
        console.log(`上传成功: ${key}`);
        resolve({ key, mimeType: putExtra.mimeType });
      } else {
        reject(new Error(`上传失败: ${key}, 状态码: ${info.statusCode}, 响应: ${JSON.stringify(body)}`));
      }
    });
  });
}

function changeHeaders(key, headers) {
  if (DRY_RUN) {
    console.log(`[dry-run] 响应头更新: ${key} -> ${JSON.stringify(headers)}`);
    return Promise.resolve(null);
  }

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
  if (DRY_RUN) {
    console.log("[dry-run] CDN 刷新提交成功");
    console.log({ urls });
    return Promise.resolve({ urls });
  }

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

function toPublicUrl(key) {
  if (!key) {
    return `${normalizedSiteDomain}/`;
  }

  return `${normalizedSiteDomain}/${key}`;
}

async function main() {
  writeBuildMetadata();

  const files = walk(DIST_DIR).sort((leftFile, rightFile) => {
    const leftKey = toQiniuKey(leftFile);
    const rightKey = toQiniuKey(rightFile);
    const priorityDiff = Number(isEntryKey(leftKey)) - Number(isEntryKey(rightKey));

    return priorityDiff || leftKey.localeCompare(rightKey);
  });

  if (!files.length) {
    console.log("打包目录里没有文件可上传");
    return;
  }

  console.log(`开始上传，共 ${files.length} 个文件...`);

  const uploadedKeys = [];
  for (const file of files) {
    const { key, mimeType } = await uploadFile(file);
    const headers = getResponseHeadersForKey(key);

    if (mimeType) {
      await changeMime(key, mimeType);
    }

    if (headers) {
      await changeHeaders(key, headers);
    }

    uploadedKeys.push(key);
  }

  // 只刷新入口文件。资源文件带 hash，新 URL 天然避开旧缓存。
  const refreshList = [
    toPublicUrl(),
    ...uploadedKeys.filter(isEntryKey).map((key) => toPublicUrl(key)),
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
