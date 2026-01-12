# Monetization Guide

This guide covers different monetization strategies for your meditation app.

## Table of Contents

1. [Subscription Model (Recommended)](#subscription-model)
2. [Ad-Based Revenue](#ad-based-revenue)
3. [One-Time Purchases](#one-time-purchases)
4. [Hybrid Approach](#hybrid-approach)

---

## Subscription Model (Recommended)

Similar to Headspace and Calm, offering subscriptions provides recurring revenue.

### Using RevenueCat

RevenueCat simplifies subscription management across iOS and Android.

#### 1. Install Dependencies

```bash
npm install react-native-purchases
npx pod-install # iOS only
```

#### 2. Set Up RevenueCat Account

1. Create account at [https://www.revenuecat.com/](https://www.revenuecat.com/)
2. Create a new app
3. Configure:
   - **iOS**: Add your App Store Connect credentials
   - **Android**: Add your Google Play credentials

#### 3. Create Subscription Products

**App Store Connect (iOS):**
- Go to App Store Connect > Your App > Subscriptions
- Create subscription group
- Add subscriptions:
  - Monthly: $9.99/month
  - Yearly: $59.99/year (save 50%)
  - Weekly: $4.99/week (optional)

**Google Play Console (Android):**
- Go to Play Console > Your App > Monetize > Subscriptions
- Create subscriptions with same pricing

#### 4. Configure RevenueCat

1. In RevenueCat dashboard:
   - Add your iOS and Android subscription product IDs
   - Create entitlements (e.g., "premium")
   - Create offerings (e.g., "default")

#### 5. Implementation

Create `src/utils/purchases.ts`:

```typescript
import Purchases, { PurchasesOffering } from 'react-native-purchases';

const REVENUE_CAT_API_KEY_IOS = 'your_ios_key';
const REVENUE_CAT_API_KEY_ANDROID = 'your_android_key';

export const initializePurchases = async () => {
  if (Platform.OS === 'ios') {
    await Purchases.configure({ apiKey: REVENUE_CAT_API_KEY_IOS });
  } else if (Platform.OS === 'android') {
    await Purchases.configure({ apiKey: REVENUE_CAT_API_KEY_ANDROID });
  }
};

export const getOfferings = async (): Promise<PurchasesOffering | null> => {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  } catch (error) {
    console.error('Error getting offerings:', error);
    return null;
  }
};

export const purchasePackage = async (packageToPurchase: any) => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
    return customerInfo.entitlements.active['premium'] !== undefined;
  } catch (error) {
    console.error('Error purchasing package:', error);
    return false;
  }
};

export const checkPremiumStatus = async (): Promise<boolean> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active['premium'] !== undefined;
  } catch (error) {
    console.error('Error checking premium status:', error);
    return false;
  }
};

export const restorePurchases = async (): Promise<boolean> => {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo.entitlements.active['premium'] !== undefined;
  } catch (error) {
    console.error('Error restoring purchases:', error);
    return false;
  }
};
```

#### 6. Create Paywall Screen

Create `src/screens/PaywallScreen.tsx`:

```typescript
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PurchasesPackage } from 'react-native-purchases';
import { getOfferings, purchasePackage } from '../utils/purchases';

export default function PaywallScreen({ onDismiss, onSuccess }) {
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    const offering = await getOfferings();
    if (offering) {
      setPackages(offering.availablePackages);
    }
  };

  const handlePurchase = async (pkg: PurchasesPackage) => {
    const success = await purchasePackage(pkg);
    if (success) {
      onSuccess();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unlock Premium</Text>
      <Text style={styles.subtitle}>
        Get unlimited access to all meditations
      </Text>

      {packages.map((pkg) => (
        <TouchableOpacity
          key={pkg.identifier}
          style={styles.package}
          onPress={() => handlePurchase(pkg)}
        >
          <Text style={styles.packageTitle}>
            {pkg.product.title}
          </Text>
          <Text style={styles.packagePrice}>
            {pkg.product.priceString}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity onPress={onDismiss}>
        <Text style={styles.close}>Maybe later</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  package: {
    backgroundColor: '#6B4CE6',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  packageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  packagePrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
  close: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
});
```

---

## Ad-Based Revenue

Use Google AdMob for free users.

### 1. Install Dependencies

```bash
npx expo install expo-ads-admob
```

### 2. Set Up AdMob

1. Create account at [https://admob.google.com/](https://admob.google.com/)
2. Create ad units:
   - Banner ads (for bottom of screens)
   - Interstitial ads (between meditation sessions)
   - Rewarded ads (unlock free content)

### 3. Configure app.json

```json
{
  "expo": {
    "plugins": [
      [
        "expo-ads-admob",
        {
          "androidAppId": "ca-app-pub-xxxxx~xxxxx",
          "iosAppId": "ca-app-pub-xxxxx~xxxxx"
        }
      ]
    ]
  }
}
```

### 4. Implementation

```typescript
import { AdMobBanner, AdMobInterstitial } from 'expo-ads-admob';

// Banner Ad Component
export function BannerAd() {
  return (
    <AdMobBanner
      bannerSize="smartBannerPortrait"
      adUnitID="ca-app-pub-xxxxx/xxxxx" // Replace with your ad unit ID
      servePersonalizedAds={true}
      onDidFailToReceiveAdWithError={(error) => console.error(error)}
    />
  );
}

// Interstitial Ad (show after meditation)
export async function showInterstitialAd() {
  await AdMobInterstitial.setAdUnitID('ca-app-pub-xxxxx/xxxxx');
  await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
  await AdMobInterstitial.showAdAsync();
}
```

### When to Show Ads

- **Banner ads**: On free content screens (not during meditation)
- **Interstitial ads**: After completing a free meditation
- **Rewarded ads**: Offer free premium content for watching

---

## One-Time Purchases

Offer lifetime access or individual content packs.

### Using Expo In-App Purchases

```bash
npx expo install expo-in-app-purchases
```

### Implementation

```typescript
import * as InAppPurchases from 'expo-in-app-purchases';

const LIFETIME_ACCESS_SKU = 'lifetime_premium';

export const purchaseLifetimeAccess = async () => {
  try {
    await InAppPurchases.connectAsync();
    await InAppPurchases.purchaseItemAsync(LIFETIME_ACCESS_SKU);
    // Handle successful purchase
  } catch (error) {
    console.error('Purchase error:', error);
  } finally {
    await InAppPurchases.disconnectAsync();
  }
};
```

---

## Hybrid Approach (Recommended)

Combine multiple revenue streams:

### Tier Structure

1. **Free Tier**
   - Limited meditations (5-10)
   - Banner ads
   - Basic categories

2. **Premium Monthly ($9.99/month)**
   - All meditations
   - No ads
   - Offline downloads
   - New content weekly

3. **Premium Yearly ($59.99/year)**
   - Everything in monthly
   - 50% savings
   - Early access to new features

4. **Lifetime Access ($99.99 one-time)**
   - Everything in premium
   - One-time payment
   - Forever access

### Implementation Strategy

```typescript
export type UserTier = 'free' | 'premium_monthly' | 'premium_yearly' | 'lifetime';

export const canAccessMeditation = (
  meditation: Meditation,
  userTier: UserTier
): boolean => {
  if (userTier !== 'free') return true;
  return !meditation.isPremium;
};

export const shouldShowAds = (userTier: UserTier): boolean => {
  return userTier === 'free';
};
```

---

## Pricing Recommendations

Based on competitor analysis (Headspace, Calm, Insight Timer):

### Subscriptions
- **Weekly**: $4.99 - $6.99
- **Monthly**: $9.99 - $14.99
- **Yearly**: $59.99 - $69.99 (typically 50-60% off monthly rate)

### One-Time
- **Lifetime**: $99.99 - $199.99
- **Content Packs**: $4.99 - $9.99 each

### Free Trial
- Offer 7-day free trial to increase conversions
- Require payment method upfront
- Auto-renew after trial

---

## Best Practices

1. **Freemium Model**
   - Offer enough free content to demonstrate value
   - Lock advanced features behind paywall
   - Show value proposition clearly

2. **Conversion Optimization**
   - Show paywall after user engages (not immediately)
   - Highlight most popular plan
   - Emphasize annual savings

3. **Retention**
   - Add new content regularly
   - Send push notifications for new content
   - Track usage and re-engage inactive users

4. **A/B Testing**
   - Test different pricing
   - Test paywall timing
   - Test subscription copy

5. **Legal Compliance**
   - Privacy policy (required for ads)
   - Terms of service
   - Auto-renewal disclosures
   - GDPR compliance (if serving EU users)

---

## Analytics & Tracking

Track key metrics:

- **Conversion Rate**: Free → Paid
- **Churn Rate**: Subscription cancellations
- **ARPU**: Average Revenue Per User
- **LTV**: Lifetime Value
- **Trial Conversion**: Trial → Paid

### Recommended Tools

- **RevenueCat**: Built-in analytics
- **Google Analytics**: User behavior
- **Mixpanel**: Advanced analytics
- **Amplitude**: Product analytics

---

## Next Steps

1. Choose your monetization model
2. Set up RevenueCat or AdMob accounts
3. Create subscription products in app stores
4. Implement paywall/ads
5. Test purchases in sandbox mode
6. Submit for app review
7. Launch and monitor metrics

## Resources

- [RevenueCat Documentation](https://docs.revenuecat.com/)
- [Google AdMob](https://admob.google.com/)
- [App Store Connect](https://appstoreconnect.apple.com/)
- [Google Play Console](https://play.google.com/console)
