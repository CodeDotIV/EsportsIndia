import React, { useEffect, useState } from 'react';
import {
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Alert } from '../../../components/AppDialog.js';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Application from 'expo-application';
import { useNavigation } from '@react-navigation/native';
import { signOut } from '../../../services/supabaseAuth';
import { supabase } from '../../../services/supabase';
import { getItem, removeItem, setItem } from '../../../utils/storageHelper';
import { hp, rf, rs, wp } from '../../../utils/responsive';

const sections = [
  { key: 'account', title: 'Account & Profile', icon: 'person-circle-outline', route: 'SettingsAccount' },
  { key: 'membership', title: 'Membership & Subscription', icon: 'card-outline', route: 'SettingsMembership' },
  { key: 'privacy', title: 'Privacy & Security', icon: 'shield-checkmark-outline', route: 'SettingsPrivacy' },
  { key: 'preferences', title: 'App Preferences', icon: 'options-outline', route: 'SettingsPreferences' },
  { key: 'tournaments', title: 'Esports & Tournament Rules', icon: 'trophy-outline', route: 'SettingsTournaments' },
  { key: 'support', title: 'Help & Support', icon: 'help-circle-outline', route: 'SettingsSupport' },
  { key: 'legal', title: 'Legal & Policies', icon: 'document-text-outline', route: 'SettingsLegal' },
  { key: 'about', title: 'About & App Information', icon: 'information-circle-outline', route: 'SettingsAbout' },
];

const unavailable = 'Not configured yet';

