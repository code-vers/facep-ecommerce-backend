import type { UserRole } from '../../interfaces/auth.interface';
import type { CardBrand, PaymentMethod } from '@prisma/client';

export interface IChangeRolePayload {
  role: UserRole;
}

export interface IUpdateProfilePayload {
  name?: string;
  contactNumber?: string | null;
  address?: string | null;
  avatarUrl?: string | null;
}

export interface IDeactivateAccountPayload {
  currentPassword: string;
}

export interface IAddressPayload {
  label: string;
  addressLine: string;
  phone: string;
  isDefault?: boolean;
}

export interface IPaymentMethodPayload {
  label: string;
  brand: CardBrand;
  last4: string;
  expiry: string;
  isDefault?: boolean;
}

export interface IPlatformSettingsPayload {
  siteName?: string;
  adminEmail?: string | null;
  supportEmail?: string | null;
  address?: string | null;
  defaultCurrency?: string;
  defaultTimezone?: string;
  commissionRate?: number;
  paymentGatewayFee?: number;
}

export interface IPaymentPreferencePayload {
  preferredPaymentMethod: PaymentMethod;
}
