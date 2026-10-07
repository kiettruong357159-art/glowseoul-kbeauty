'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  ChevronRight,
  ArrowLeft,
  Check,
  ShoppingBag,
  RotateCcw,
  ShieldCheck,
  Heart,
  Droplets,
  Flame,
  Feather,
  Sun,
  Smile,
  Zap,
  Tag
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/lib/utils';

// Quiz Question Steps
const SKIN_TYPES = [
  {
    id: 'oily',
    title: 'Da Dầu / Hỗn Hợp Thiên Dầu',
    desc: 'Đổ dầu nhiều vùng chữ T hoặc toàn mặt, lỗ chân lông to, dễ lên mụn đầu đen & mụn viêm.',
    icon: Flame,
    color: '#3b82f6',
  },
  {
    id: 'dry',
    title: 'Da Khô / Hỗn Hợp Thiên Khô',
    desc: 'Da căng rát sau khi rửa mặt, thiếu ẩm, dễ bong tróc vảy mỏng khi thời tiết hanh khô.',
    icon: Droplets,
    color: '#06b6d4',
  },
  {
    id: 'sensitive',
    title: 'Da Nhạy Cảm / Dễ Kích Ứng',
    desc: 'Hàng rào bảo vệ mỏng yếu, dễ ửng đỏ, ngứa rát khi đổi thời tiết hoặc dùng mỹ phẩm lạ.',
    icon: Feather,
    color: '#ec4899',
  },
  {
    id: 'normal',
    title: 'Da Thường / Cân Bằng Khỏe Mạnh',
    desc: 'Nền da ổn định, độ ẩm cân bằng, ít khuyết điểm, muốn dưỡng sáng và duy trì thanh xuân.',
    icon: Smile,
    color: '#10b981',
  },
];

const SKIN_CONCERNS = [
  {
    id: 'acne',
    title: 'Mụn, Bít Tắc & Lỗ Chân Lông',
    desc: 'Cần làm sạch sâu bã nhờn, kháng viêm, gom cồi mụn và se khít lỗ chân lông.',
  },
  {
    id: 'hydration',
    title: 'Cấp Nước Đa Tầng & Khóa Ẩm',
    desc: 'Bơm căng mọng độ ẩm cho da ngậm nước, hạn chế nếp nhăn li ti do mất nước.',
  },
  {
    id: 'soothing',
    title: 'Làm Dịu Mẩn Đỏ & Phục Hồi Hàng Rào',
    desc: 'Tái tạo da sau treatment/nắng gắt, giảm kích ứng với tinh chất làm dịu tự nhiên.',
  },
  {
    id: 'brightening',
    title: 'Dưỡng Sáng Đều Màu & Mờ Thâm Nám',
    desc: 'Đánh bay thâm mụn, ức chế melanin, mang lại làn da trắng hồng rạng rỡ chuẩn Hàn.',
  },
];

const ROUTINE_GOALS = [
  {
    id: 'glass_skin',
    title: 'Làn Da Glass Skin Căng Bóng Chuẩn Seoul',
    desc: 'Routine nhiều tầng dưỡng ẩm chuyên sâu để đạt hiệu ứng da bóng khỏe tự nhiên như idol Hàn.',
    badge: 'PHỔ BIẾN NHẤT',
  },
  {
    id: 'minimal',
    title: 'Routine Tối Giản Nhưng Hiệu Quả Tối Đa',
    desc: 'Tập trung vào 4 bước cốt lõi thiết yếu, kết cấu thấm nhanh không bết dính trong 30 giây.',
    badge: 'NHANH GỌN',
  },
  {
    id: 'intensive_repair',
    title: 'Phục Hồi Cấp Tốc Cho Da Yếu / Tổn Thương',
    desc: 'Ưu tiên tối đa các hoạt chất thuần chay làm dịu như Rau má, Diếp cá và Men vi sinh.',
    badge: 'CHUYÊN SÂU',
  },
];

interface RoutineStep {
  stepNumber: number;
  stepName: string;
  product: {
    id: string;
    name: string;
    brand: string;
    price: number;
    originalPrice?: number | null;
    image: string;
  };
  reason: string;
}

