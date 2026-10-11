/**
 * GLOWSEOUL K-BEAUTY - GIT HOOKS SETUP
 * Tự động thiết lập pre-push git hook cho mọi thành viên dự án
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT_DIR = path.resolve(__dirname, '..');
const GIT_HOOKS_DIR = path.join(ROOT_DIR, '.git', 'hooks');

function setupHooks() {
  if (!fs.existsSync(path.join(ROOT_DIR, '.git'))) {
    console.log('ℹ️ Thư mục .git không tồn tại, bỏ qua thiết lập git hooks.');
    return;
  }

  if (!fs.existsSync(GIT_HOOKS_DIR)) {
    fs.mkdirSync(GIT_HOOKS_DIR, { recursive: true });
  }

  const prePushScript = `#!/bin/sh
# GLOWSEOUL K-BEAUTY - PRE-PUSH QUALITY GATEWAY PIPELINE
# Tự động kích hoạt kiểm tra toàn diện trước khi cho phép đẩy code lên GitHub / Vercel

echo ""
echo "======================================================================"
echo "🛡️  [GLOWSEOUL PRE-PUSH PIPELINE] BẮT ĐẦU KIỂM TRA CHẤT LƯỢNG MÃ NGUỒN"
echo "======================================================================"
echo ""

# 1. Kiểm tra các Quy Chuẩn Kỹ Thuật (Project Rules)
echo "📋 [Bước 1/4] Đang quét quy chuẩn kiến trúc & Project Rules..."
npm run check:rules
if [ $? -ne 0 ]; then
  echo ""
  echo "❌ [PRE-PUSH THẤT BẠI]: Vi phạm quy chuẩn kiến trúc. Hủy lệnh push!"
  exit 1
fi

# 2. Kiểm tra TypeScript Compilation
echo ""
echo "🔍 [Bước 2/4] Đang kiểm tra lỗi biên dịch TypeScript (tsc --noEmit)..."
npm run check:types
if [ $? -ne 0 ]; then
  echo ""
  echo "❌ [PRE-PUSH THẤT BẠI]: Phát hiện lỗi kiểu dữ liệu TypeScript. Hủy lệnh push!"
  exit 1
fi

# 3. Kiểm tra Kiểm Thử Tự Động (Automated Vitest Tests)
echo ""
echo "🧪 [Bước 3/4] Đang chạy toàn bộ test suites (npm test)..."
npm test
if [ $? -ne 0 ]; then
  echo ""
  echo "❌ [PRE-PUSH THẤT BẠI]: Một hoặc nhiều bài test bị thất bại. Hủy lệnh push!"
  exit 1
fi

# 4. Kiểm tra Biên Dịch Bản Sản Phẩm (Next.js Production Build)
echo ""
echo "🏗️  [Bước 4/4] Đang chạy biên dịch thử nghiệm (npm run build)..."
npm run build
if [ $? -ne 0 ]; then
  echo ""
  echo "❌ [PRE-PUSH THẤT BẠI]: Bản build Next.js thất bại. Hủy lệnh push!"
  exit 1
fi

echo ""
echo "======================================================================"
echo "🎉 [PRE-PUSH THÀNH CÔNG] MÃ NGUỒN ĐẠT 100% TIÊU CHUẨN! TIẾP TỤC PUSH..."
echo "======================================================================"
echo ""
exit 0
`;

  const prePushPath = path.join(GIT_HOOKS_DIR, 'pre-push');
  fs.writeFileSync(prePushPath, prePushScript, { mode: 0o755, encoding: 'utf-8' });

  // Đảm bảo phân quyền thực thi trên Unix/WSL/Git Bash
  try {
    fs.chmodSync(prePushPath, 0o755);
  } catch {
    // Windows ignore
  }

  console.log('✅ Đã thiết lập thành công Git Hook: .git/hooks/pre-push');
}

setupHooks();
