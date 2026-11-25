import React, { useState } from 'react';
import {
  Linking,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Alert } from '../../components/AppDialog.js';
import { Ionicons } from '@expo/vector-icons';
import { hp, rf, rs, wp } from '../../utils/responsive';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const plans = [
  {
    name: 'FREE',
    price: '₹0',
    period: '',
    subtitle: 'Basic Player',
    icon: 'person-outline',
    color: '#9CA3AF',
    benefits: [
      'Standard avatar and gamer ID',
      '2 profile backgrounds',
      'Basic profile frame',
      'Standard badges',
      'Basic gaming statistics',
      'Limited customization',
    ],
  },
  {
    name: 'BRONZE',
    price: '₹49',
    period: '/ month',
    subtitle: 'Starter Premium',
    icon: 'medal-outline',
    color: '#CD7F32',
    benefits: [
      'Everything in FREE',
      '5 premium backgrounds',
      '5 profile frames',
      'Custom username colors',
      'Bronze membership badge',
      '3 additional profile themes',
    ],
  },
  {
    name: 'SILVER',
    price: '₹99',
    period: '/ month',
    subtitle: 'Popular Choice',
    icon: 'star-outline',
    color: '#C0C0C0',
    popular: true,
    benefits: [
      'Everything in BRONZE',
      'Animated profile frames',
      'Premium profile backgrounds',
      'Custom username effects',
      'Exclusive Silver badges',
      'Advanced player statistics',
      'Ad-free experience',
    ],
  },
  {
    name: 'GOLD',
    price: '₹199',
    period: '/ month',
    subtitle: 'Elite Membership',
    icon: 'trophy-outline',
    color: '#FFD700',
    benefits: [
      'Everything in SILVER',
      'Exclusive animated frames',
      'Premium animated backgrounds',
      'Custom gamer title',
      'Gold membership badge',
      'Exclusive profile effects',
      'Unlimited theme selection',
      'Advanced performance analytics',
    ],
  },
];

const UPI_ID = '7569950113@ybl';
const UPI_NAME = 'Esports India';

const platformRules = [
  'Membership does not guarantee tournament entry or prizes.',
  'No competitive advantage is based on membership.',
  'Membership cannot increase match-winning chances.',
  'Separately purchased cosmetic items should remain available according to their stated ownership terms.',
  "Expired membership does not delete a player's profile or tournament history.",
];