const sectionGroups = {
  account: [
    {
      title: 'Profile Management',
      rows: [
        { label: 'View Profile', action: 'profile' },
        { label: 'Edit Profile', action: 'profile' },
        { label: 'Change Username', action: 'profile' },
        { label: 'Profile Picture', detail: unavailable },
        { label: 'Avatar Customization', detail: unavailable },
        { label: 'Gamer ID', action: 'profile' },
        { label: 'Gaming Bio', action: 'profile' },
      ],
    },
    {
      title: 'Account Information',
      rows: [
        { label: 'Registered Email', valueKey: 'email' },
        { label: 'Registered Mobile Number', valueKey: 'phone' },
        { label: 'Email Verification Status', valueKey: 'emailVerified' },
        { label: 'Phone Verification Status', valueKey: 'phoneVerified' },
        { label: 'Account Creation Date', valueKey: 'createdAt' },
        { label: 'Account Status', valueKey: 'accountStatus' },
      ],
    },
    {
      title: 'Login Methods',
      rows: [
        { label: 'Google Account Linking', valueKey: 'googleAccount', detail: 'Additional account linking is not configured.' },
        { label: 'Email & Password', detail: 'Google sign-in is currently enabled.' },
        { label: 'Change Password', detail: 'Password sign-in is not enabled for this app.' },
        { label: 'Login Methods Management', detail: unavailable },
      ],
    },
  ],
  membership: [
    {
      title: 'My Membership',
      rows: [
        { label: 'Current Membership Plan', detail: 'Membership records are not connected.' },
        { label: 'Membership Status', detail: unavailable },
        { label: 'Membership ID', detail: unavailable },
        { label: 'Membership Start Date', detail: unavailable },
        { label: 'Membership Expiry Date', detail: unavailable },
        { label: 'Next Renewal Date', detail: unavailable },
        { label: 'Membership Benefits', detail: unavailable },
      ],
    },
    {
      title: 'Available Membership Plans',
      rows: [
        { label: 'FREE Plan – ₹0', action: 'plans' },
        { label: 'BRONZE Plan – ₹49/month', action: 'plans' },
        { label: 'SILVER Plan – ₹99/month', action: 'plans' },
        { label: 'GOLD Plan – ₹199/month', action: 'plans' },
        { label: 'Compare Membership Plans', action: 'plans' },
        { label: 'Upgrade Membership', action: 'plans' },
        { label: 'Downgrade Membership', detail: unavailable },
      ],
    },
    {
      title: 'Subscription Management',
      rows: [
        { label: 'Renew Membership', detail: unavailable },
        { label: 'Enable / Disable Auto-Renewal', detail: unavailable },
        { label: 'Cancel Subscription', detail: unavailable },
        { label: 'Subscription History', detail: unavailable },
        { label: 'Previous Memberships', detail: unavailable },
        { label: 'Expiry Notifications', detail: unavailable },
      ],
    },
    {
      title: 'Payments & Billing',
      rows: [
        { label: 'Payment History', detail: unavailable },
        { label: 'Transaction ID', detail: unavailable },
        { label: 'Payment Date', detail: unavailable },
        { label: 'Payment Amount', detail: unavailable },
        { label: 'Payment Status', detail: unavailable },
        { label: 'Download Invoice', detail: unavailable },
        { label: 'Failed Payments', detail: unavailable },
        { label: 'Refund Status', detail: unavailable },
      ],
    },
    {
      title: 'Membership Policies',
      rows: [
        { label: 'Membership Terms & Conditions', detail: 'Approved policy document not configured.' },
        { label: 'Membership Benefits Policy', detail: 'Approved policy document not configured.' },
        { label: 'Membership Renewal Policy', detail: 'Approved policy document not configured.' },
        { label: 'Membership Cancellation Policy', detail: 'Approved policy document not configured.' },
        { label: 'Membership Expiry Policy', detail: 'Approved policy document not configured.' },
        { label: 'Refund Policy', detail: 'Approved policy document not configured.' },
      ],
    },
    {
      title: 'Membership Rules',
      rows: [
        { label: 'Availability', detail: 'FREE membership is available to every registered user.' },
        { label: 'Activation', detail: 'Paid memberships activate only after successful payment.' },
        { label: 'Duration', detail: 'Paid membership duration is 30 days unless another duration is displayed.' },
        { label: 'Plan Changes', detail: 'Upgrade and downgrade billing rules must be disclosed before they are enabled.' },
        { label: 'Auto-Renewal', detail: 'Auto-renewal requires explicit user consent, and users can cancel recurring renewal.' },
        { label: 'Expiry', detail: 'Expired memberships revert to FREE.' },
        { label: 'Transfer', detail: 'Membership benefits cannot be transferred.' },
        { label: 'Competition', detail: 'Membership does not provide tournament-winning advantages.' },
        { label: 'Tournament Entry & Prizes', detail: 'Tournament participation and prizes are independent of membership.' },
      ],
    },
  ],
  privacy: [
    {
      title: 'Account Security',
      rows: [
        { label: 'Change Password', detail: 'Password sign-in is not enabled for this app.' },
        { label: 'Google Account Linking', detail: unavailable },
        { label: 'Email Verification', detail: 'View verification status in Account & Profile.' },
        { label: 'Phone Verification', detail: unavailable },
        { label: 'Two-Factor Authentication', detail: unavailable },
        { label: 'Login History', detail: unavailable },
        { label: 'Active Devices', detail: unavailable },
        { label: 'Sign Out Other Devices', detail: unavailable },
      ],
    },
    {
      title: 'Privacy Controls',
      rows: [
        { label: 'Profile Visibility', detail: unavailable },
        { label: 'Online Status', detail: unavailable },
        { label: 'Gaming Statistics', detail: unavailable },
        { label: 'Achievements', detail: unavailable },
        { label: 'Match History', detail: unavailable },
        { label: 'Friend Requests', detail: unavailable },
        { label: 'Direct Messages', detail: unavailable },
      ],
    },
    {
      title: 'Data, Permissions & Management',
      rows: [
        { label: 'Personal Data Collection & Usage', detail: 'See the approved Privacy Policy when available.' },
        { label: 'Advertising & Analytics Preferences', detail: unavailable },
        { label: 'Marketing Communication Consent', detail: unavailable },
        { label: 'App Permissions', detail: 'Manage app permissions in your device settings.' },
        { label: 'Third-Party Services', detail: unavailable },
        { label: 'Download My Personal Data', detail: unavailable },
        { label: 'Request Data Correction', detail: 'Profile edits are available from the Profile screen.' },
        { label: 'Request Data Deletion', detail: unavailable },
        { label: 'Delete Account', detail: 'Secure account deletion is not configured.' },
        { label: 'Data Retention Information', detail: unavailable },
        { label: 'Privacy Policy', detail: 'Approved policy document not configured.' },
      ],
    },
    {
      title: 'Security Notifications',
      rows: [
        { label: 'New Login Alerts', detail: unavailable },
        { label: 'Suspicious Login Alerts', detail: unavailable },
        { label: 'Password Change Alerts', detail: unavailable },
        { label: 'Account Activity Alerts', detail: unavailable },
      ],
    },
  ],
  preferences: [
    {
      title: 'Accessibility',
      rows: [
        { label: 'Reduce Animations', preference: 'reduceAnimations', detail: 'Turns off the animated upgrade prompt on your Profile screen.' },
        { label: 'Text Size', detail: unavailable },
        { label: 'High Contrast', detail: unavailable },
        { label: 'Screen Reader Compatibility', detail: 'Screen reader labels are provided where supported.' },
      ],
    },
    {
      title: 'Appearance, Language & Region',
      rows: [
        { label: 'Dark Mode', detail: 'The app currently uses its dark appearance.' },
        { label: 'Light Mode', detail: unavailable },
        { label: 'System Default', detail: unavailable },
        { label: 'App Accent Theme', detail: unavailable },
        { label: 'Profile Theme', detail: unavailable },
        { label: 'App Language', detail: 'English' },
        { label: 'Country / Region', detail: unavailable },
        { label: 'Date Format', detail: unavailable },
        { label: 'Time Format', detail: unavailable },
        { label: 'Time Zone', detail: unavailable },
      ],
    },
    {
      title: 'Notifications, Sound & Display',
      rows: [
        { label: 'Tournament Notifications', detail: unavailable },
        { label: 'Registration Updates & Match Reminders', detail: unavailable },
        { label: 'Match Results & Prize Updates', detail: unavailable },
        { label: 'Membership & Payment Notifications', detail: unavailable },
        { label: 'Promotional Notifications', detail: unavailable },
        { label: 'App Announcements', detail: unavailable },
        { label: 'Sound Effects & Notification Sound', detail: unavailable },
        { label: 'Vibration', detail: unavailable },
        { label: 'Auto-play Videos', detail: unavailable },
        { label: 'Animation Preferences', detail: 'Use Reduce Animations above.' },
      ],
    },
  ],
  tournaments: [
    {
      title: 'Tournament Information & Registration',
      rows: [
        { label: 'Tournament Overview', detail: unavailable },
        { label: 'Eligibility & Age Requirements', detail: unavailable },
        { label: 'Game-Specific Requirements', detail: unavailable },
        { label: 'Team & Individual Participation Rules', detail: unavailable },
        { label: 'Registration Process & Fees', detail: unavailable },
        { label: 'Registration Cancellation & Confirmation', detail: unavailable },
        { label: 'Slot Allocation & Entry Requirements', detail: unavailable },
      ],
    },
    {
      title: 'Matches, Prizes & Fair Play',
      rows: [
        { label: 'Match Format & Scheduling', detail: unavailable },
        { label: 'Check-in & Match Reporting', detail: unavailable },
        { label: 'Disconnections & Technical Issues', detail: unavailable },
        { label: 'Match Result Verification', detail: unavailable },
        { label: 'Prize Structure & Distribution', detail: unavailable },
        { label: 'Winner Verification & Prize Claims', detail: unavailable },
        { label: 'Payment Timeline, Taxes & Unclaimed Prizes', detail: unavailable },
        { label: 'Anti-Cheating, Hacking & Exploits', detail: unavailable },
        { label: 'Account Sharing & Match Fixing', detail: unavailable },
        { label: 'Misconduct, Disqualification & Bans', detail: unavailable },
      ],
    },
    {
      title: 'Disputes',
      rows: [
        { label: 'Report Match Dispute', detail: unavailable },
        { label: 'Submit Evidence', detail: unavailable },
        { label: 'Dispute Review Process', detail: unavailable },
        { label: 'Appeal a Decision', detail: unavailable },
        { label: 'Final Decision Policy', detail: 'Approved policy document not configured.' },
      ],
    },
  ],
  support: [
    {
      title: 'Help Center',
      rows: [
        { label: 'Getting Started', detail: unavailable },
        { label: 'Account, Login & Google Login Help', detail: unavailable },
        { label: 'Membership & Payment Help', detail: unavailable },
        { label: 'Tournament Help', detail: unavailable },
        { label: 'Technical Support', detail: unavailable },
      ],
    },
    {
      title: 'Contact, Reports & Complaints',
      rows: [
        { label: 'Email Support', detail: unavailable },
        { label: 'Contact Form & Support Ticket', detail: unavailable },
        { label: 'Ticket Status & Previous Requests', detail: unavailable },
        { label: 'Report a Player, Cheating or Harassment', detail: unavailable },
        { label: 'Report a Fake Account or Tournament Issue', detail: unavailable },
        { label: 'Submit Screenshots / Evidence', detail: unavailable },
        { label: 'Complaints & Grievances', detail: unavailable },
        { label: 'Grievance Officer & Escalation', detail: 'Contact details are not configured.' },
      ],
    },
    {
      title: 'Feedback',
      rows: [
        { label: 'Suggest a Feature', detail: unavailable },
        { label: 'Submit Feedback', detail: unavailable },
        { label: 'Rate EsportsIndia', detail: unavailable },
        { label: 'Report App Bugs', detail: unavailable },
      ],
    },
  ],
  legal: [
    {
      title: 'Policies',
      rows: [
        { label: 'Terms & Conditions', detail: 'Approved policy document not configured.' },
        { label: 'Privacy Policy', detail: 'Approved policy document not configured.' },
        { label: 'Cookie Policy', detail: 'Approved policy document not configured.' },
        { label: 'Membership Terms & Conditions', detail: 'Approved policy document not configured.' },
        { label: 'Subscription Policy', detail: 'Approved policy document not configured.' },
        { label: 'Refund & Cancellation Policy', detail: 'Approved policy document not configured.' },
        { label: 'Payment & Billing Policy', detail: 'Approved policy document not configured.' },
        { label: 'Tournament Rules', detail: 'Approved policy document not configured.' },
        { label: 'Prize Distribution Policy', detail: 'Approved policy document not configured.' },
        { label: 'Community Guidelines', detail: 'Approved policy document not configured.' },
        { label: 'Fair Play Policy', detail: 'Approved policy document not configured.' },
        { label: 'Anti-Fraud Policy', detail: 'Approved policy document not configured.' },
        { label: 'Advertising Policy', detail: 'Approved policy document not configured.' },
        { label: 'Data Deletion Policy', detail: 'Approved policy document not configured.' },
        { label: 'Grievance Redressal Policy', detail: 'Approved policy document not configured.' },
        { label: 'Copyright Policy', detail: 'Approved policy document not configured.' },
        { label: 'Disclaimer', detail: 'Approved policy document not configured.' },
      ],
    },
    {
      title: 'Legal Information',
      rows: [
        { label: 'Legal Entity / Company Information', detail: unavailable },
        { label: 'Grievance Officer Details', detail: unavailable },
        { label: 'Contact Information', detail: unavailable },
        { label: 'Effective Date, Last Updated & Version', detail: unavailable },
      ],
    },
  ],
  about: [
    {
      title: 'About EsportsIndia',
      rows: [
        { label: 'About Us & Our Mission', detail: unavailable },
        { label: 'Platform Information', detail: 'EsportsIndia' },
        { label: 'Official Website', detail: unavailable },
        { label: 'Social Media Links', detail: 'See the Home screen for current links.' },
      ],
    },
    {
      title: 'Application Information',
      rows: [
        { label: 'App Name', value: Constants.expoConfig?.name || 'EsportsIndia' },
        { label: 'App Version', value: Constants.expoConfig?.version || 'Unavailable' },
        { label: 'Build Number', value: Application.nativeBuildVersion || 'Unavailable on web' },
        { label: 'Release Date', detail: unavailable },
        { label: "What's New", detail: unavailable },
        { label: 'Check for Updates', detail: 'Updates are delivered through the app store or website.' },
      ],
    },
    {
      title: 'Acknowledgements',
      rows: [
        { label: 'Open Source Licenses', detail: 'License details are not configured in the app.' },
        { label: 'Third-Party Libraries', detail: 'See the project package manifest.' },
        { label: 'Copyright Information & Credits', detail: unavailable },
      ],
    },
    {
      title: 'Advanced',
      rows: [
        { label: 'Advanced Settings', action: 'advanced' },
        { label: 'Clear App Cache', detail: 'Safe cache clearing is not configured.' },
        { label: 'Diagnostic Information', action: 'diagnostics' },
        { label: 'Reset App Preferences', action: 'resetPreferences' },
      ],
    },
  ],
};

