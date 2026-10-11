'use client';

import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search, X, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  count?: number;
  subLabel?: string;
}

export interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  enableSearch?: boolean;
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
  id?: string;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = 'Chọn một mục...',
  searchPlaceholder = 'Tìm kiếm nhanh...',
  enableSearch = true,
  style,
  disabled = false,
  id,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuPos, setMenuPos] = useState<{ top: number; left: number; width: number; openUp: boolean } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Tính vị trí menu theo trigger (position: fixed) để không bị cắt bởi overflow của bảng/modal
  const updateMenuPosition = useCallback(() => {
    const trigger = containerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const menuWidth = Math.max(rect.width, 220);
    const estimatedHeight = Math.min(options.length * 38 + (enableSearch ? 46 : 0) + 12, 290);
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < estimatedHeight + 8 && rect.top > spaceBelow;
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - menuWidth - 8));
    setMenuPos({
      top: openUp ? rect.top - 4 : rect.bottom + 4,
      left,
      width: menuWidth,
      openUp,
    });
  }, [options.length, enableSearch]);

  useLayoutEffect(() => {
    if (isOpen) updateMenuPosition();
  }, [isOpen, updateMenuPosition]);

  // Reposition on scroll/resize
  useEffect(() => {
    if (!isOpen) return;
    const handleReposition = (event: Event) => {
      if (menuRef.current && event.target instanceof Node && menuRef.current.contains(event.target)) return;
      updateMenuPosition();
    };
    window.addEventListener('scroll', handleReposition, true);
    window.addEventListener('resize', handleReposition);
    return () => {
      window.removeEventListener('scroll', handleReposition, true);
      window.removeEventListener('resize', handleReposition);
    };
  }, [isOpen, updateMenuPosition]);

  // Close on outside click (trigger + portal menu)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const inTrigger = containerRef.current && containerRef.current.contains(target);
      const inMenu = menuRef.current && menuRef.current.contains(target);
      if (!inTrigger && !inMenu) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && enableSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, enableSearch, menuPos]);

  // Filter options based on search query
  const filteredOptions = options.filter((opt) => {
    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase();
    return (
      opt.label.toLowerCase().includes(query) ||
      (opt.subLabel && opt.subLabel.toLowerCase().includes(query)) ||
      opt.value.toLowerCase().includes(query)
    );
  });

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <div
      ref={containerRef}
      id={id}
      onKeyDown={handleKeyDown}
      style={{
        position: 'relative',
        display: 'inline-block',
        minWidth: '180px',
        ...style,
      }}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          padding: '9px 12px',
          background: disabled ? '#f3f4f6' : 'white',
          border: isOpen ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          fontSize: '13px',
          color: selectedOption ? 'var(--color-text-main)' : 'var(--color-text-muted)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: 'none',
          boxShadow: isOpen ? '0 0 0 3px rgba(255, 107, 129, 0.15)' : 'none',
          transition: 'all 0.2s ease',
          textAlign: 'left',
        }}
      >
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontWeight: selectedOption ? '600' : '400',
            flex: 1,
          }}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        {selectedOption?.count !== undefined && (
          <span
            style={{
              fontSize: '11px',
              padding: '1px 6px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-bg)',
              color: 'var(--color-text-muted)',
              fontWeight: '700',
              flexShrink: 0,
            }}
          >
            {selectedOption.count}
          </span>
        )}

        <ChevronDown
          size={16}
          color="var(--color-text-muted)"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            flexShrink: 0,
          }}
        />
      </button>

      {/* Dropdown Menu (Select2 Style) - render qua portal để không bị overflow cắt */}
      {isOpen && menuPos && typeof document !== 'undefined' && createPortal(
        <div
          ref={menuRef}
          onKeyDown={handleKeyDown}
          style={{
            position: 'fixed',
            top: menuPos.top,
            left: menuPos.left,
            width: menuPos.width,
            transform: menuPos.openUp ? 'translateY(-100%)' : 'none',
            background: 'white',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 10000,
            overflow: 'hidden',
            animation: 'fadeIn 0.15s ease-out',
          }}
        >
          {/* Quick Search Input */}
          {enableSearch && (
            <div
              style={{
                padding: '8px 10px',
                borderBottom: '1px solid var(--color-border-subtle)',
                background: '#fafafa',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Search size={14} color="var(--color-text-muted)" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                style={{
                  width: '100%',
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '12px',
                  color: 'var(--color-text-main)',
                }}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          )}

          {/* Options List */}
          <div
            style={{
              maxHeight: '220px',
              overflowY: 'auto',
              padding: '4px',
            }}
          >
            {filteredOptions.length === 0 ? (
              <div
                style={{
                  padding: '12px',
                  textAlign: 'center',
                  fontSize: '12px',
                  color: 'var(--color-text-muted)',
                }}
              >
                Không tìm thấy kết quả
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: isSelected ? 'var(--color-primary-light)' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.15s ease',
                      outline: 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = '#f9fafb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '13px',
                          fontWeight: isSelected ? '700' : '500',
                          color: isSelected ? 'var(--color-primary)' : 'var(--color-text-main)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {opt.label}
                      </div>
                      {opt.subLabel && (
                        <div
                          style={{
                            fontSize: '11px',
                            color: 'var(--color-text-muted)',
                            marginTop: '2px',
                          }}
                        >
                          {opt.subLabel}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      {opt.count !== undefined && (
                        <span
                          style={{
                            fontSize: '11px',
                            padding: '1px 6px',
                            borderRadius: 'var(--radius-full)',
                            background: isSelected ? 'white' : 'var(--color-bg)',
                            color: isSelected ? 'var(--color-primary)' : 'var(--color-text-muted)',
                            fontWeight: '700',
                          }}
                        >
                          {opt.count}
                        </span>
                      )}
                      {isSelected && <Check size={14} color="var(--color-primary)" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