interface RoutineResult {
  profile: {
    skinType: string;
    concern: string;
    goal: string;
    routineTitle: string;
    routineDesc: string;
  };
  steps: RoutineStep[];
  pricing: {
    originalTotal: number;
    discountPercent: number;
    discountAmount: number;
    finalPrice: number;
    couponCode: string;
  };
}

export default function RoutineQuizPage() {
  const { addItem, setIsCartOpen } = useCart();
  const { showSuccess, showError } = useToast();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedSkinType, setSelectedSkinType] = useState<string>('oily');
  const [selectedConcern, setSelectedConcern] = useState<string>('acne');
  const [selectedGoal, setSelectedGoal] = useState<string>('glass_skin');

  const [loadingResult, setLoadingResult] = useState<boolean>(false);
  const [result, setResult] = useState<RoutineResult | null>(null);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((s) => s + 1);
    } else {
      generateRoutine();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    }
  };

  const generateRoutine = async () => {
    setLoadingResult(true);
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skinType: selectedSkinType,
          concern: selectedConcern,
          goal: selectedGoal,
        }),
      });

      if (!res.ok) {
        showError('Không thể tạo phác đồ, vui lòng thử lại');
        setLoadingResult(false);
        return;
      }

      const data: RoutineResult = await res.json();
      setResult(data);
      setCurrentStep(4); // 4 means results page
    } catch {
      showError('Có lỗi xảy ra khi tạo Routine');
    } finally {
      setLoadingResult(false);
    }
  };

  const handleAddBundleToCart = () => {
    if (!result || !result.steps) return;

    // Add each product to cart
    result.steps.forEach((step) => {
      addItem(
        {
          id: step.product.id,
          name: step.product.name,
          price: step.product.price,
          originalPrice: step.product.originalPrice,
          image: step.product.image,
          brand: step.product.brand,
        },
        1
      );
    });

    // Save 10% bundle coupon to localStorage
    if (result.pricing.couponCode) {
      try {
        localStorage.setItem('glowseoul_pending_coupon', result.pricing.couponCode);
      } catch {}
    }

    showSuccess('Đã thêm trọn bộ 4 bước Routine và lưu mã giảm 10% (KBEAUTY10)!');
    setIsCartOpen(true);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setResult(null);
  };

  return (
    <div style={{ minHeight: '85vh', padding: '40px 0 80px', background: 'var(--color-bg, #fafafa)' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        {/* Header Breadcrumb & Title */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: '#ffe4e6',
              color: '#e11d48',
              fontSize: '12px',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              marginBottom: '12px',
            }}
          >
            <Sparkles size={14} /> Trắc Nghiệm Thông Minh Chuẩn Da Hàn Quốc
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-0.5px', marginBottom: '8px' }}>
            Tìm Routine K-Beauty Hoàn Hảo Cho Làn Da Bạn
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', maxWidth: '580px', margin: '0 auto' }}>
            Chỉ với 3 câu hỏi nhanh, hệ thống sẽ đề xuất trọn bộ 4 bước chăm sóc da tối ưu kèm ưu đãi <strong>10%</strong> độc quyền.
          </p>
        </div>

        {/* Progress Bar (Visible during quiz steps 1-3) */}
        {currentStep <= 3 && (
          <div style={{ marginBottom: '36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: 'var(--color-text-muted)' }}>
              <span>Bước {currentStep}/3: {currentStep === 1 ? 'Loại da của bạn' : currentStep === 2 ? 'Vấn đề cần ưu tiên' : 'Mục tiêu dưỡng da'}</span>
              <span>{Math.round((currentStep / 3) * 100)}% Hoàn thành</span>
            </div>
            <div style={{ height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${(currentStep / 3) * 100}%`,
                  background: 'var(--color-gradient-brand)',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        )}

        {/* STEP 1: SKIN TYPE */}
        {currentStep === 1 && (
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              padding: '36px',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--color-border)',
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '6px' }}>
              1. Bạn cảm thấy da mặt mình thuộc loại nào nhất?
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
              Quan sát tình trạng da vào buổi sáng sau khi thức dậy hoặc sau khi rửa mặt 30 phút.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {SKIN_TYPES.map((type) => {
                const isSelected = selectedSkinType === type.id;
                const IconComp = type.icon;
                return (
                  <div
                    key={type.id}
                    onClick={() => setSelectedSkinType(type.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px',
                      padding: '18px 20px',
                      borderRadius: 'var(--radius-md)',
                      border: '2px solid',
                      borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                      background: isSelected ? 'var(--color-bg-subtle, #fdf8f7)' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: isSelected ? 'var(--color-primary-light, #fce7f3)' : '#f3f4f6',
                        color: isSelected ? 'var(--color-primary)' : type.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <IconComp size={22} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                        {type.title}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                        {type.desc}
                      </div>
                    </div>
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: '2px solid',
                        borderColor: isSelected ? 'var(--color-primary)' : '#d1d5db',
                        background: isSelected ? 'var(--color-primary)' : 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        marginTop: '4px',
                      }}
                    >
                      {isSelected && <Check size={14} />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '28px' }}>
              <button
                onClick={handleNext}
                className="btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 28px',
                  fontSize: '15px',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                <span>Tiếp tục</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SKIN CONCERN */}
        {currentStep === 2 && (
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              padding: '36px',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--color-border)',
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '6px' }}>
              2. Nỗi bận tâm lớn nhất về da bạn muốn cải thiện ngay?
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
              Chọn ưu tiên chính để chúng tôi tinh chỉnh các hoạt chất điều trị chuyên sâu.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {SKIN_CONCERNS.map((concern) => {
                const isSelected = selectedConcern === concern.id;
                return (
                  <div
                    key={concern.id}
                    onClick={() => setSelectedConcern(concern.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '18px 20px',
                      borderRadius: 'var(--radius-md)',
                      border: '2px solid',
                      borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                      background: isSelected ? 'var(--color-bg-subtle, #fdf8f7)' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                        {concern.title}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                        {concern.desc}
                      </div>
                    </div>
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: '2px solid',
                        borderColor: isSelected ? 'var(--color-primary)' : '#d1d5db',
                        background: isSelected ? 'var(--color-primary)' : 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        flexShrink: 0,
                        marginLeft: '12px',
                      }}
                    >
                      {isSelected && <Check size={14} />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '28px' }}>
              <button
                onClick={handleBack}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-border)',
                  background: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                <ArrowLeft size={16} /> Quay lại
              </button>
              <button
                onClick={handleNext}
                className="btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 28px',
                  fontSize: '15px',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                <span>Tiếp tục</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ROUTINE GOAL */}
        {currentStep === 3 && (
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              padding: '36px',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--color-border)',
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '6px' }}>
              3. Phong cách dưỡng da mà bạn yêu thích nhất?
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
              Chúng tôi sẽ phối hợp sản phẩm sao cho kết cấu thẩm thấu hài hòa và dễ chịu nhất.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {ROUTINE_GOALS.map((goal) => {
                const isSelected = selectedGoal === goal.id;
                return (
                  <div
                    key={goal.id}
                    onClick={() => setSelectedGoal(goal.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      padding: '18px 20px',
                      borderRadius: 'var(--radius-md)',
                      border: '2px solid',
                      borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                      background: isSelected ? 'var(--color-bg-subtle, #fdf8f7)' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-text-main)' }}>
                          {goal.title}
                        </span>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: '800',
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-full)',
                            background: '#ffe4e6',
                            color: '#e11d48',
                          }}
                        >
                          {goal.badge}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                        {goal.desc}
                      </div>
                    </div>
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: '2px solid',
                        borderColor: isSelected ? 'var(--color-primary)' : '#d1d5db',
                        background: isSelected ? 'var(--color-primary)' : 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        flexShrink: 0,
                        marginLeft: '12px',
                        marginTop: '4px',
                      }}
                    >
                      {isSelected && <Check size={14} />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '28px' }}>
              <button
                onClick={handleBack}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-border)',
                  background: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                <ArrowLeft size={16} /> Quay lại
              </button>
              <button
                onClick={generateRoutine}
                disabled={loadingResult}
                className="btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 32px',
                  fontSize: '15px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: '800',
                }}
              >
                {loadingResult ? (
                  <span>Đang tổng hợp Routine...</span>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Xem Phác Đồ Skincare Của Tôi</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: ROUTINE RESULTS */}
        {currentStep === 4 && result && (
          <div>
            {/* Diagnosis Banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #ffffff 100%)',
                borderRadius: 'var(--radius-lg)',
                padding: '32px',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-md)',
                marginBottom: '32px',
                textAlign: 'center',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: '800',
                  color: 'var(--color-primary)',
                  background: 'white',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: 'var(--shadow-xs)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  marginBottom: '12px',
                }}
              >
                <Sparkles size={14} /> Phác Đồ Độc Quyền Cho Bạn
              </span>
              <h2 style={{ fontSize: '26px', fontWeight: '900', color: 'var(--color-text-main)', marginBottom: '8px' }}>
                {result.profile.routineTitle}
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6' }}>
                {result.profile.routineDesc}
              </p>
            </div>

            {/* 4 Steps Progression */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '36px' }}>
              {result.steps.map((step) => (
                <div
                  key={step.stepNumber}
                  style={{
                    background: 'white',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    padding: '24px',
                    display: 'grid',
                    gridTemplateColumns: 'minmax(80px, 100px) 1fr auto',
                    gap: '20px',
                    alignItems: 'center',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                  className="responsive-grid-1"
                >
                  {/* Step Image */}
                  <Link
                    href={`/products/${step.product.id}`}
                    style={{
                      position: 'relative',
                      width: '100px',
                      height: '100px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: '#f9fafb',
                      flexShrink: 0,
                      display: 'block',
                    }}
                  >
                    <Image
                      src={step.product.image}
                      alt={step.product.name}
                      fill
                      style={{ objectFit: 'contain', padding: '6px' }}
                    />
                  </Link>

                  {/* Step Info & Reason */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '800',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: 'var(--color-primary-light, #fce7f3)',
                          color: 'var(--color-primary)',
                        }}
                      >
                        BƯỚC {step.stepNumber}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-muted)' }}>
                        {step.stepName}
                      </span>
                    </div>

                    <Link
                      href={`/products/${step.product.id}`}
                      style={{
                        fontSize: '16px',
                        fontWeight: '800',
                        color: 'var(--color-text-main)',
                        textDecoration: 'none',
                        lineHeight: '1.4',
                        display: 'block',
                        marginBottom: '6px',
                      }}
                    >
                      <span style={{ color: 'var(--color-primary)' }}>[{step.product.brand}]</span> {step.product.name}
                    </Link>

                    <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: '1.5', margin: 0, background: '#fafafa', padding: '8px 12px', borderRadius: '6px' }}>
                      💡 <strong>Tại sao chọn sản phẩm này:</strong> {step.reason}
                    </p>
                  </div>

                  {/* Step Price */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-primary)' }}>
                      {formatPrice(step.product.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bundle Checkout Box */}
            <div
              style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                padding: '32px',
                border: '2px solid var(--color-primary)',
                boxShadow: 'var(--shadow-lg)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#15803d',
                  background: '#dcfce7',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '13px',
                  fontWeight: '700',
                  marginBottom: '12px',
                }}
              >
                <Tag size={14} /> Ưu đãi Combo trọn bộ Routine (Mã KBEAUTY10)
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '14px', marginBottom: '8px' }}>
                <span style={{ fontSize: '20px', color: 'var(--color-text-subtle)', textDecoration: 'line-through' }}>
                  {formatPrice(result.pricing.originalTotal)}
                </span>
                <span style={{ fontSize: '32px', fontWeight: '900', color: 'var(--color-primary)' }}>
                  {formatPrice(result.pricing.finalPrice)}
                </span>
                <span
                  style={{
                    background: '#e11d48',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: '800',
                  }}
                >
                  -10%
                </span>
              </div>

              <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
                Tiết kiệm ngay <strong>{formatPrice(result.pricing.discountAmount)}</strong> khi rinh trọn bộ 4 món chăm sóc da chuẩn chuyên gia!
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <button
                  onClick={handleAddBundleToCart}
                  className="btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px 32px',
                    fontSize: '16px',
                    fontWeight: '800',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  <ShoppingBag size={20} />
                  <span>Thêm trọn bộ vào giỏ hàng</span>
                </button>

                <button
                  onClick={handleReset}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '14px 24px',
                    fontSize: '15px',
                    fontWeight: '600',
                    borderRadius: 'var(--radius-full)',
                    background: 'white',
                    border: '1px solid var(--color-border)',
                    cursor: 'pointer',
                  }}
                >
                  <RotateCcw size={16} />
                  <span>Làm lại trắc nghiệm</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
