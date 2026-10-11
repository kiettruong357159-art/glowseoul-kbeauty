/**
 * GLOWSEOUL K-BEAUTY - CODE RULES & ARCHITECTURE VERIFIER
 * 
 * Script kiểm tra tĩnh (Static Architecture Linter) tự động hóa việc rà soát các 
 * nguyên tắc kỹ thuật cốt lõi được định nghĩa trong PROJECT_RULES_TEMPLATE.md
 * 
 * Chạy trước khi commit/push qua Git Hook (pre-push) hoặc CI/CD GitHub Actions:
 *   npx tsx scripts/verify-code-rules.ts
 */

import * as fs from 'fs';
import * as path from 'path';

interface RuleViolation {
  file: string;
  line?: number;
  message: string;
  rule: string;
}

const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');

const violations: RuleViolation[] = [];
const warnings: string[] = [];

// Helper: Scan recursive files with extensions
function getFiles(dir: string, extensions: string[]): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(filePath, extensions));
    } else {
      if (extensions.some((ext) => file.endsWith(ext))) {
        results.push(filePath);
      }
    }
  }
  return results;
}

// ============================================================================
// CHECK 1: CHỐNG VỠ ẢNH TOÀN HỆ THỐNG (Image Fallback Resiliency - Section I.5 & VII)
// ============================================================================
function checkImageResiliency() {
  console.log('🔍 [Rule 1] Kiểm tra quy chuẩn Fallback ảnh toàn hệ thống...');
  const tsxFiles = getFiles(SRC_DIR, ['.tsx', '.jsx']);

  for (const filePath of tsxFiles) {
    // Bỏ qua SafeImage.tsx vì chính nó định nghĩa cơ chế fallback
    if (filePath.endsWith('SafeImage.tsx')) continue;

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Tìm thẻ <img trần
      if (line.includes('<img')) {
        // Tìm toàn bộ thẻ img từ vị trí này cho đến khi đóng thẻ '>'
        let fullImgTag = '';
        for (let j = i; j < Math.min(lines.length, i + 15); j++) {
          fullImgTag += ' ' + lines[j];
          if (lines[j].includes('>')) break;
        }

        const hasOnError = fullImgTag.includes('onError');
        if (!hasOnError) {
          violations.push({
            file: path.relative(ROOT_DIR, filePath),
            line: i + 1,
            rule: 'Rule 1: Chống vỡ ảnh toàn hệ thống (Image Fallback Resiliency)',
            message: 'Thẻ <img> không có thuộc tính onError fallback. Khuyến nghị thay thế bằng <SafeImage /> hoặc bổ sung onError={e => { e.currentTarget.src = DEFAULT_PRODUCT_IMAGE; }}.',
          });
        }
      }
    }
  }
}

// ============================================================================
// CHECK 2: BẢO VỆ PHÂN QUYỀN & CHỐNG FOUC (Dual-Layer Edge Middleware - Section I.2 & VIII.3)
// ============================================================================
function checkEdgeMiddlewareProtection() {
  console.log('🔍 [Rule 2] Kiểm tra lớp bảo vệ Edge Middleware & Chống FOUC...');
  const middlewarePath = path.join(SRC_DIR, 'middleware.ts');

  if (!fs.existsSync(middlewarePath)) {
    violations.push({
      file: 'src/middleware.ts',
      rule: 'Rule 2: Bảo vệ phân quyền & Chống FOUC',
      message: 'Không tìm thấy file src/middleware.ts! Tuyến nhạy cảm (/admin, /account) bắt buộc phải được bảo vệ tại Edge Network.',
    });
    return;
  }

  const content = fs.readFileSync(middlewarePath, 'utf-8');
  if (!content.includes('/admin') || !content.includes('/account')) {
    violations.push({
      file: 'src/middleware.ts',
      rule: 'Rule 2: Bảo vệ phân quyền & Chống FOUC',
      message: 'src/middleware.ts chưa cấu hình chặn bảo vệ các tuyến nhạy cảm /admin hoặc /account.',
    });
  }

  // Kiểm tra Admin page có skeleton guard khi loading không
  const adminPagePath = path.join(SRC_DIR, 'app', 'admin', 'page.tsx');
  if (fs.existsSync(adminPagePath)) {
    const adminContent = fs.readFileSync(adminPagePath, 'utf-8');
    if (!adminContent.includes('AdminDashboardSkeleton') && !adminContent.includes('skeleton')) {
      violations.push({
        file: 'src/app/admin/page.tsx',
        rule: 'Rule 2: Chống FOUC',
        message: 'Trang quản trị /admin bắt buộc phải render AdminDashboardSkeleton khi phiên đang xác thực (loading state).',
      });
    }
  }
}

