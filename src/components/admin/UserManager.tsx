'use client';

import React, { useState, useEffect } from 'react';
import { Search, User, Shield, CheckCircle2, XCircle, Phone, Mail, RotateCw, AlertCircle, Calendar } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import CustomSelect from '@/components/ui/CustomSelect';
import Pagination from '@/components/ui/Pagination';

export interface UserItem {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  phone?: string | null;
  roleId: string;
  roleName: string;
  roleDisplayName: string;
  isActive: boolean;
  createdAt: string;
}

export interface RoleItem {
  id: string;
  name: string;
  displayName: string;
  description?: string | null;
  permissions?: string;
}

interface UserManagerProps {
  onRefreshCounts?: () => Promise<void>;
}

export default function UserManager({ onRefreshCounts }: UserManagerProps) {
  const { showSuccess, showError } = useToast();

  const [users, setUsers] = useState<UserItem[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Filter & Search & Pagination States
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Lỗi khi tải danh sách người dùng');
      }
      setUsers(data.users || []);
      setRoles(data.roles || []);
    } catch (err: any) {
      showError(err?.message || 'Không thể tải danh sách tài khoản');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter]);

  const handleRoleChange = async (userId: string, newRoleName: string) => {
    setUpdatingId(userId);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, roleName: newRoleName }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Lỗi khi đổi vai trò');
      }
      showSuccess(`Đã chuyển vai trò người dùng sang "${newRoleName}"`);
      await loadUsers();
      if (onRefreshCounts) await onRefreshCounts();
    } catch (err: any) {
      showError(err?.message || 'Không thể cập nhật vai trò');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleActive = async (userId: string, currentActive: boolean) => {
    setUpdatingId(userId);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, isActive: !currentActive }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Lỗi khi cập nhật trạng thái');
      }
      showSuccess(`Đã ${!currentActive ? 'kích hoạt' : 'tạm khoá'} tài khoản`);
      await loadUsers();
    } catch (err: any) {
      showError(err?.message || 'Không thể cập nhật trạng thái tài khoản');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter && u.roleName !== roleFilter) return false;
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.phone && u.phone.includes(q))
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return { bg: '#faf5ff', color: '#7e22ce', border: '#e9d5ff' };
      case 'STAFF':
        return { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' };
      default:
        return { bg: '#fdf2f8', color: '#be185d', border: '#fbcfe8' };
    }
  };

  return (
    <div>
      {/* Standard Control Bar: Search + Role Filter + Refresh */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', flex: 1, minWidth: '280px' }}>
          {/* Search Box */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              flex: 1,
              minWidth: '200px',
              maxWidth: '360px',
            }}
          >
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '12px',
                color: 'var(--color-text-muted)',
              }}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên, email, số điện thoại..."
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '13px',
                outline: 'none',
                background: 'var(--color-bg)',
              }}
            />
          </div>

          {/* Role Filter */}
          <CustomSelect
            value={roleFilter}
            onChange={setRoleFilter}
            placeholder={`Tất cả vai trò (${users.length})`}
            options={[
              { value: '', label: `Tất cả vai trò (${users.length})` },
              { value: 'ADMIN', label: 'Quản trị viên (ADMIN)' },
              { value: 'STAFF', label: 'Nhân viên vận hành (STAFF)' },
              { value: 'CUSTOMER', label: 'Khách hàng (CUSTOMER)' },
            ]}
            enableSearch={false}
            style={{ minWidth: '190px' }}
          />
        </div>

        {/* Right Action: Refresh button & counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={loadUsers}
            disabled={loading}
            className="btn-outline"
            title="Tải lại danh sách tài khoản"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 16px',
              fontSize: '13px',
              borderRadius: 'var(--radius-md)',
              background: 'white',
            }}
          >
            <RotateCw size={15} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            <span>Làm mới ({filteredUsers.length})</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div
        style={{
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          overflowX: 'auto',
          background: 'white',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
              <th style={{ padding: '12px 16px', fontWeight: '700' }}>Người dùng</th>
              <th style={{ padding: '12px 16px', fontWeight: '700' }}>Liên hệ</th>
              <th style={{ padding: '12px 16px', fontWeight: '700' }}>Vai trò & Quyền</th>
              <th style={{ padding: '12px 16px', fontWeight: '700' }}>Trạng thái</th>
              <th style={{ padding: '12px 16px', fontWeight: '700' }}>Ngày đăng ký</th>
              <th style={{ padding: '12px 16px', fontWeight: '700', textAlign: 'right' }}>Gán vai trò</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  Đang tải danh sách người dùng & vai trò...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '48px 16px', textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={32} color="var(--color-text-muted)" />
                    <div style={{ fontWeight: '700', color: 'var(--color-text-main)' }}>Không tìm thấy người dùng nào</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      Thử điều chỉnh lại từ khóa hoặc bộ lọc vai trò
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedUsers.map((u) => {
                const badge = getRoleBadgeStyle(u.roleName);

                return (
                  <tr
                    key={u.id}
                    style={{
                      borderBottom: '1px solid var(--color-border-subtle)',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#fafaf9')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                  >
                    {/* User Info */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {u.avatar ? (
                          <img
                            src={u.avatar}
                            alt={u.name}
                            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-border)' }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              background: 'var(--color-primary-light)',
                              color: 'var(--color-primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '14px',
                              fontWeight: '800',
                            }}
                          >
                            <User size={18} />
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: '700', color: 'var(--color-text-main)' }}>{u.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <Mail size={11} /> {u.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Phone */}
                    <td style={{ padding: '12px 16px' }}>
                      {u.phone ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-main)' }}>
                          <Phone size={12} color="var(--color-text-muted)" />
                          <span>{u.phone}</span>
                        </div>
                      ) : (
                        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Chưa cập nhật</span>
                      )}
                    </td>

                    {/* Role Badge */}
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '11px',
                          fontWeight: '800',
                          background: badge.bg,
                          color: badge.color,
                          border: `1px solid ${badge.border}`,
                        }}
                      >
                        <Shield size={12} />
                        <span>{u.roleDisplayName || u.roleName} ({u.roleName})</span>
                      </span>
                    </td>

                    {/* Status Toggle */}
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        type="button"
                        disabled={updatingId === u.id}
                        onClick={() => handleToggleActive(u.id, u.isActive)}
                        title="Bấm để kích hoạt hoặc tạm khoá tài khoản"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          border: `1px solid ${u.isActive ? '#a7f3d0' : '#fecaca'}`,
                          background: u.isActive ? '#ecfdf5' : '#fef2f2',
                          color: u.isActive ? '#059669' : '#dc2626',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {u.isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        <span>{u.isActive ? 'Đang hoạt động' : 'Đã khoá'}</span>
                      </button>
                    </td>

                    {/* Created Date */}
                    <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} />
                        <span>{new Date(u.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </td>

                    {/* Action: Quick Role Switcher */}
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-block', width: '160px' }}>
                        <CustomSelect
                          value={u.roleName}
                          onChange={(newRole) => handleRoleChange(u.id, newRole)}
                          options={[
                            { value: 'ADMIN', label: '👑 ADMIN' },
                            { value: 'STAFF', label: '📦 STAFF' },
                            { value: 'CUSTOMER', label: '🛍️ CUSTOMER' },
                          ]}
                          enableSearch={false}
                          disabled={updatingId === u.id}
                          style={{ fontSize: '12px', padding: '5px 10px' }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredUsers.length}
        pageSize={pageSize}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setCurrentPage(1);
        }}
        pageSizeOptions={[5, 8, 12, 20]}
        itemLabel="người dùng"
      />
    </div>
  );
}
