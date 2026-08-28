import { UserValidation } from './user.validation';

describe('User profile validation', () => {
  it('accepts supported profile fields', () => {
    const result = UserValidation.updateProfile.safeParse({
      body: { name: 'Updated User', contactNumber: '+8801700000000', address: 'Dhaka' }
    });
    expect(result.success).toBe(true);
  });

  it('rejects email and role changes through the profile endpoint', () => {
    const result = UserValidation.updateProfile.safeParse({
      body: { email: 'new@example.com', role: 'ADMIN' }
    });
    expect(result.success).toBe(false);
  });

  it('requires a password to deactivate an account', () => {
    expect(UserValidation.deactivateAccount.safeParse({ body: {} }).success).toBe(false);
  });

  it('validates buyer addresses', () => {
    expect(
      UserValidation.createAddress.safeParse({
        body: { label: 'Home', addressLine: '123 Main Road', phone: '+8801700000000' }
      }).success
    ).toBe(true);
  });

  it('accepts display-only card metadata', () => {
    expect(
      UserValidation.createPaymentMethod.safeParse({
        body: { label: 'Primary', brand: 'VISA', last4: '4242', expiry: '12/29' }
      }).success
    ).toBe(true);
  });

  it('rejects full card numbers and CVVs', () => {
    expect(
      UserValidation.createPaymentMethod.safeParse({
        body: {
          label: 'Unsafe',
          brand: 'VISA',
          last4: '4242',
          expiry: '12/29',
          cardNumber: '4242424242424242',
          cvv: '123'
        }
      }).success
    ).toBe(false);
  });

  it('constrains platform percentage fields', () => {
    expect(
      UserValidation.updatePlatformSettings.safeParse({
        body: { commissionRate: 10, paymentGatewayFee: 2.5, defaultCurrency: 'USD' }
      }).success
    ).toBe(true);
    expect(
      UserValidation.updatePlatformSettings.safeParse({ body: { commissionRate: 101 } }).success
    ).toBe(false);
  });
});