// ============================================================================
// CHECK 3: SKELETONS TÙY BIẾN TỪNG ROUTE (Tailored Route Skeletons - Section I.2 & VII.2)
// ============================================================================
function checkRouteSkeletons() {
  console.log('🔍 [Rule 3] Kiểm tra hệ thống Route Loading Skeletons (CLS = 0)...');
  const requiredRoutes = [
    { route: 'Trang chủ (/)', path: 'src/app/loading.tsx' },
    { route: 'Danh mục sản phẩm (/products)', path: 'src/app/products/loading.tsx' },
    { route: 'Chi tiết sản phẩm (/products/[id])', path: 'src/app/products/[id]/loading.tsx' },
    { route: 'Tài khoản người dùng (/account)', path: 'src/app/account/loading.tsx' },
    { route: 'Quản trị viên (/admin)', path: 'src/app/admin/loading.tsx' },
    { route: 'Thanh toán (/checkout)', path: 'src/app/checkout/loading.tsx' },
    { route: 'Theo dõi đơn hàng (/orders/[id])', path: 'src/app/orders/[id]/loading.tsx' },
    { route: 'Trắc nghiệm da (/quiz)', path: 'src/app/quiz/loading.tsx' },
  ];

  for (const item of requiredRoutes) {
    const fullPath = path.join(ROOT_DIR, item.path);
    if (!fs.existsSync(fullPath)) {
      violations.push({
        file: item.path,
        rule: 'Rule 3: Route Skeletons Chuyên Biệt',
        message: `Thiếu file ${item.path} cho ${item.route}. Mỗi trang con bắt buộc có loading.tsx riêng biệt để triệt tiêu CLS.`,
      });
    } else {
      const content = fs.readFileSync(fullPath, 'utf-8');
      if (content.length < 50) {
        violations.push({
          file: item.path,
          rule: 'Rule 3: Route Skeletons Chuyên Biệt',
          message: `File ${item.path} quá ngắn hoặc chưa định nghĩa layout khung xương skeleton.`,
        });
      }
      if (content.includes('Đang tải...') || content.includes('Vui lòng chờ...')) {
        violations.push({
          file: item.path,
          rule: 'Rule 3: Cấm text loading thô',
          message: `File ${item.path} chứa dòng text thô ("Đang tải..."). Bắt buộc sử dụng shimmer skeleton components.`,
        });
      }
    }
  }
}

// ============================================================================
// CHECK 4: CHỐNG DOUBLE SUBMIT (Anti-Double Submit / Action Guard - Section I.2)
// ============================================================================
function checkAntiDoubleSubmit() {
  console.log('🔍 [Rule 4] Kiểm tra chốt chặn Anti-Double Submit trên Form Actions...');
  const keyForms = [
    'src/components/admin/ProductFormModal.tsx',
    'src/components/admin/FlashSaleManager.tsx',
    'src/components/checkout/CheckoutForm.tsx',
    'src/components/auth/AuthModal.tsx',
  ];

  for (const relPath of keyForms) {
    const fullPath = path.join(ROOT_DIR, relPath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const hasDisabledCondition =
        content.includes('disabled={loading') ||
        content.includes('disabled={isSubmitting') ||
        content.includes('disabled={isPending') ||
        content.includes('disabled={submitting');

      if (!hasDisabledCondition) {
        warnings.push(`[Cảnh báo] File ${relPath} nên đảm bảo nút Submit có trạng thái disabled khi đang gửi request.`);
      }
    }
  }
}

// ============================================================================
// CHECK 5: CSDL PRISMA COMPOSITE INDEXES & TRANSACTIONS (Section I.3 & III.1)
// ============================================================================
function checkDatabaseIntegrity() {
  console.log('🔍 [Rule 5] Kiểm tra cấu hình Prisma Schema & Composite Indexes...');
  const schemaPath = path.join(ROOT_DIR, 'prisma', 'schema.prisma');
  if (!fs.existsSync(schemaPath)) {
    violations.push({
      file: 'prisma/schema.prisma',
      rule: 'Rule 5: CSDL & Prisma',
      message: 'Không tìm thấy file prisma/schema.prisma!',
    });
    return;
  }

  const content = fs.readFileSync(schemaPath, 'utf-8');
  if (!content.includes('@@index([orderStatus, createdAt])') || !content.includes('@@index([paymentStatus, createdAt])')) {
    violations.push({
      file: 'prisma/schema.prisma',
      rule: 'Rule 5: CSDL Composite Indexes',
      message: 'Bảng Order thiếu composite index @@index([orderStatus, createdAt]) hoặc @@index([paymentStatus, createdAt]).',
    });
  }
}