const findSection = (key) => sections.find((section) => section.key === key);

function Header({ title, onBack }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onBack}
        style={styles.backButton}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="chevron-back" size={rs(24)} color="#FFD700" />
      </TouchableOpacity>
      <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
    </View>
  );
}

function SettingsRow({ label, detail, value, onPress, disabled, control }) {
  const content = (
    <>
      <View style={styles.rowCopy}>
        <Text style={styles.rowTitle}>{label}</Text>
        {detail ? <Text style={styles.rowDetail}>{detail}</Text> : null}
      </View>
      {control || (value ? <Text style={styles.rowValue}>{value}</Text> : null)}
      {onPress ? <Ionicons name="chevron-forward" size={rs(18)} color="#9CA3AF" /> : null}
    </>
  );

  if (!onPress) return <View style={[styles.row, disabled && styles.disabledRow]}>{content}</View>;

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole="button"
    >
      {content}
    </TouchableOpacity>
  );
}

export function SettingsHomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Settings" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.homeContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>Manage your account, preferences, and support options.</Text>
        {sections.map((section) => (
          <TouchableOpacity
            key={section.key}
            style={styles.sectionCard}
            onPress={() => navigation.navigate(section.route)}
            activeOpacity={0.75}
            accessibilityRole="button"
          >
            <View style={styles.sectionIcon}>
              <Ionicons name={section.icon} size={rs(22)} color="#FFD700" />
            </View>
            <View style={styles.sectionCopy}>
              <Text style={styles.sectionLabel}>{section.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={rs(19)} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
        <Text style={styles.availabilityNote}>
          Features that need a connected service or approved policy are clearly identified on their section pages.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsSectionScreen({ navigation, sectionKey }) {
  const section = findSection(sectionKey);
  const [account, setAccount] = useState({});
  const [accountStatus, setAccountStatus] = useState('Loading account…');
  const [reduceAnimations, setReduceAnimations] = useState(false);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [savingPreference, setSavingPreference] = useState(false);

  useEffect(() => {
    if (sectionKey !== 'account') return undefined;
    let active = true;
    const loadAccount = async () => {
      try {
        const [sessionResult, localData] = await Promise.all([
          supabase ? supabase.auth.getSession() : Promise.resolve({ data: { session: null }, error: null }),
          getItem('user'),
        ]);
        if (sessionResult.error) throw sessionResult.error;
        const localUser = localData ? JSON.parse(localData) : {};
        const authUser = sessionResult.data.session?.user;
        if (!active) return;
        setAccount({
          email: authUser?.email || localUser.email || 'Not provided',
          phone: authUser?.phone || localUser.phone || 'Not provided',
          emailVerified: authUser?.email
            ? authUser.email_confirmed_at ? 'Verified' : 'Not verified'
            : 'Not provided',
          phoneVerified: authUser?.phone
            ? authUser.phone_confirmed_at ? 'Verified' : 'Not verified'
            : 'Unavailable',
          googleAccount: authUser?.app_metadata?.provider === 'google' ||
            authUser?.identities?.some((identity) => identity.provider === 'google')
            ? 'Linked'
            : 'Not linked',
          createdAt: authUser?.created_at || localUser.authCreatedAt || 'Unavailable',
          accountStatus: authUser ? 'Active' : 'Not signed in',
        });
        setAccountStatus(authUser ? '' : 'No authenticated account is available.');
      } catch (error) {
        console.error('Failed to load account settings:', error);
        if (active) setAccountStatus('Could not load account information. Please try again later.');
      }
    };
    loadAccount();
    return () => {
      active = false;
    };
  }, [sectionKey]);

  useEffect(() => {
    if (sectionKey !== 'preferences') return undefined;
    let active = true;
    getItem('settings.reduceAnimations')
      .then((value) => {
        if (active) {
          setReduceAnimations(value === 'true');
          setPreferencesLoaded(true);
        }
      })
      .catch((error) => {
        console.error('Failed to load app preferences:', error);
        if (active) {
          setPreferencesLoaded(true);
          showMessage('Settings error', 'Could not load your saved preferences.');
        }
      });
    return () => {
      active = false;
    };
  }, [sectionKey]);

  const showMessage = (title, message) => {
    if (Platform.OS === 'web') Alert.alert('', `${title}: ${message}`);
    else Alert.alert(title, message);
  };

  const navigateToProfile = () => navigation.navigate('Main', { screen: 'Profile' });
  const navigateToPlans = () => navigation.navigate('Main', { screen: 'Plans' });

  const handleAction = async (action) => {
    if (action === 'profile') navigateToProfile();
    else if (action === 'plans') navigateToPlans();
    else if (action === 'advanced') navigation.navigate('SettingsAdvanced');
    else if (action === 'diagnostics') navigation.navigate('SettingsDiagnostics');
    else if (action === 'resetPreferences') {
      try {
        await removeItem('settings.reduceAnimations');
        showMessage('Preferences reset', 'Your locally saved app preferences were reset.');
      } catch (error) {
        console.error('Failed to reset app preferences:', error);
        showMessage('Reset failed', 'Could not reset app preferences.');
      }
    }
  };

  const handlePreferenceChange = async (value) => {
    if (savingPreference) return;
    setSavingPreference(true);
    try {
      await setItem('settings.reduceAnimations', String(value));
      setReduceAnimations(value);
    } catch (error) {
      console.error('Failed to save app preference:', error);
      showMessage('Save failed', 'Could not save your app preference.');
    } finally {
      setSavingPreference(false);
    }
  };

  if (!section) return null;

  const accountValues = {
    ...account,
    createdAt: account.createdAt
      ? account.createdAt === 'Unavailable'
        ? account.createdAt
        : new Date(account.createdAt).toLocaleDateString()
      : 'Loading…',
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title={section.title} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.sectionContent} showsVerticalScrollIndicator={false}>
        {sectionKey === 'account' && accountStatus ? (
          <Text style={styles.availabilityNote}>{accountStatus}</Text>
        ) : null}
        {sectionKey === 'preferences' && (
          <Text style={styles.availabilityNote}>
            Only preferences with a real effect in this app are editable here.
          </Text>
        )}
        {sectionGroups[sectionKey].map((group) => (
          <View key={group.title} style={styles.group}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            {group.rows.map((row) => {
              const isReduceAnimations = row.preference === 'reduceAnimations';
              const value = row.valueKey ? accountValues[row.valueKey] : row.value;
              return (
                <SettingsRow
                  key={row.label}
                  label={row.label}
                  detail={row.detail}
                  value={value}
                  disabled={!row.action && !row.preference}
                  onPress={row.action ? () => handleAction(row.action) : undefined}
                  control={isReduceAnimations ? (
                    <Switch
                      value={reduceAnimations}
                      onValueChange={handlePreferenceChange}
                      disabled={savingPreference || !preferencesLoaded}
                      trackColor={{ false: '#34445C', true: '#8A6D00' }}
                      thumbColor={reduceAnimations ? '#FFD700' : '#D1D5DB'}
                      accessibilityLabel="Reduce animations"
                    />
                  ) : null}
                />
              );
            })}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export function SettingsAccountScreen(props) {
  return <SettingsSectionScreen {...props} sectionKey="account" />;
}

export function SettingsMembershipScreen(props) {
  return <SettingsSectionScreen {...props} sectionKey="membership" />;
}

export function SettingsPrivacyScreen(props) {
  return <SettingsSectionScreen {...props} sectionKey="privacy" />;
}

export function SettingsPreferencesScreen(props) {
  return <SettingsSectionScreen {...props} sectionKey="preferences" />;
}

export function SettingsTournamentsScreen(props) {
  return <SettingsSectionScreen {...props} sectionKey="tournaments" />;
}

export function SettingsSupportScreen(props) {
  return <SettingsSectionScreen {...props} sectionKey="support" />;
}

export function SettingsLegalScreen(props) {
  return <SettingsSectionScreen {...props} sectionKey="legal" />;
}

export function SettingsAboutScreen(props) {
  return <SettingsSectionScreen {...props} sectionKey="about" />;
}

export function SettingsAdvancedScreen({ navigation }) {
  const [showSignOut, setShowSignOut] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const confirmSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });
    } catch (error) {
      console.error('Failed to sign out:', error);
      const message = error instanceof Error ? error.message : 'Please try again.';
      if (Platform.OS === 'web') Alert.alert('', `Sign out failed: ${message}`);
      else Alert.alert('Sign out failed', message);
    } finally {
      setSigningOut(false);
      setShowSignOut(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Advanced Settings" onBack={() => navigation.goBack()} />
      <View style={styles.sectionContent}>
        <View style={styles.group}>
          <Text style={styles.groupTitle}>Account Actions</Text>
          <SettingsRow
            label={signingOut ? 'Signing out…' : 'Sign Out'}
            detail="Your account and saved profile data will not be deleted."
            onPress={() => setShowSignOut(true)}
            disabled={signingOut}
          />
        </View>
      </View>
      <Modal
        transparent
        visible={showSignOut}
        animationType="fade"
        onRequestClose={() => setShowSignOut(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.confirmationCard}>
            <Text style={styles.confirmationTitle}>Sign Out</Text>
            <Text style={styles.confirmationMessage}>
              Are you sure you want to sign out of EsportsIndia?
            </Text>
            <View style={styles.confirmationActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowSignOut(false)}
                disabled={signingOut}
                accessibilityRole="button"
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.signOutButton}
                onPress={confirmSignOut}
                disabled={signingOut}
                accessibilityRole="button"
              >
                <Text style={styles.signOutButtonText}>
                  {signingOut ? 'Signing out…' : 'Sign Out'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export function SettingsDiagnosticsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Diagnostic Information" onBack={() => navigation.goBack()} />
      <View style={styles.sectionContent}>
        <View style={styles.group}>
          <SettingsRow label="App Name" value={Constants.expoConfig?.name || 'EsportsIndia'} />
          <SettingsRow label="App Version" value={Constants.expoConfig?.version || 'Unavailable'} />
          <SettingsRow label="Build Number" value={Application.nativeBuildVersion || 'Unavailable on web'} />
          <SettingsRow label="Platform" value={Platform.OS} />
          <SettingsRow label="Runtime Version" value={Constants.expoConfig?.runtimeVersion || 'Unavailable'} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141E30',
  },
  header: {
    minHeight: rs(58),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    borderBottomWidth: 1,
    borderBottomColor: '#2A3441',
  },
  backButton: {
    width: rs(38),
    height: rs(42),
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: rf(18),
    fontWeight: '700',
  },
  homeContent: {
    padding: wp(5),
    paddingBottom: hp(4),
  },
  intro: {
    color: '#D1D5DB',
    fontSize: rf(13),
    lineHeight: rf(19),
    marginBottom: hp(2),
  },
  sectionCard: {
    minHeight: rs(68),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1F2E',
    borderWidth: 1,
    borderColor: '#2A3441',
    borderRadius: rs(12),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.2),
    marginBottom: hp(1),
  },
  sectionIcon: {
    width: rs(42),
    height: rs(42),
    borderRadius: rs(21),
    backgroundColor: '#283143',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
  },
  sectionCopy: {
    flex: 1,
    gap: hp(0.25),
  },
  sectionLabel: {
    color: '#FFFFFF',
    fontSize: rf(14),
    fontWeight: '600',
  },
  sectionContent: {
    padding: wp(5),
    paddingBottom: hp(4),
  },
  availabilityNote: {
    color: '#D1D5DB',
    backgroundColor: '#1A1F2E',
    borderWidth: 1,
    borderColor: '#34445C',
    borderRadius: rs(10),
    fontSize: rf(12),
    lineHeight: rf(18),
    padding: wp(3.5),
    marginBottom: hp(1.5),
  },
  group: {
    backgroundColor: '#1A1F2E',
    borderWidth: 1,
    borderColor: '#2A3441',
    borderRadius: rs(12),
    paddingHorizontal: wp(3.5),
    paddingTop: hp(1.5),
    paddingBottom: hp(0.5),
    marginBottom: hp(1.5),
  },
  groupTitle: {
    color: '#FFD700',
    fontSize: rf(14),
    fontWeight: '700',
    marginBottom: hp(0.8),
  },
  row: {
    minHeight: rs(48),
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#2A3441',
    paddingVertical: hp(0.9),
    gap: wp(2),
  },
  disabledRow: {
    opacity: 0.88,
  },
  rowCopy: {
    flex: 1,
  },
  rowTitle: {
    color: '#FFFFFF',
    fontSize: rf(12),
    fontWeight: '600',
  },
  rowDetail: {
    color: '#9CA3AF',
    fontSize: rf(10),
    lineHeight: rf(15),
    marginTop: hp(0.3),
  },
  rowValue: {
    maxWidth: wp(42),
    color: '#D1D5DB',
    fontSize: rf(11),
    textAlign: 'right',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(6),
    backgroundColor: 'rgba(0,0,0,0.72)',
  },
  confirmationCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#1A1F2E',
    borderWidth: 1,
    borderColor: '#34445C',
    borderRadius: rs(16),
    padding: wp(5),
  },
  confirmationTitle: {
    color: '#FFFFFF',
    fontSize: rf(18),
    fontWeight: '700',
  },
  confirmationMessage: {
    color: '#D1D5DB',
    fontSize: rf(14),
    lineHeight: rf(21),
    marginTop: hp(1),
  },
  confirmationActions: {
    flexDirection: 'row',
    gap: wp(3),
    marginTop: hp(2.5),
  },
  cancelButton: {
    flex: 1,
    minHeight: rs(44),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#64748B',
    borderRadius: rs(9),
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: rf(13),
    fontWeight: '600',
  },
  signOutButton: {
    flex: 1,
    minHeight: rs(44),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B42332',
    borderRadius: rs(9),
  },
  signOutButtonText: {
    color: '#FFFFFF',
    fontSize: rf(13),
    fontWeight: '700',
  },
});