export default function PlansScreen() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const insets = useSafeAreaInsets();

  const handlePlanAction = async (plan) => {
    const isFreePlan = plan.name === 'FREE';
    if (isFreePlan) {
      const message = 'The FREE plan is available at no cost.';
      if (Platform.OS === 'web') {
        Alert.alert('', message);
      } else {
        Alert.alert('Get started', message);
      }
      return;
    }

    const amount = Number(plan.price.replace(/[^\d.]/g, ''));
    const paymentUrl = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(
      UPI_NAME
    )}&am=${amount}&cu=INR&tn=${encodeURIComponent(`${plan.name} membership`)}`;

    setSelectedPlan(null);
    try {
      await Linking.openURL(paymentUrl);
      const message = `Finish paying ₹${amount} in your UPI app. Payment is not automatically verified, so this action alone will not activate your membership.`;
      if (Platform.OS === 'web') {
        Alert.alert('', message);
      } else {
        Alert.alert('Complete payment', message);
      }
    } catch (error) {
      console.error('Unable to open UPI payment:', error);
      const message = `Unable to open a UPI app. Pay ₹${amount} to ${UPI_ID} using a UPI app. Payment is not automatically verified.`;
      if (Platform.OS === 'web') {
        Alert.alert('', message);
      } else {
        Alert.alert('Unable to open UPI app', message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.stickyHeader, { paddingTop: Math.max(hp(1.5), insets.top + hp(0.5)) }]}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Membership Plans</Text>
          <Ionicons name="sparkles-outline" size={rs(20)} color="#FFD700" />
        </View>
        <Text style={styles.subtitle}>Find your style. Make your profile stand out.</Text>
      </View>

      <ScrollView
        style={styles.plansScrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Important platform rules</Text>
          {platformRules.map((rule) => (
            <View key={rule} style={styles.platformRule}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.ruleValue}>{rule}</Text>
            </View>
          ))}
        </View>

        {plans.map((plan) => (
          <View key={plan.name} style={[styles.planCard, plan.popular && styles.popularCard]}>
            {plan.popular ? (
              <View style={styles.popularBadge}>
                <Text style={styles.popularBadgeText}>POPULAR</Text>
              </View>
            ) : null}
            <View style={styles.planHeader}>
              <View style={[styles.icon, { backgroundColor: `${plan.color}20` }]}>
                <Ionicons name={plan.icon} size={rs(27)} color={plan.color} />
              </View>
              <View style={styles.planHeading}>
                <Text style={[styles.planName, { color: plan.color }]}>{plan.name}</Text>
                <Text style={styles.planSubtitle}>{plan.subtitle}</Text>
              </View>
              <View style={styles.priceBlock}>
                <Text style={styles.price}>{plan.price}</Text>
                {plan.period ? <Text style={styles.period}>{plan.period}</Text> : null}
              </View>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => setSelectedPlan(plan)}
                accessibilityRole="button"
                accessibilityLabel={`View ${plan.name} plan details`}
              >
                <Text style={styles.detailsButtonText}>View details</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.subscribeButton, { backgroundColor: plan.color }]}
                onPress={() => handlePlanAction(plan)}
                accessibilityRole="button"
                accessibilityLabel={plan.name === 'FREE' ? 'Get started with the FREE plan' : `Subscribe to ${plan.name}`}
              >
                <Text style={styles.subscribeButtonText}>
                  {plan.name === 'FREE' ? 'Get started' : 'Subscribe'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

      </ScrollView>

      <Modal
        visible={Boolean(selectedPlan)}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedPlan(null)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setSelectedPlan(null)}
            accessibilityRole="button"
            accessibilityLabel="Close plan details"
          />
          <View style={styles.modalCard}>
            {selectedPlan ? (
              <>
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={[styles.planName, { color: selectedPlan.color }]}>
                      {selectedPlan.name}
                    </Text>
                    <Text style={styles.planSubtitle}>{selectedPlan.subtitle}</Text>
                  </View>
                  <Text style={styles.modalPrice}>
                    {selectedPlan.price}
                    {selectedPlan.period ? ` ${selectedPlan.period}` : ''}
                  </Text>
                </View>
                <ScrollView style={styles.modalScroll}>
                  <Text style={styles.modalSectionTitle}>Included benefits</Text>
                  {selectedPlan.benefits.map((benefit) => (
                    <View key={benefit} style={styles.benefitRow}>
                      <Ionicons name="checkmark-circle" size={rs(18)} color={selectedPlan.color} />
                      <Text style={styles.benefitText}>{benefit}</Text>
                    </View>
                  ))}
                </ScrollView>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => setSelectedPlan(null)}
                  >
                    <Text style={styles.detailsButtonText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.subscribeButton, { backgroundColor: selectedPlan.color }]}
                    onPress={() => handlePlanAction(selectedPlan)}
                    accessibilityRole="button"
                    accessibilityLabel={selectedPlan.name === 'FREE' ? 'Get started with the FREE plan' : `Subscribe to ${selectedPlan.name}`}
                  >
                    <Text style={styles.subscribeButtonText}>
                      {selectedPlan.name === 'FREE' ? 'Get started' : 'Subscribe'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : null}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141E30',
  },
  stickyHeader: {
    paddingHorizontal: wp(5),
    paddingTop: hp(3),
    paddingBottom: hp(1.5),
    backgroundColor: '#141E30',
    borderBottomWidth: 1,
    borderBottomColor: '#2A3441',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  plansScrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: wp(5),
    paddingTop: hp(1.5),
    paddingBottom: hp(6),
  },
  title: {
    color: '#FFFFFF',
    fontSize: rf(24),
    fontWeight: 'bold',
    flexShrink: 1,
  },
  subtitle: {
    color: '#D1D5DB',
    fontSize: rf(13),
    marginTop: hp(0.6),
  },
  planCard: {
    backgroundColor: '#1A1F2E',
    borderWidth: 1,
    borderColor: '#2A3441',
    borderRadius: rs(12),
    padding: wp(4),
    marginBottom: hp(1.5),
  },
  popularCard: {
    borderColor: '#C0C0C0',
  },
  popularBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#C0C0C0',
    borderRadius: rs(10),
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.35),
    marginBottom: hp(1),
  },
  popularBadgeText: {
    color: '#141E30',
    fontSize: rf(9),
    fontWeight: 'bold',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: rs(46),
    height: rs(46),
    borderRadius: rs(23),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
  },
  planHeading: {
    flex: 1,
  },
  planName: {
    fontSize: rf(16),
    fontWeight: 'bold',
  },
  planSubtitle: {
    color: '#D1D5DB',
    fontSize: rf(12),
    marginTop: hp(0.25),
  },
  priceBlock: {
    alignItems: 'flex-end',
  },
  price: {
    color: '#FFFFFF',
    fontSize: rf(21),
    fontWeight: 'bold',
  },
  period: {
    color: '#9CA3AF',
    fontSize: rf(10),
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: wp(2),
    marginBottom: hp(0.45),
  },
  benefitText: {
    flex: 1,
    color: '#D1D5DB',
    fontSize: rf(12),
    lineHeight: rf(17),
  },
  buttonRow: {
    flexDirection: 'row',
    gap: wp(2),
    marginTop: hp(0.5),
  },
  detailsButton: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1,
    borderColor: '#64748B',
    borderRadius: rs(8),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(2),
  },
  detailsButtonText: {
    color: '#FFFFFF',
    fontSize: rf(12),
    fontWeight: '600',
  },
  subscribeButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: rs(8),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(2),
  },
  subscribeButtonText: {
    color: '#141E30',
    fontSize: rf(12),
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#1A1F2E',
    borderWidth: 1,
    borderColor: '#2A3441',
    borderRadius: rs(12),
    padding: wp(4),
    marginTop: hp(1),
    marginBottom: hp(1.5),
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: rf(17),
    fontWeight: 'bold',
    marginBottom: hp(1.2),
  },
  ruleValue: {
    flex: 1,
    color: '#D1D5DB',
    fontSize: rf(12),
    lineHeight: rf(17),
    textAlign: 'left',
  },
  platformRule: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: wp(2),
    marginBottom: hp(0.8),
  },
  bullet: {
    color: '#FFD700',
    fontSize: rf(15),
    lineHeight: rf(17),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  modalCard: {
    maxHeight: '85%',
    backgroundColor: '#141E30',
    borderTopLeftRadius: rs(18),
    borderTopRightRadius: rs(18),
    paddingHorizontal: wp(5),
    paddingTop: hp(2.5),
    paddingBottom: hp(3),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  modalPrice: {
    color: '#FFFFFF',
    fontSize: rf(18),
    fontWeight: 'bold',
  },
  modalScroll: {
    flexShrink: 1,
    marginBottom: hp(1.5),
  },
  modalSectionTitle: {
    color: '#FFFFFF',
    fontSize: rf(15),
    fontWeight: 'bold',
    marginBottom: hp(1.2),
  },
});