// ============================================================================
// CHECK 6: KỶ LUẬT ZERO DEAD CODE (Zero Unused Elements & Compiler Strictness)
// ============================================================================
function checkDeadCodeDiscipline() {
  console.log('🔍 [Rule 6] Kiểm tra kỷ luật Zero Dead Code (noUnusedLocals & noUnusedParameters)...');
  const tsconfigPath = path.join(ROOT_DIR, 'tsconfig.json');
  if (!fs.existsSync(tsconfigPath)) {
    violations.push({
      file: 'tsconfig.json',
      rule: 'Rule 6: Zero Dead Code',
      message: 'Không tìm thấy file tsconfig.json!',
    });
    return;
  }

  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
  const options = tsconfig.compilerOptions || {};

  if (!options.noUnusedLocals) {
    violations.push({
      file: 'tsconfig.json',
      rule: 'Rule 6: Zero Dead Code',
      message: 'Bắt buộc kích hoạt compilerOptions.noUnusedLocals = true để cấm biến và import không dùng.',
    });
  }

  if (!options.noUnusedParameters) {
    violations.push({
      file: 'tsconfig.json',
      rule: 'Rule 6: Zero Dead Code',
      message: 'Bắt buộc kích hoạt compilerOptions.noUnusedParameters = true để cấm tham số hàm không dùng.',
    });
  }
}

// ============================================================================
// CHECK 7: CHỐNG DEBUGGER & CONSOLE.LOG RÁC TRONG PRODUCTION
// ============================================================================
function checkNoDebuggerOrConsoleLogs() {
  console.log('🔍 [Rule 7] Kiểm tra cấm debugger và console.log trong mã nguồn src/...');
  const allSourceFiles = getFiles(SRC_DIR, ['.ts', '.tsx', '.js', '.jsx']);

  for (const filePath of allSourceFiles) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Kiểm tra debugger
      if (line.includes('debugger;') || line.trim() === 'debugger') {
        violations.push({
          file: path.relative(ROOT_DIR, filePath),
          line: i + 1,
          rule: 'Rule 7: Cấm Debugger trong Production',
          message: 'Phát hiện lệnh debugger; sót lại trong mã nguồn. Bắt buộc xóa trước khi push.',
        });
      }

      // Kiểm tra console.log (chỉ cho phép console.error hoặc console.warn)
      if (line.includes('console.log(') && !line.trim().startsWith('//')) {
        violations.push({
          file: path.relative(ROOT_DIR, filePath),
          line: i + 1,
          rule: 'Rule 7: Cấm console.log rác trong Production',
          message: 'Phát hiện lệnh console.log() trong mã nguồn. Vui lòng xóa hoặc thay thế bằng console.error / console.warn nếu là log ngoại lệ.',
        });
      }
    }
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================
function runAllChecks() {
  console.log('================================================================');
  console.log('🚀 [GLOWSEOUL] BẮT ĐẦU KIỂM TRA QUY CHUẨN CODE (PRE-PUSH PIPELINE)');
  console.log('================================================================');

  checkImageResiliency();
  checkEdgeMiddlewareProtection();
  checkRouteSkeletons();
  checkAntiDoubleSubmit();
  checkDatabaseIntegrity();
  checkDeadCodeDiscipline();
  checkNoDebuggerOrConsoleLogs();

  console.log('----------------------------------------------------------------');

  if (warnings.length > 0) {
    console.log(`⚠️  Có ${warnings.length} lưu ý:`);
    for (const w of warnings) {
      console.log(`   - ${w}`);
    }
    console.log('----------------------------------------------------------------');
  }

  if (violations.length > 0) {
    console.error(`❌ PHÁT HIỆN ${violations.length} VI PHẠM QUY CHUẨN CODE:`);
    console.error('Lệnh push bị chặn để bảo vệ chất lượng dự án!\n');

    violations.forEach((v, index) => {
      console.error(`[Lỗi #${index + 1}] ${v.rule}`);
      console.error(`  📁 Tệp tin : ${v.file}${v.line ? ` (Dòng: ${v.line})` : ''}`);
      console.error(`  💬 Chi tiết: ${v.message}`);
      console.error('');
    });

    console.error('👉 Vui lòng sửa các lỗi trên trước khi push lại.');
    process.exit(1);
  }

  console.log('✅ 100% CÁC QUY CHUẨN KỸ THUẬT (PROJECT RULES) ĐỀU ĐẠT CHUẨN!');
  console.log('================================================================');
  process.exit(0);
}

runAllChecks();
