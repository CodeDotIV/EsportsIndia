import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Platform,
  SafeAreaView,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Responsive breakpoints
const isDesktop = width >= 1024;
const isTablet = width >= 768 && width < 1024;
const isMobile = width < 768;

const WebLandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const [isScrollingUp, setIsScrollingUp] = useState(true);

  // Stats counters
  const [statsVisible, setStatsVisible] = useState(false);
  const tournamentsCount = useRef(new Animated.Value(0)).current;
  const playersCount = useRef(new Animated.Value(0)).current;
  const gamesCount = useRef(new Animated.Value(0)).current;
  const winnersCount = useRef(new Animated.Value(0)).current;

  // Timeline animations
  const [timelineVisible, setTimelineVisible] = useState(false);
  const timelineProgress = useRef(new Animated.Value(0)).current;
  const timelineTitleFade = useRef(new Animated.Value(0)).current;
  const timelineTitleSlide = useRef(new Animated.Value(30)).current;
  
  // Features section animations
  const [featuresVisible, setFeaturesVisible] = useState(false);

  // Featured Games scroll animations
  const [gamesVisible, setGamesVisible] = useState({});
  const gameScrollPositions = useRef({}).current;

  // Timeline section animations
  const [timelineCardsVisible, setTimelineCardsVisible] = useState({});
  
  // Timeline Features (Built for Gamers) cards animations
  const [timelineFeaturesCardsVisible, setTimelineFeaturesCardsVisible] = useState({});

  // Tournament Features section animations
  const [tournamentFeaturesVisible, setTournamentFeaturesVisible] = useState(false);
  const [tournamentFeaturesCardsVisible, setTournamentFeaturesCardsVisible] = useState({});

  // FAQ section state
  const [openFAQ, setOpenFAQ] = useState(0); // First FAQ open by default
  
  // Navigation active state
  const [activeNav, setActiveNav] = useState('home');
  
  // Navigation handler with highlight and zoom
  const handleNavClick = (navId, sectionId) => {
    setActiveNav(navId);
    setMobileMenuOpen(false);
    
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      if (navId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };
  
  // NavItem Component with highlight and zoom
  const NavItem = ({ id, label, sectionId }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const isActive = activeNav === id;
    
    const handlePress = () => {
      // Zoom in animation
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          tension: 300,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 300,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
      
      handleNavClick(id, sectionId);
    };
    
    return (
      <TouchableOpacity
        style={styles.navItem}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.navItemInner,
            isActive && styles.navItemActive,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={[styles.navText, isActive && styles.navTextActive]}>
            {label}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    // Initial animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Handle scroll for header effect, stats, and timeline
    const handleScroll = () => {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        const scrollPosition = window.scrollY;
        setIsScrolled(scrollPosition > 50);
        
        // Detect scroll direction
        const scrollDifference = scrollPosition - lastScrollY.current;
        const scrollingUp = scrollDifference < 0;
        setIsScrollingUp(scrollingUp);
        lastScrollY.current = scrollPosition;
        
        // Show navbar when scrolling up, hide when scrolling down (only if scrolled past threshold)
        if (scrollPosition > 50) {
          Animated.timing(headerOpacity, {
            toValue: scrollingUp ? 1 : 0,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }).start();
        } else {
          // Always show navbar at top of page
          Animated.timing(headerOpacity, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }).start();
        }
        
        // Trigger stats animation when stats section is visible - restart each time
        const statsSection = document.getElementById('stats-section');
        if (statsSection) {
          const rect = statsSection.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight * 1.5 && rect.bottom > -100;
          
          if (isVisible && !statsVisible) {
            setStatsVisible(true);
            animateStats();
          } else if (!isVisible && statsVisible) {
            // Reset when section goes out of view so it can animate again
            setStatsVisible(false);
            // Reset counter values to 0
            tournamentsCount.setValue(0);
            playersCount.setValue(0);
            gamesCount.setValue(0);
            winnersCount.setValue(0);
          }
        }

        // Trigger timeline animation when timeline section is visible
        const timelineStepsSection = document.getElementById('timeline-section');
        if (timelineStepsSection) {
          const rect = timelineStepsSection.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0 && !timelineVisible) {
            setTimelineVisible(true);
            animateTimeline();
            // Animate timeline title
            Animated.parallel([
              Animated.timing(timelineTitleFade, {
                toValue: 1,
                duration: 800,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(timelineTitleSlide, {
                toValue: 0,
                duration: 800,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
              }),
            ]).start();
          }
        }
        
        // Trigger features section animation when visible
        const featuresSection = document.getElementById('features-section');
        if (featuresSection) {
          const rect = featuresSection.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0 && !featuresVisible) {
            setFeaturesVisible(true);
          }
        }

        // Trigger featured games animations
        // Featured Games section removed - no longer checking for it

        // Trigger timeline cards animations
        const timelineFeaturesSection = document.getElementById('timeline-features-section');
        if (timelineFeaturesSection) {
          const rect = timelineFeaturesSection.getBoundingClientRect();
          const cards = ['security', 'integration', 'customizable', 'analytics', 'access', 'multichannel', 'scalable', 'nocode'];
          cards.forEach((card, index) => {
            const cardElement = document.getElementById(`timeline-card-${card}`);
            if (cardElement && !timelineCardsVisible[card]) {
              const cardRect = cardElement.getBoundingClientRect();
              if (cardRect.top < window.innerHeight * 0.8 && cardRect.bottom > 0) {
                setTimelineCardsVisible(prev => ({ ...prev, [card]: true }));
              }
            }
          });
          
          // Trigger Built for Gamers cards animations
          const gameCards = ['arena-modes', 'classic-tournaments', 'arena-training', 'multi-game-support', 'team-death-match', 'ranked-competitions'];
          gameCards.forEach((cardId, index) => {
            const cardElement = document.getElementById(`game-timeline-card-${cardId}`);
            if (cardElement && !timelineFeaturesCardsVisible[cardId]) {
              const cardRect = cardElement.getBoundingClientRect();
              if (cardRect.top < window.innerHeight * 1.2 && cardRect.bottom > -100) {
                setTimeout(() => {
                  setTimelineFeaturesCardsVisible(prev => ({ ...prev, [cardId]: true }));
                }, index * 150);
              }
            }
          });
        }

        // Trigger Tournament Features cards animations
        const featuredGamesSection = document.getElementById('featured-games-section');
        if (featuredGamesSection) {
          const rect = featuredGamesSection.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight * 1.2 && rect.bottom > -100;
          
          if (isVisible && !tournamentFeaturesVisible) {
            setTournamentFeaturesVisible(true);
            // Trigger animations for each card with staggered delays
            const newVisibility = {};
            featuredGames.forEach((game, index) => {
              setTimeout(() => {
                setTournamentFeaturesCardsVisible(prev => ({
                  ...prev,
                  [game.id]: true,
                }));
              }, index * 150); // Stagger by 150ms per card
            });
          } else if (!isVisible && tournamentFeaturesVisible) {
            // Reset when section goes out of view
            setTournamentFeaturesVisible(false);
            const resetVisibility = {};
            featuredGames.forEach((game) => {
              resetVisibility[game.id] = false;
            });
            setTournamentFeaturesCardsVisible(resetVisibility);
          }
        }
      }
    };

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      // Initialize lastScrollY
      lastScrollY.current = window.scrollY;
      
      window.addEventListener('scroll', handleScroll);
      
      // Initial check for stats section visibility - trigger animation
      setTimeout(() => {
        const statsSection = document.getElementById('stats-section');
        if (statsSection) {
          const rect = statsSection.getBoundingClientRect();
          if (rect.top < window.innerHeight * 2) {
            if (!statsVisible) {
              setStatsVisible(true);
              animateStats();
            }
          } else {
            // Section exists but not visible yet - will trigger on scroll
          }
        } else {
          // Section not found yet, try again
          setTimeout(() => {
            if (!statsVisible) {
              const retrySection = document.getElementById('stats-section');
              if (retrySection) {
                setStatsVisible(true);
                animateStats();
              }
            }
          }, 1000);
        }
      }, 500);
      
      // Fallback: Always trigger stats animation after 2 seconds if not already triggered
      setTimeout(() => {
        if (!statsVisible) {
          setStatsVisible(true);
          animateStats();
        }
      }, 2000);
      
      // Initial check for timeline visibility
      setTimeout(() => {
        const timelineStepsSection = document.getElementById('timeline-section');
        if (timelineStepsSection && !timelineVisible) {
          const rect = timelineStepsSection.getBoundingClientRect();
          if (rect.top < window.innerHeight * 2) {
            setTimelineVisible(true);
            animateTimeline();
          }
        }
      }, 500);

      // Initial check for Tournament Features section visibility
      setTimeout(() => {
        const featuredGamesSection = document.getElementById('featured-games-section');
        if (featuredGamesSection && !tournamentFeaturesVisible) {
          const rect = featuredGamesSection.getBoundingClientRect();
          if (rect.top < window.innerHeight * 2) {
            setTournamentFeaturesVisible(true);
            // Trigger animations for each card with staggered delays
            featuredGames.forEach((game, index) => {
              setTimeout(() => {
                setTournamentFeaturesCardsVisible(prev => ({
                  ...prev,
                  [game.id]: true,
                }));
              }, index * 150);
            });
          }
        }
      }, 500);
      
      // Initial check for Features section visibility (now part of timeline-section)
      setTimeout(() => {
        const timelineStepsSection = document.getElementById('timeline-section');
        if (timelineStepsSection && !featuresVisible) {
          const rect = timelineStepsSection.getBoundingClientRect();
          if (rect.top < window.innerHeight * 2) {
            setFeaturesVisible(true);
          }
        }
      }, 500);

      // Initial check for Built for Gamers section visibility
      setTimeout(() => {
        const timelineFeaturesSection = document.getElementById('timeline-features-section');
        if (timelineFeaturesSection) {
          const rect = timelineFeaturesSection.getBoundingClientRect();
          // Always show cards if section exists
          const gameCards = ['arena-modes', 'classic-tournaments', 'arena-training', 'multi-game-support', 'team-death-match', 'ranked-competitions'];
          gameCards.forEach((cardId, index) => {
            setTimeout(() => {
              setTimelineFeaturesCardsVisible(prev => ({ ...prev, [cardId]: true }));
            }, index * 150);
          });
        }
      }, 500);
      
      // Also trigger on scroll
      const checkTimelineFeatures = () => {
        const timelineFeaturesSection = document.getElementById('timeline-features-section');
        if (timelineFeaturesSection) {
          const rect = timelineFeaturesSection.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight * 1.5 && rect.bottom > -100;
          if (isVisible) {
            const gameCards = ['arena-modes', 'classic-tournaments', 'arena-training', 'multi-game-support', 'team-death-match', 'ranked-competitions'];
            gameCards.forEach((cardId, index) => {
              if (!timelineFeaturesCardsVisible[cardId]) {
                setTimeout(() => {
                  setTimelineFeaturesCardsVisible(prev => ({ ...prev, [cardId]: true }));
                }, index * 150);
              }
            });
          }
        }
      };
      
      window.addEventListener('scroll', checkTimelineFeatures);
      
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      // For non-web platforms, trigger animations after delay
      setTimeout(() => {
        setStatsVisible(true);
        animateStats();
        setTimelineVisible(true);
        animateTimeline();
      }, 1500);
    }
  }, [statsVisible, timelineVisible, gamesVisible, timelineCardsVisible, featuresVisible]);

  const animateStats = () => {
    // Reset all values to 0 first
    tournamentsCount.setValue(0);
    playersCount.setValue(0);
    gamesCount.setValue(0);
    winnersCount.setValue(0);
    
    const animateValue = (animValue, toValue, duration = 2000) => {
      Animated.timing(animValue, {
        toValue,
        duration,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    };

    // Start animations with slight delays for staggered effect
    setTimeout(() => animateValue(tournamentsCount, 8), 100);
    setTimeout(() => animateValue(playersCount, 12856), 200);
    setTimeout(() => animateValue(gamesCount, 4), 300);
    setTimeout(() => animateValue(winnersCount, 58), 400);
  };

  const animateTimeline = () => {
    Animated.timing(timelineProgress, {
      toValue: 1,
      duration: 3000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const handleGetStarted = () => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const ctaSection = document.getElementById('cta-section');
      if (ctaSection) {
        ctaSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // Animated Counter Component
  const AnimatedCounter = ({ animValue, suffix = '', prefix = '' }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
      const listenerId = animValue.addListener(({ value }) => {
        setDisplayValue(Math.floor(value));
      });

      return () => {
        if (animValue.removeListener) {
          animValue.removeListener(listenerId);
        }
      };
    }, [animValue]);

    return (
      <Text style={styles.statNumber}>
        {prefix}{displayValue.toLocaleString()}{suffix}
      </Text>
    );
  };

  // Timeline Step Component
  const TimelineStep = ({ step, index, totalSteps }) => {
    const stepOpacity = useRef(new Animated.Value(0)).current;
    const stepScale = useRef(new Animated.Value(0.8)).current;
    const arrowOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      // Auto-trigger animation after a short delay if timeline is visible
      if (timelineVisible) {
        const delay = index * 400;
        
        // Animate step appearance
        Animated.parallel([
          Animated.timing(stepOpacity, {
            toValue: 1,
            duration: 600,
            delay: delay,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.spring(stepScale, {
            toValue: 1,
            tension: 50,
            friction: 7,
            delay: delay,
            useNativeDriver: true,
          }),
        ]).start();

        // Animate arrow after step appears
        if (index < totalSteps - 1) {
          Animated.timing(arrowOpacity, {
            toValue: 1,
            duration: 500,
            delay: delay + 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }).start();
        }
      } else {
        // Auto-trigger after component mounts if not triggered by scroll
        const timeout = setTimeout(() => {
          const delay = index * 400;
          Animated.parallel([
            Animated.timing(stepOpacity, {
              toValue: 1,
              duration: 600,
              delay: delay,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.spring(stepScale, {
              toValue: 1,
              tension: 50,
              friction: 7,
              delay: delay,
              useNativeDriver: true,
            }),
          ]).start();

          if (index < totalSteps - 1) {
            Animated.timing(arrowOpacity, {
              toValue: 1,
              duration: 500,
              delay: delay + 300,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }).start();
          }
        }, 1000 + index * 200);

        return () => clearTimeout(timeout);
      }
    }, [timelineVisible, index, totalSteps]);

    const progress = timelineProgress.interpolate({
      inputRange: [index / totalSteps, (index + 1) / totalSteps],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.timelineStepContainer}>
        <Animated.View
          style={[
            styles.timelineStep,
            {
              opacity: stepOpacity,
              transform: [{ scale: stepScale }],
            },
          ]}
        >
          <LinearGradient
            colors={['#FFD700', '#FFA500']}
            style={styles.timelineStepIcon}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name={step.icon} size={isDesktop ? 32 : isTablet ? 28 : 24} color="#000" />
          </LinearGradient>
          <View style={styles.timelineStepContent}>
            <Text style={styles.timelineStepTitle}>{step.title}</Text>
            <Text style={styles.timelineStepDescription}>{step.description}</Text>
          </View>
        </Animated.View>
      </View>
    );
  };

  // Animated feature cards
  const FeatureCard = ({ icon, title, description, delay = 0 }) => {
    const cardFade = useRef(new Animated.Value(0)).current;
    const cardSlide = useRef(new Animated.Value(30)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const shadowAnim = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      // Animate when features section is visible, or after a delay if not yet visible
      const animate = () => {
        Animated.parallel([
          Animated.timing(cardFade, {
            toValue: 1,
            duration: 800,
            delay: delay,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(cardSlide, {
            toValue: 0,
            duration: 800,
            delay: delay,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start();
      };

      if (featuresVisible) {
        animate();
      } else {
        // Fallback: animate after a delay if section not yet visible
        const timeout = setTimeout(() => {
          animate();
        }, 1000 + delay);
        return () => clearTimeout(timeout);
      }
    }, [featuresVisible, delay]);

    const handlePressIn = () => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0.95,
          tension: 300,
          friction: 20,
          useNativeDriver: true,
        }),
        Animated.timing(shadowAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }),
      ]).start();
    };

    const handlePressOut = () => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.05,
          tension: 300,
          friction: 20,
          useNativeDriver: true,
        }),
        Animated.timing(shadowAnim, {
          toValue: 2,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }),
      ]).start(() => {
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 200,
            friction: 15,
            useNativeDriver: true,
          }),
          Animated.timing(shadowAnim, {
            toValue: 0,
            duration: 400,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 400,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
          }),
        ]).start();
      });
    };

    const shadowOpacity = shadowAnim.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0.4, 0.6, 0.8],
    });

    const shadowRadius = shadowAnim.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [30, 40, 50],
    });

    const glowOpacity = glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.6],
    });

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{ flex: 1 }}
      >
        <Animated.View
          style={[
            styles.featureCard,
            {
              opacity: cardFade,
              transform: [
                { translateY: cardSlide },
                { scale: scaleAnim },
              ],
              ...(Platform.OS === 'web' && {
                boxShadow: shadowAnim.interpolate({
                  inputRange: [0, 1, 2],
                  outputRange: [
                    '0 8px 30px rgba(255, 0, 255, 0.3), 0 0 40px rgba(0, 255, 255, 0.2)',
                    '0 12px 40px rgba(255, 0, 255, 0.5), 0 0 60px rgba(0, 255, 255, 0.4)',
                    '0 16px 50px rgba(255, 0, 255, 0.7), 0 0 80px rgba(0, 255, 255, 0.6)',
                  ],
                }),
              }),
            },
          ]}
        >
          <Animated.View
            style={[
              styles.featureCardGlow,
              {
                opacity: glowOpacity,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.featureIconContainer,
              {
                transform: [
                  {
                    scale: cardFade.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={['#FF00FF', '#00FFFF']}
              style={styles.iconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name={icon} size={isDesktop ? 40 : isTablet ? 35 : 30} color="#000" />
            </LinearGradient>
          </Animated.View>
          <Text style={styles.featureTitle}>{title}</Text>
          <Text style={styles.featureDescription}>{description}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  // Featured Game Card Component - No Transitions
  const FeaturedGameCard = ({ game, index }) => {
    const gameId = game.id;

    return (
      <View
        style={styles.featuredGameCard}
        nativeID={`game-${gameId}`}
      >
        {/* Classic Card Header */}
        <View style={styles.featuredGameCardHeader}>
          <LinearGradient
            colors={['rgba(255, 215, 0, 0.15)', 'rgba(255, 165, 0, 0.1)']}
            style={styles.featuredGameIconContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="trophy" size={isDesktop ? 32 : isTablet ? 28 : 24} color="#FFD700" />
          </LinearGradient>
          <View style={styles.featuredGameHeaderContent}>
            <Text style={styles.featuredGameCardTitle}>{game.appFeatures.title}</Text>
          </View>
        </View>

        {/* Card Divider */}
        <View style={styles.featuredGameDivider} />

        {/* Card Content */}
        <View style={styles.featuredGameAppSection}>
          <Text style={styles.featuredGameAppDescription}>{game.appFeatures.description}</Text>
          
          {/* Features List */}
          <View style={styles.featuredGameFeatures}>
            {game.appFeatures.features.map((feature, idx) => (
              <View
                key={idx}
                style={styles.featuredGameFeature}
              >
                <LinearGradient
                  colors={['#FFD700', '#FFA500']}
                  style={styles.featuredGameFeatureIcon}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="checkmark" size={14} color="#000" />
                </LinearGradient>
                <Text style={styles.featuredGameFeatureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  // Animated game card (for games grid section)
  const GameCard = ({ image, name, description, delay = 0 }) => {
    const gameFade = useRef(new Animated.Value(0)).current;
    const gameScale = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(gameFade, {
          toValue: 1,
          duration: 600,
          delay: delay,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(gameScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          delay: delay,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.gameCard,
          {
            opacity: gameFade,
            transform: [{ scale: gameScale }],
          },
        ]}
      >
        <Image source={image} style={styles.gameImage} resizeMode="contain" />
        <Text style={styles.gameName}>{name}</Text>
        <Text style={styles.gameDescription}>{description}</Text>
      </Animated.View>
    );
  };

  // Timeline Feature Card Component
  const TimelineFeatureCard = ({ feature, index }) => {
    const isLeft = index % 2 === 0;
    const cardId = `timeline-card-${feature.id}`;
    const slideAnim = useRef(new Animated.Value(isLeft ? -50 : 50)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
      if (timelineCardsVisible[feature.id]) {
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 600,
            delay: index * 150,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            delay: index * 150,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            delay: index * 150,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }, [timelineCardsVisible[feature.id], index, isLeft]);

    return (
      <View style={styles.timelineCardWrapper}>
        <Animated.View
          style={[
            styles.timelineFeatureCard,
            isLeft ? styles.timelineCardLeft : styles.timelineCardRight,
            {
              opacity: fadeAnim,
              transform: [
                { translateX: slideAnim },
                { scale: scaleAnim },
              ],
            },
          ]}
          nativeID={cardId}
        >
          <View style={styles.timelineCardHeader}>
            <LinearGradient
              colors={['rgba(255, 215, 0, 0.15)', 'rgba(255, 165, 0, 0.15)']}
              style={styles.timelineCardIconContainer}
            >
              <Ionicons name={feature.icon} size={isDesktop ? 24 : isTablet ? 22 : 20} color="#FFD700" />
            </LinearGradient>
            <Text style={styles.timelineCardTitle}>{feature.title}</Text>
          </View>
          <Text style={styles.timelineCardDescription}>{feature.description}</Text>
          
          {/* Connecting line to timeline */}
          <View
            style={[
              styles.timelineCardConnector,
              isLeft ? styles.timelineConnectorLeft : styles.timelineConnectorRight,
            ]}
          />
          {/* Dot on timeline */}
          <View
            style={[
              styles.timelineCardDot,
              isLeft ? styles.timelineDotLeft : styles.timelineDotRight,
            ]}
          />
        </Animated.View>
        {!isLeft && <View style={styles.timelineCardSpacer} />}
      </View>
    );
  };

  // FAQ Item Component
  const FAQItem = ({ faq, index }) => {
    const isOpen = openFAQ === index;
    const rotateAnim = useRef(new Animated.Value(isOpen ? 1 : 0)).current;
    const heightAnim = useRef(new Animated.Value(isOpen ? 1 : 0)).current;
    const opacityAnim = useRef(new Animated.Value(isOpen ? 1 : 0)).current;
    const translateYAnim = useRef(new Animated.Value(isOpen ? 0 : -10)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.spring(rotateAnim, {
          toValue: isOpen ? 1 : 0,
          tension: 200,
          friction: 20,
          useNativeDriver: true,
        }),
        Animated.timing(heightAnim, {
          toValue: isOpen ? 1 : 0,
          duration: 450,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnim, {
          toValue: isOpen ? 1 : 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: isOpen ? 0 : -10,
          duration: 400,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          useNativeDriver: true,
        }),
      ]).start();
    }, [isOpen]);

    const rotate = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '45deg'],
    });

    const maxHeight = heightAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 500],
    });

    return (
      <Animated.View
        style={[
          styles.faqItem,
          isOpen && styles.faqItemOpen,
          !isOpen && styles.faqItemClosed,
        ]}
      >
        <TouchableOpacity
          style={styles.faqButton}
          onPress={() => setOpenFAQ(isOpen ? -1 : index)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.faqQuestion,
              isOpen && styles.faqQuestionOpen,
              !isOpen && styles.faqQuestionClosed,
            ]}
          >
            {faq.question}
          </Text>
          <Animated.View
            style={[
              styles.faqIconContainer,
              isOpen && styles.faqIconContainerOpen,
              !isOpen && styles.faqIconContainerClosed,
            ]}
          >
            <Animated.View
              style={{
                transform: [{ rotate }],
              }}
            >
              <Ionicons
                name="add"
                size={isDesktop ? 20 : isTablet ? 18 : 16}
                color={isOpen ? '#000' : '#FFD700'}
              />
            </Animated.View>
          </Animated.View>
        </TouchableOpacity>
        <Animated.View
          style={[
            styles.faqAnswerContainer,
            {
              maxHeight,
              opacity: opacityAnim,
              transform: [
                { translateY: translateYAnim },
              ],
            },
          ]}
        >
          <View style={styles.faqAnswer}>
            <Text style={styles.faqAnswerText}>{faq.answer}</Text>
          </View>
        </Animated.View>
      </Animated.View>
    );
  };

  // Animated Timeline Card Component for Built for Gamers section
  const AnimatedTimelineCard = ({ item, index, isVisible, side }) => {
    const fadeAnim = useRef(new Animated.Value(0.3)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const translateYAnim = useRef(new Animated.Value(30)).current;
    const translateXAnim = useRef(new Animated.Value(side === 'left' ? -40 : 40)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      // Always animate on mount, then enhance when visible
      Animated.sequence([
        Animated.delay(index * 100),
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 80,
            friction: 9,
            useNativeDriver: true,
          }),
          Animated.timing(translateYAnim, {
            toValue: 0,
            duration: 600,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            useNativeDriver: true,
          }),
          Animated.timing(translateXAnim, {
            toValue: 0,
            duration: 600,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }, [index, side]);

    const rotate = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['-5deg', '0deg'],
    });

    return (
      <Animated.View
        style={[
          styles.gameTimelineCard,
          side === 'left' ? styles.gameTimelineLeft : styles.gameTimelineRight,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: translateYAnim },
              { translateX: translateXAnim },
              { rotate },
            ],
          },
        ]}
        nativeID={`game-timeline-card-${item.id}`}
      >
        <View style={styles.gameTimelineCardHeader}>
              <LinearGradient
                colors={['#FF00FF', '#00FFFF']}
                style={styles.gameTimelineIconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
            <Ionicons
              name={item.icon}
              size={isDesktop ? 22 : isTablet ? 20 : 18}
              color="#000"
            />
          </LinearGradient>
          <View style={styles.gameTimelineCardContent}>
            <Text style={styles.gameTimelineTitle}>{item.title}</Text>
            <Text style={styles.gameTimelineSubtitle}>{item.subtitle}</Text>
            <Text style={styles.gameTimelineDescription}>{item.description}</Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  // Tournament Card
  const TournamentCard = ({ title, game, mode, prize, date, delay = 0 }) => {
    const cardFade = useRef(new Animated.Value(0)).current;
    const cardSlide = useRef(new Animated.Value(40)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(cardFade, {
          toValue: 1,
          duration: 700,
          delay: delay,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(cardSlide, {
          toValue: 0,
          duration: 700,
          delay: delay,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.tournamentCard,
          {
            opacity: cardFade,
            transform: [{ translateY: cardSlide }],
          },
        ]}
      >
        <LinearGradient
          colors={['#1A1F2E', '#141E30']}
          style={styles.tournamentGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.tournamentHeader}>
            <View style={styles.tournamentBadge}>
              <Ionicons name="trophy" size={20} color="#FFD700" />
              <Text style={styles.tournamentBadgeText}>Live</Text>
            </View>
            <Text style={styles.tournamentDate}>{date}</Text>
          </View>
          <Text style={styles.tournamentTitle}>{title}</Text>
          <View style={styles.tournamentInfo}>
            <View style={styles.tournamentInfoItem}>
              <Ionicons name="game-controller" size={18} color="#FFD700" />
              <Text style={styles.tournamentInfoText}>{game}</Text>
            </View>
            <View style={styles.tournamentInfoItem}>
              <Ionicons name="people" size={18} color="#FFD700" />
              <Text style={styles.tournamentInfoText}>{mode}</Text>
            </View>
          </View>
          <View style={styles.tournamentPrize}>
            <Ionicons name="cash" size={24} color="#FFD700" />
            <Text style={styles.tournamentPrizeText}>₹{prize}</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  const timelineSteps = [
    {
      icon: 'person-add',
      title: 'Sign Up',
      description: 'Create your account and join the esports community',
    },
    {
      icon: 'game-controller',
      title: 'Choose Game',
      description: 'Select from our wide range of supported games',
    },
    {
      icon: 'trophy',
      title: 'Join Tournament',
      description: 'Register for tournaments and compete with top players',
    },
    {
      icon: 'medal',
      title: 'Win & Earn',
      description: 'Climb the leaderboard and win amazing prizes',
    },
  ];

  const faqData = [
    {
      question: 'How quickly can I start participating in tournaments?',
      answer: 'You can start immediately! Simply sign up, verify your email, and browse available tournaments. Most players register for their first tournament within minutes.',
    },
    {
      question: 'Do I need to pay to participate in tournaments?',
      answer: 'Some tournaments are free to enter, while others may have entry fees. All prize pools and entry fees are clearly displayed before registration. We also offer free practice tournaments regularly.',
    },
    {
      question: 'What games are supported on EsportsIndia?',
      answer: 'We support a wide variety of esports games and are constantly adding new titles based on community demand.',
    },
    {
      question: 'How do I receive my tournament winnings?',
      answer: 'Winnings are processed securely through our payment system. You\'ll receive your prize money directly to your registered account within 7-14 business days after tournament completion.',
    },
    {
      question: 'Can I create my own tournaments?',
      answer: 'Yes! Registered users can create custom tournaments with their own rules, entry fees, and prize pools. Contact our support team to learn more about hosting tournaments.',
    },
    {
      question: 'Is EsportsIndia available on mobile devices?',
      answer: 'Absolutely! EsportsIndia is available on both iOS and Android devices. You can download the app from the App Store or Google Play Store, or access it via web browser.',
    },
    {
      question: 'How are tournament winners determined?',
      answer: 'Winners are determined based on the tournament rules and scoring system for each game. Results are verified by our automated system and reviewed by our team to ensure fairness.',
    },
    {
      question: 'What if I have technical issues during a tournament?',
      answer: 'Our support team is available 24/7 to assist with any technical issues. Contact us immediately through the app or website, and we\'ll help resolve the issue as quickly as possible.',
    },
  ];

  const timelineFeatures = [
    {
      id: 'security',
      icon: 'shield-checkmark',
      title: 'Secure Platform',
      description: 'Enterprise-grade security with data privacy and player protection built-in.',
    },
    {
      id: 'integration',
      icon: 'flash',
      title: 'Easy Registration',
      description: 'Quick tournament registration with seamless payment integration.',
    },
    {
      id: 'customizable',
      icon: 'settings',
      title: 'Custom Tournaments',
      description: 'Create and customize tournaments with flexible rules and formats.',
    },
    {
      id: 'analytics',
      icon: 'stats-chart',
      title: 'Performance Tracking',
      description: 'Track player stats, tournament results, and leaderboard rankings.',
    },
    {
      id: 'access',
      icon: 'people',
      title: 'Community Access',
      description: 'Connect with gamers, join teams, and build your esports network.',
    },
    {
      id: 'multichannel',
      icon: 'globe',
      title: 'Multi-Platform',
      description: 'Support for iOS, Android, and Web platforms for seamless access.',
    },
    {
      id: 'scalable',
      icon: 'server',
      title: 'Scalable Infrastructure',
      description: 'Cloud-native architecture that handles thousands of concurrent players.',
    },
    {
      id: 'nocode',
      icon: 'code-slash',
      title: 'User-Friendly',
      description: 'Intuitive interface that makes tournament management effortless.',
    },
  ];

  const featuredGames = [
    {
      id: 'tournament-excellence',
      appFeatures: {
        title: 'Tournament Excellence',
        description: 'On EsportsIndia, we host premium tournaments across multiple maps and game modes. Compete in Solo, Duo, and Squad formats on various maps.',
        features: [
          'Map-specific tournaments',
          'Multiple game modes: Solo, Duo, Squad competitions',
          'Real-time leaderboards and winner tracking',
          'Regular tournaments with exciting prize pools',
        ],
      },
    },
    {
      id: 'quick-match-tournaments',
      appFeatures: {
        title: 'Quick Match Tournaments',
        description: 'EsportsIndia brings you exciting tournaments designed for fast-paced gameplay. Join quick matches, compete with top players, and climb the rankings.',
        features: [
          'Quick 10-minute tournament matches',
          'Character-based competitive events',
          'Multiple map tournaments',
          'Regular events and seasonal competitions',
        ],
      },
    },
    {
      id: 'multi-mode-competitions',
      appFeatures: {
        title: 'Multi-Mode Competitions',
        description: 'EsportsIndia offers comprehensive tournaments across Battle Royale, Multiplayer, and Ranked modes. Showcase your skills in various competitive formats.',
        features: [
          'Battle Royale and Multiplayer tournaments',
          'Ranked match competitions',
          'Weapon and loadout-based events',
          'Team-based competitive leagues',
        ],
      },
    },
    {
      id: 'strategic-team-play',
      appFeatures: {
        title: 'Strategic Team Play',
        description: 'EsportsIndia hosts tactical tournaments where strategy meets skill. Compete in 5v5 matches, master abilities, and prove your tactical prowess.',
        features: [
          '5v5 tactical tournament matches',
          'Agent-based competitive events',
          'Strategic gameplay competitions',
          'Team coordination tournaments',
        ],
      },
    },
    {
      id: 'ranked-leagues',
      appFeatures: {
        title: 'Ranked Leagues',
        description: 'Climb the competitive ladder in our ranked league system. Earn points, unlock rewards, and compete for top positions in seasonal rankings.',
        features: [
          'Seasonal ranked leagues',
          'Progressive ranking system',
          'Exclusive rewards and badges',
          'Monthly leaderboard resets',
        ],
      },
    },
    {
      id: 'championship-series',
      appFeatures: {
        title: 'Championship Series',
        description: 'Join our premier championship tournaments with massive prize pools. Compete against the best players and claim your spot in esports history.',
        features: [
          'Major championship events',
          'Large prize pools',
          'Professional tournament format',
          'Live streaming and coverage',
        ],
      },
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Section with Navbar */}
        <View style={styles.heroSection}>
          {/* Gaming Arena Background Image */}
          <View style={styles.heroImageContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80' }}
              style={styles.heroBackgroundImage}
              resizeMode="cover"
              defaultSource={require('../../assets/images/applogo.png')}
            />
            <View style={styles.heroImageOverlay} />
          </View>

          {/* Navbar Overlay */}
          <Animated.View
            style={[
              styles.headerContainer,
              {
                opacity: headerOpacity,
              },
            ]}
          >
            <View style={[styles.header, isScrolled && styles.headerScrolled]}>
              <View style={styles.logoContainer}>
                <View style={styles.logoCircle}>
                  <Image
                    source={require('../../assets/images/applogo.png')}
                    style={styles.logo}
                    resizeMode="cover"
                  />
                </View>
                <Text style={styles.logoText}>EsportsIndia</Text>
              </View>
              
              {/* Navigation Bar */}
              <View style={styles.navContainer}>
                <NavItem id="home" label="Home" sectionId="" />
                <NavItem id="features" label="Features" sectionId="stats-section" />
                <NavItem id="how-it-works" label="How It Works" sectionId="timeline-section" />
                <NavItem id="tournaments" label="Tournaments" sectionId="featured-games-section" />
                <NavItem id="get-started" label="Get Started" sectionId="cta-section" />
              </View>
              
              {/* Mobile Menu Toggle */}
              {isMobile && (
                <TouchableOpacity
                  style={styles.mobileMenuButton}
                  onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <Ionicons 
                    name={mobileMenuOpen ? 'close' : 'menu'} 
                    size={28} 
                    color="#FFFFFF" 
                  />
                </TouchableOpacity>
              )}
            </View>
            
            {/* Mobile Menu */}
            {isMobile && mobileMenuOpen && (
              <View style={styles.mobileMenu}>
                <TouchableOpacity
                  style={[styles.mobileNavItem, activeNav === 'home' && styles.mobileNavItemActive]}
                  onPress={() => handleNavClick('home', '')}
                >
                  <Text style={[styles.mobileNavText, activeNav === 'home' && styles.mobileNavTextActive]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.mobileNavItem, activeNav === 'features' && styles.mobileNavItemActive]}
                  onPress={() => handleNavClick('features', 'stats-section')}
                >
                  <Text style={[styles.mobileNavText, activeNav === 'features' && styles.mobileNavTextActive]}>Features</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.mobileNavItem, activeNav === 'how-it-works' && styles.mobileNavItemActive]}
                  onPress={() => handleNavClick('how-it-works', 'timeline-section')}
                >
                  <Text style={[styles.mobileNavText, activeNav === 'how-it-works' && styles.mobileNavTextActive]}>How It Works</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.mobileNavItem, activeNav === 'tournaments' && styles.mobileNavItemActive]}
                  onPress={() => handleNavClick('tournaments', 'featured-games-section')}
                >
                  <Text style={[styles.mobileNavText, activeNav === 'tournaments' && styles.mobileNavTextActive]}>Tournaments</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.mobileNavItem, activeNav === 'get-started' && styles.mobileNavItemActive]}
                  onPress={() => handleNavClick('get-started', 'cta-section')}
                >
                  <Text style={[styles.mobileNavText, activeNav === 'get-started' && styles.mobileNavTextActive]}>Get Started</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>

          <LinearGradient
            colors={['rgba(10, 10, 26, 0.3)', 'rgba(26, 10, 42, 0.5)', 'rgba(42, 10, 58, 0.7)']}
            style={styles.heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            

            {/* Hero Content */}
            <Animated.View
              style={[
                styles.heroContent,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Animated.Text
                style={[
                  styles.heroTitle,
                  {
                    transform: [
                      {
                        scale: scaleAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.95, 1],
                        }),
                      },
                    ],
                  },
                ]}
              >
                RISE UP & <Text style={styles.heroTitleHighlight}>PLAY!</Text>
              </Animated.Text>
              <Animated.Text
                style={[
                  styles.heroSubtitle,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                India's Ultimate Gaming Arcade
              </Animated.Text>
              <Animated.Text
                style={[
                  styles.heroDescription,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                Join epic tournaments, compete with champions, and dominate the leaderboards.
                Your next victory starts here!
              </Animated.Text>
              <Animated.View
                style={{
                  transform: [{ scale: scaleAnim }],
                }}
              >
                <TouchableOpacity
                  style={styles.ctaButton}
                  onPress={handleGetStarted}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#FF00FF', '#00FFFF', '#FF00FF']}
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.ctaButtonText}>START PLAYING</Text>
                    <Ionicons name="game-controller" size={24} color="#000" style={{ marginLeft: 10 }} />
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          </LinearGradient>
        </View>

        {/* Featured Games Section - Tournament Features */}
        <View style={styles.featuredGamesSection} nativeID="featured-games-section">
          <LinearGradient
            colors={['#0A0A1A', '#1A0A2A', '#2A0A3A']}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          
          {/* Notice Board */}
          <View style={styles.noticeBoard}>
            <LinearGradient
              colors={['rgba(255, 0, 255, 0.2)', 'rgba(0, 255, 255, 0.15)']}
              style={styles.noticeBoardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.noticeBoardHeader}>
                <Ionicons name="megaphone" size={isDesktop ? 28 : isTablet ? 24 : 20} color="#00FFFF" />
                <Text style={styles.noticeBoardTitle}>TOURNAMENT NOTICES</Text>
              </View>
              <View style={styles.noticeBoardContent}>
                <View style={styles.noticeItem}>
                  <Ionicons name="calendar" size={isDesktop ? 20 : isTablet ? 18 : 16} color="#FF00FF" />
                  <Text style={styles.noticeText}>
                    <Text style={styles.noticeBold}>Tournament Schedule:</Text> All tournaments start every Friday and end on Sunday
                  </Text>
                </View>
                <View style={styles.noticeItem}>
                  <Ionicons name="time" size={isDesktop ? 20 : isTablet ? 18 : 16} color="#FF00FF" />
                  <Text style={styles.noticeText}>
                    <Text style={styles.noticeBold}>Registration:</Text> Open until Thursday 11:59 PM before tournament starts
                  </Text>
                </View>
                <View style={styles.noticeItem}>
                  <Ionicons name="trophy" size={isDesktop ? 20 : isTablet ? 18 : 16} color="#FF00FF" />
                  <Text style={styles.noticeText}>
                    <Text style={styles.noticeBold}>Prize Distribution:</Text> Winners receive prizes within 7-14 business days
                  </Text>
                </View>
                <View style={styles.noticeItem}>
                  <Ionicons name="people" size={isDesktop ? 20 : isTablet ? 18 : 16} color="#FF00FF" />
                  <Text style={styles.noticeText}>
                    <Text style={styles.noticeBold}>Team Requirements:</Text> Only Squad format available for all tournaments
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          <Animated.Text
            style={[
              styles.sectionTitle,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            FEATURED GAMES
          </Animated.Text>
          <View style={styles.featuredGamesContainer}>
            {featuredGames.map((game, index) => {
              // Group games in threes (3 per row)
              if (index % 3 === 0) {
                const game1 = featuredGames[index];
                const game2 = featuredGames[index + 1];
                const game3 = featuredGames[index + 2];
                return (
                  <View key={`row-${index}`} style={styles.featuredGamesRow}>
                    <FeaturedGameCard game={game1} index={index} />
                    {game2 && <FeaturedGameCard game={game2} index={index + 1} />}
                    {game3 && <FeaturedGameCard game={game3} index={index + 2} />}
                  </View>
                );
              }
              return null;
            })}
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection} nativeID="stats-section">
          <LinearGradient
            colors={['#0A0A1A', '#1A0A2A', '#2A0A3A', '#3A0A4A']}
            style={styles.statsGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Animated.Text
              style={[
                styles.statsTitle,
                {
                  opacity: fadeAnim,
                },
              ]}
            >
              Esports Revolution
            </Animated.Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={['#FFD700', '#FFA500']}
                  style={styles.statIconContainer}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="trophy" size={isDesktop ? 40 : 35} color="#000" />
                </LinearGradient>
                <AnimatedCounter animValue={tournamentsCount} />
                <Text style={styles.statLabel}>Active Tournaments</Text>
              </View>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={['#FF00FF', '#00FFFF']}
                  style={styles.statIconContainer}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="people" size={isDesktop ? 40 : 35} color="#000" />
                </LinearGradient>
                <AnimatedCounter animValue={playersCount} />
                <Text style={styles.statLabel}>Active Players</Text>
              </View>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={['#FF00FF', '#00FFFF']}
                  style={styles.statIconContainer}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="game-controller" size={isDesktop ? 40 : 35} color="#000" />
                </LinearGradient>
                <AnimatedCounter animValue={gamesCount} />
                <Text style={styles.statLabel}>Featured Games</Text>
              </View>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={['#FF00FF', '#00FFFF']}
                  style={styles.statIconContainer}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="medal" size={isDesktop ? 40 : 35} color="#000" />
                </LinearGradient>
                <AnimatedCounter animValue={winnersCount} />
                <Text style={styles.statLabel}>Champions</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Timeline Features Section - Games Timeline */}
        <View style={styles.timelineFeaturesSection} nativeID="timeline-features-section">
          <View style={styles.timelineFeaturesHeader}>
            <Text
              style={styles.timelineFeaturesTitle}
            >
              GAME MODES & TOURNAMENTS
            </Text>
            <Text
              style={styles.timelineFeaturesSubtitle}
            >
              Your Complete Esports Tournament Platform
            </Text>
          </View>

          <View style={styles.timelineContainerWrapper}>
            <LinearGradient
              colors={['rgba(20, 30, 48, 0.3)', 'rgba(26, 43, 61, 0.4)', 'rgba(36, 59, 85, 0.3)']}
              style={StyleSheet.absoluteFillObject}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            {/* Vertical Timeline Line */}
            <View style={styles.timelineVerticalLine} />
            
            {/* Timeline Arrow at top */}
            <View style={styles.timelineTopArrow}>
              <LinearGradient
                colors={['#FF00FF', '#00FFFF']}
                style={styles.timelineArrowCircle}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="arrow-down" size={isDesktop ? 20 : isTablet ? 18 : 16} color="#000" />
              </LinearGradient>
            </View>

            {/* Games Timeline */}
            <View style={styles.gamesTimelineContainer}>
              {[
                {
                  id: 'arena-modes',
                  title: 'Arena Modes',
                  subtitle: 'Livik Arena, Erangel Arena, Hanger TDM, Hanger TGM',
                  description: 'Multiple arena training modes for skill development and practice',
                  icon: 'trophy',
                  side: 'left',
                },
                {
                  id: 'classic-tournaments',
                  title: 'Classic Tournaments',
                  subtitle: 'Erangel, Nusa, Livik Maps',
                  description: 'Battle Royale tournaments across classic and mini-classic maps',
                  icon: 'map',
                  side: 'right',
                },
                {
                  id: 'arena-training',
                  title: 'Arena Training',
                  subtitle: 'Inventory, Ruins, Town, Library',
                  description: 'Specialized training arenas for different combat scenarios',
                  icon: 'fitness',
                  side: 'left',
                },
                {
                  id: 'multi-game-support',
                  title: 'Multi-Game Support',
                  subtitle: 'BGMI, Free Fire, COD, Valorant',
                  description: 'Tournaments across multiple esports titles and game modes',
                  icon: 'game-controller',
                  side: 'right',
                },
                {
                  id: 'team-death-match',
                  title: 'Team Death Match',
                  subtitle: 'Hanger TDM Competitions',
                  description: 'Fast-paced TDM tournaments for competitive team play',
                  icon: 'people',
                  side: 'left',
                },
                {
                  id: 'ranked-competitions',
                  title: 'Ranked Competitions',
                  subtitle: 'Solo, Duo, Squad Formats',
                  description: 'Ranked tournaments with leaderboards and prize pools',
                  icon: 'stats-chart',
                  side: 'right',
                },
              ].map((item, index) => {
                const cardId = item.id;
                const isVisible = timelineFeaturesCardsVisible[cardId];
                
                return (
                  <View key={index} style={styles.gameTimelineItem}>
                    {item.side === 'left' ? (
                      <>
                        <AnimatedTimelineCard
                          item={item}
                          index={index}
                          isVisible={isVisible}
                          side="left"
                        />
                        <View style={styles.gameTimelineConnector} />
                        <View style={styles.gameTimelineDot} />
                        <View style={styles.gameTimelineSpacer} />
                      </>
                    ) : (
                      <>
                        <View style={styles.gameTimelineSpacer} />
                        <View style={styles.gameTimelineDot} />
                        <View style={styles.gameTimelineConnector} />
                        <AnimatedTimelineCard
                          item={item}
                          index={index}
                          isVisible={isVisible}
                          side="right"
                        />
                      </>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Combined Section: HOW IT WORKS & WHY CHOOSE US */}
        <View style={styles.combinedSection} nativeID="timeline-section">
          <LinearGradient
            colors={['#0A0A1A', '#1A0A2A', '#2A0A3A']}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          
          {/* HOW IT WORKS Section */}
          <View style={styles.combinedSectionPart}>
            <Animated.Text
              style={[
                styles.sectionTitle,
                {
                  opacity: timelineTitleFade,
                  transform: [{ translateY: timelineTitleSlide }],
                },
              ]}
            >
              HOW IT WORKS
            </Animated.Text>
            <View style={styles.timelineContainer}>
              {/* Connecting Line */}
              <View style={styles.timelineConnectingLine} />
              {timelineSteps.map((step, index) => (
                <TimelineStep
                  key={index}
                  step={step}
                  index={index}
                  totalSteps={timelineSteps.length}
                />
              ))}
            </View>
          </View>

          {/* WHY CHOOSE US Section */}
          <View style={styles.combinedSectionPart}>
            <Text style={styles.sectionTitle}>
              WHY CHOOSE US?
            </Text>
            <View style={styles.featuresGrid}>
              <FeatureCard
                icon="trophy"
                title="Tournaments"
                description="Participate in exciting tournaments and compete with top players"
                delay={100}
              />
              <FeatureCard
                icon="people"
                title="Community"
                description="Connect with fellow gamers and build your esports network"
                delay={200}
              />
              <FeatureCard
                icon="stats-chart"
                title="Track Progress"
                description="Monitor your performance and see tournament winners"
                delay={300}
              />
              <FeatureCard
                icon="game-controller"
                title="Multiple Games"
                description="Support for a wide variety of esports games and tournaments"
                delay={400}
              />
            </View>
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection} nativeID="cta-section">
          <LinearGradient
            colors={['#0A0A1A', '#1A0A2A', '#2A0A3A', '#3A0A4A']}
            style={styles.ctaGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Animated.Text
              style={[
                styles.ctaTitle,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              Ready to Start Your Esports Journey?
            </Animated.Text>
            <Animated.Text
              style={[
                styles.ctaSubtitle,
                {
                  opacity: fadeAnim,
                },
              ]}
            >
              Join thousands of gamers competing in tournaments across India
            </Animated.Text>
            <Animated.View
              style={{
                transform: [{ scale: scaleAnim }],
              }}
            >
              <TouchableOpacity
                style={styles.ctaButtonLarge}
                onPress={handleGetStarted}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#FFD700', '#FFA500']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.ctaButtonText}>JOIN NOW</Text>
                  <Ionicons name="game-controller" size={24} color="#000" style={{ marginLeft: 10 }} />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </LinearGradient>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <LinearGradient
            colors={['#0A0A1A', '#1A0A2A', '#2A0A3A']}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.footerContent}>
            <View style={styles.footerSection}>
              <View style={styles.footerLogoContainer}>
                <View style={styles.footerLogoCircle}>
                  <Image
                    source={require('../../assets/images/applogo.png')}
                    style={styles.footerLogo}
                    resizeMode="cover"
                  />
                </View>
                <Text style={styles.footerLogoText}>EsportsIndia</Text>
              </View>
              <Text style={styles.footerDescription}>
                India's premier esports platform connecting gamers and hosting world-class tournaments.
              </Text>
            </View>
            <View style={styles.footerSection}>
              <Text style={styles.footerSectionTitle}>Quick Links</Text>
              <TouchableOpacity style={styles.footerLink}>
                <Text style={styles.footerLinkText}>Tournaments</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerLink}>
                <Text style={styles.footerLinkText}>Games</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerLink}>
                <Text style={styles.footerLinkText}>Winners</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerLink}>
                <Text style={styles.footerLinkText}>Live Streams</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.footerSection}>
              <Text style={styles.footerSectionTitle}>Connect</Text>
              <View style={styles.socialLinks}>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-youtube" size={24} color="#FFD700" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-instagram" size={24} color="#FFD700" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-twitter" size={24} color="#FFD700" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-facebook" size={24} color="#FFD700" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.footerBottom}>
            <Text style={styles.footerText}>© 2025 EsportsIndia. All Rights Reserved.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0E1A',
  },
  container: {
    flex: 1,
    backgroundColor: '#0A0E1A',
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    width: '100%',
    ...(Platform.OS === 'web' && {
      backdropFilter: 'blur(10px)',
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: isDesktop ? width * 0.08 : isTablet ? 40 : isMobile ? 15 : 20,
    paddingTop: isDesktop ? 30 : isTablet ? 25 : 20,
    paddingBottom: isDesktop ? 25 : isTablet ? 20 : 15,
    backgroundColor: 'rgba(10, 10, 26, 0.4)',
    ...(Platform.OS === 'web' && {
      backdropFilter: 'blur(10px)',
    }),
  },
  headerScrolled: {
    ...(Platform.OS === 'web' && {
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
    }),
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: isDesktop ? 60 : isTablet ? 55 : 50,
    height: isDesktop ? 60 : isTablet ? 55 : 50,
    borderRadius: isDesktop ? 30 : isTablet ? 27.5 : 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#00FFFF',
    overflow: 'hidden',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)',
    }),
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  logoText: {
    fontSize: isDesktop ? 30 : isTablet ? 26 : isMobile ? 18 : 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    ...(isMobile && {
      fontSize: 16,
    }),
  },
  navContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isDesktop ? 30 : isTablet ? 20 : 15,
    display: isMobile ? 'none' : 'flex',
  },
  navItem: {
    paddingVertical: isDesktop ? 8 : isTablet ? 6 : 5,
    paddingHorizontal: isDesktop ? 12 : isTablet ? 10 : 8,
    borderRadius: 8,
    overflow: 'visible',
  },
  navItemInner: {
    paddingVertical: isDesktop ? 8 : isTablet ? 6 : 5,
    paddingHorizontal: isDesktop ? 12 : isTablet ? 10 : 8,
    borderRadius: 8,
    ...(Platform.OS === 'web' && {
      transition: 'background-color 0.3s ease, transform 0.3s ease',
    }),
  },
  navItemActive: {
    backgroundColor: 'rgba(0, 255, 255, 0.2)',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
    }),
  },
  navText: {
    fontSize: isDesktop ? 16 : isTablet ? 15 : 14,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    ...(Platform.OS === 'web' && {
      transition: 'color 0.3s ease',
    }),
  },
  navTextActive: {
    color: '#00FFFF',
    fontWeight: '700',
    ...(Platform.OS === 'web' && {
      textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
    }),
  },
  mobileMenuButton: {
    padding: 8,
    display: isMobile ? 'flex' : 'none',
  },
  mobileMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(10, 14, 26, 0.98)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
    paddingVertical: 20,
    paddingHorizontal: 20,
    zIndex: 999,
    ...(Platform.OS === 'web' && {
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
    }),
    ...(isMobile && {
      marginTop: 0,
    }),
  },
  mobileNavItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 255, 255, 0.2)',
    ...(Platform.OS === 'web' && {
      transition: 'background-color 0.3s ease',
    }),
  },
  mobileNavItemActive: {
    backgroundColor: 'rgba(0, 255, 255, 0.15)',
    borderBottomColor: 'rgba(0, 255, 255, 0.5)',
  },
  mobileNavText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    ...(Platform.OS === 'web' && {
      transition: 'color 0.3s ease',
    }),
  },
  mobileNavTextActive: {
    color: '#00FFFF',
    fontWeight: '700',
    ...(Platform.OS === 'web' && {
      textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
    }),
  },
  heroSection: {
    minHeight: isDesktop ? height : isTablet ? height * 0.95 : height * 0.9,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  heroGradient: {
    flex: 1,
    paddingTop: isDesktop ? 140 : isTablet ? 120 : 100,
    paddingBottom: isDesktop ? 80 : isTablet ? 70 : 60,
    paddingHorizontal: isDesktop ? width * 0.1 : isTablet ? 40 : 20,
    position: 'relative',
    minHeight: isDesktop ? height * 0.85 : isTablet ? height * 0.8 : height * 0.75,
    justifyContent: 'center',
    zIndex: 1,
  },
  heroImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  heroBackgroundImage: {
    width: '100%',
    height: '100%',
    opacity: 1,
  },
  heroImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 10, 26, 0.4)',
  },
  heroBgElement1: {
    position: 'absolute',
    width: isDesktop ? 600 : isTablet ? 400 : 300,
    height: isDesktop ? 600 : isTablet ? 400 : 300,
    borderRadius: isDesktop ? 300 : isTablet ? 200 : 150,
    backgroundColor: '#FFD700',
    top: -200,
    right: -200,
    opacity: 0.1,
  },
  heroBgElement2: {
    position: 'absolute',
    width: isDesktop ? 500 : isTablet ? 350 : 250,
    height: isDesktop ? 500 : isTablet ? 350 : 250,
    borderRadius: isDesktop ? 250 : isTablet ? 175 : 125,
    backgroundColor: '#FFA500',
    bottom: -150,
    left: -150,
    opacity: 0.08,
  },
  heroContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: isDesktop ? 40 : isTablet ? 30 : 25,
    maxWidth: 1100,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: isMobile ? 15 : 20,
    position: 'relative',
    zIndex: 10,
  },
  heroTitle: {
    fontSize: isDesktop ? 72 : isTablet ? 56 : 40,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: isDesktop ? 88 : isTablet ? 68 : 48,
    letterSpacing: isDesktop ? 4 : isTablet ? 3 : 2,
    textTransform: 'uppercase',
    ...(Platform.OS === 'web' && {
      textShadow: '0 0 20px rgba(255, 0, 255, 0.8), 0 0 40px rgba(0, 255, 255, 0.6)',
    }),
  },
  heroTitleHighlight: {
    color: '#00FFFF',
    ...(Platform.OS === 'web' && {
      textShadow: '0 0 30px rgba(0, 255, 255, 1), 0 0 60px rgba(0, 255, 255, 0.8)',
    }),
  },
  heroSubtitle: {
    fontSize: isDesktop ? 32 : isTablet ? 28 : 24,
    color: '#FF00FF',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
    ...(Platform.OS === 'web' && {
      textShadow: '0 0 15px rgba(255, 0, 255, 0.6)',
    }),
  },
  heroDescription: {
    fontSize: isDesktop ? 18 : isTablet ? 16 : 15,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: isDesktop ? 28 : isTablet ? 24 : 22,
    marginBottom: isDesktop ? 30 : isTablet ? 25 : 20,
    maxWidth: 850,
    paddingHorizontal: 20,
    letterSpacing: 0.3,
  },
  ctaButton: {
    borderRadius: 35,
    overflow: 'hidden',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)',
    }),
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: isDesktop ? 50 : isTablet ? 42 : 35,
    paddingVertical: isDesktop ? 20 : isTablet ? 18 : 16,
    borderRadius: 35,
  },
  ctaButtonText: {
    fontSize: isDesktop ? 22 : isTablet ? 20 : 18,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  // Combined Section: HOW IT WORKS & WHY CHOOSE US
  combinedSection: {
    paddingVertical: isDesktop ? 70 : isTablet ? 50 : 40,
    paddingHorizontal: isDesktop ? width * 0.1 : isTablet ? 40 : isMobile ? 15 : 20,
    position: 'relative',
    overflow: 'hidden',
    ...(Platform.OS === 'web' && {
      isolation: 'isolate',
      contain: 'layout style paint',
    }),
  },
  combinedSectionPart: {
    marginBottom: isDesktop ? 60 : isTablet ? 50 : 40,
    width: '100%',
  },
  // Timeline Section (kept for compatibility)
  timelineSection: {
    paddingVertical: isDesktop ? 70 : isTablet ? 50 : 40,
    paddingHorizontal: isDesktop ? width * 0.1 : isTablet ? 40 : 20,
    position: 'relative',
    overflow: 'hidden',
    ...(Platform.OS === 'web' && {
      isolation: 'isolate',
      contain: 'layout style paint',
    }),
  },
  timelineContainer: {
    flexDirection: isDesktop ? 'row' : isTablet ? 'row' : 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    gap: isDesktop ? 20 : isTablet ? 15 : 30,
    position: 'relative',
    paddingVertical: isDesktop ? 40 : isTablet ? 30 : 20,
  },
  timelineConnectingLine: {
    position: 'absolute',
    top: isDesktop ? '50%' : 0,
    left: isDesktop ? '10%' : '50%',
    right: isDesktop ? '10%' : '50%',
    height: isDesktop ? 2 : '100%',
    width: isDesktop ? '80%' : 2,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    zIndex: 0,
    ...(isDesktop && {
      transform: [{ translateY: -1 }],
    }),
    ...(isMobile && {
      transform: [{ translateX: -1 }],
    }),
  },
  timelineStepContainer: {
    flexDirection: isDesktop ? 'row' : isTablet ? 'row' : 'column',
    alignItems: isDesktop ? 'center' : isTablet ? 'center' : 'flex-start',
    justifyContent: 'center',
    flex: isDesktop ? 1 : isTablet ? 0.48 : 1,
    minWidth: isDesktop ? 250 : isTablet ? 200 : '100%',
    width: isMobile ? '100%' : undefined,
    position: 'relative',
    zIndex: 10,
    marginBottom: isMobile ? 15 : 0,
  },
  timelineStep: {
    flexDirection: isDesktop ? 'column' : isTablet ? 'column' : 'row',
    alignItems: isDesktop ? 'center' : isTablet ? 'center' : 'flex-start',
    justifyContent: isMobile ? 'flex-start' : 'center',
    backgroundColor: '#1A1F2E',
    padding: isDesktop ? 30 : isTablet ? 25 : 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
    flex: 1,
    minHeight: isDesktop ? 200 : isTablet ? 180 : 'auto',
    width: '100%',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
    }),
  },
  timelineStepIcon: {
    width: isDesktop ? 70 : isTablet ? 60 : 50,
    height: isDesktop ? 70 : isTablet ? 60 : 50,
    borderRadius: isDesktop ? 35 : isTablet ? 30 : 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: isDesktop ? 20 : isTablet ? 15 : 0,
    marginRight: isDesktop ? 0 : isTablet ? 0 : 15,
    ...(Platform.OS === 'web' && {
      boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
    }),
  },
  timelineStepContent: {
    alignItems: isDesktop ? 'center' : isTablet ? 'center' : 'flex-start',
    flex: 1,
  },
  timelineStepTitle: {
    fontSize: isDesktop ? 22 : isTablet ? 20 : 18,
    fontWeight: 'bold',
    color: '#00FFFF',
    marginBottom: 10,
    textAlign: isDesktop ? 'center' : isTablet ? 'center' : 'left',
    letterSpacing: 0.5,
  },
  timelineStepDescription: {
    fontSize: isDesktop ? 15 : isTablet ? 14 : 13,
    color: '#CCCCCC',
    textAlign: isDesktop ? 'center' : isTablet ? 'center' : 'left',
    lineHeight: isDesktop ? 22 : isTablet ? 20 : 18,
    letterSpacing: 0.2,
  },
  timelineArrow: {
    marginHorizontal: isDesktop ? 15 : isTablet ? 10 : 0,
    marginVertical: isDesktop ? 0 : isTablet ? 0 : 15,
    zIndex: 5,
    position: 'relative',
  },
  // Stats Section
  statsSection: {
    paddingVertical: isDesktop ? 60 : isTablet ? 45 : 35,
    paddingHorizontal: isDesktop ? width * 0.1 : isTablet ? 40 : 20,
  },
  statsGradient: {
    borderRadius: 30,
    padding: isDesktop ? 80 : isTablet ? 60 : 40,
    alignItems: 'center',
  },
  statsTitle: {
    fontSize: isDesktop ? 42 : isTablet ? 36 : 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: isDesktop ? 35 : isTablet ? 30 : 25,
    letterSpacing: 1,
  },
  statsGrid: {
    flexDirection: isDesktop ? 'row' : isTablet ? 'row' : 'column',
    flexWrap: 'wrap',
    justifyContent: isDesktop ? 'space-around' : isTablet ? 'space-around' : 'center',
    alignItems: 'center',
    width: '100%',
    gap: isDesktop ? 30 : isTablet ? 25 : 20,
  },
  statCard: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: isDesktop ? 200 : isTablet ? 150 : '100%',
    maxWidth: isMobile ? '100%' : undefined,
    padding: isDesktop ? 30 : isTablet ? 25 : 20,
  },
  statIconContainer: {
    width: isDesktop ? 80 : isTablet ? 70 : 60,
    height: isDesktop ? 80 : isTablet ? 70 : 60,
    borderRadius: isDesktop ? 40 : isTablet ? 35 : 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    ...(Platform.OS === 'web' && {
      boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
    }),
  },
  statNumber: {
    fontSize: isDesktop ? 52 : isTablet ? 44 : 36,
    fontWeight: '900',
    color: '#00FFFF',
    marginBottom: 10,
    letterSpacing: 2,
    ...(Platform.OS === 'web' && {
      textShadow: '0 0 20px rgba(0, 255, 255, 0.8)',
    }),
  },
  statLabel: {
    fontSize: isDesktop ? 18 : isTablet ? 16 : 14,
    color: '#CCCCCC',
    textAlign: 'center',
    fontWeight: '600',
  },
  // Timeline Features Section
  timelineFeaturesSection: {
    paddingVertical: isDesktop ? 70 : isTablet ? 50 : 40,
    paddingHorizontal: isDesktop ? width * 0.1 : isTablet ? 40 : 20,
    position: 'relative',
    overflow: 'hidden',
  },
  timelineFeaturesHeader: {
    textAlign: 'center',
    marginBottom: isDesktop ? 25 : isTablet ? 20 : 18,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  timelineFeaturesTitle: {
    fontSize: isDesktop ? 48 : isTablet ? 40 : 32,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 3,
    textTransform: 'uppercase',
    ...(Platform.OS === 'web' && {
      textShadow: '0 0 20px rgba(255, 0, 255, 0.6), 0 0 40px rgba(0, 255, 255, 0.4)',
    }),
  },
  timelineFeaturesHighlight: {
    color: '#00FFFF',
  },
  timelineFeaturesSubtitle: {
    fontSize: isDesktop ? 22 : isTablet ? 20 : 18,
    color: '#999999',
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  timelineContainerWrapper: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    position: 'relative',
    borderRadius: 24,
    paddingVertical: isDesktop ? 60 : isTablet ? 50 : 40,
    paddingHorizontal: isDesktop ? 40 : isTablet ? 30 : 20,
    overflow: 'hidden',
  },
  timelineVerticalLine: {
    position: 'absolute',
    left: isDesktop ? '50%' : 20,
    top: isDesktop ? 60 : 50,
    bottom: isDesktop ? 60 : 50,
    width: 2,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    ...(isDesktop && {
      transform: [{ translateX: -1 }],
    }),
  },
  timelineTopArrow: {
    position: 'absolute',
    left: isDesktop ? '50%' : 20,
    top: isDesktop ? 40 : 30,
    width: isDesktop ? 32 : isTablet ? 28 : 24,
    height: isDesktop ? 32 : isTablet ? 28 : 24,
    ...(isDesktop && {
      transform: [{ translateX: -16 }],
    }),
    ...(isTablet && {
      transform: [{ translateX: -14 }],
    }),
    ...(isMobile && {
      transform: [{ translateX: -12 }],
    }),
    zIndex: 20,
  },
  timelineArrowCircle: {
    width: '100%',
    height: '100%',
    borderRadius: isDesktop ? 16 : isTablet ? 14 : 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)',
    }),
  },
  timelineCardsContainer: {
    position: 'relative',
    zIndex: 10,
  },
  gamesTimelineContainer: {
    position: 'relative',
    zIndex: 10,
    paddingVertical: isDesktop ? 40 : isTablet ? 30 : 20,
  },
  gameTimelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isDesktop ? 30 : isTablet ? 25 : 20,
    position: 'relative',
    minHeight: isDesktop ? 80 : isTablet ? 70 : 60,
  },
  gameTimelineCard: {
    flex: 1,
    padding: isDesktop ? 20 : isTablet ? 18 : 16,
    backgroundColor: '#1A1F2E',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
    minWidth: isDesktop ? 420 : isTablet ? 360 : '100%',
    maxWidth: isDesktop ? 520 : isTablet ? 480 : '100%',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    }),
  },
  gameTimelineCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  gameTimelineIconContainer: {
    width: isDesktop ? 45 : isTablet ? 40 : 35,
    height: isDesktop ? 45 : isTablet ? 40 : 35,
    borderRadius: isDesktop ? 22.5 : isTablet ? 20 : 17.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    ...(Platform.OS === 'web' && {
      boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
    }),
  },
  gameTimelineCardContent: {
    flex: 1,
  },
  gameTimelineLeft: {
    marginRight: isDesktop ? 25 : isTablet ? 20 : 15,
    alignItems: 'flex-end',
  },
  gameTimelineRight: {
    marginLeft: isDesktop ? 25 : isTablet ? 20 : 15,
    alignItems: 'flex-start',
  },
  gameTimelineTitle: {
    fontSize: isDesktop ? 24 : isTablet ? 22 : 18,
    fontWeight: 'bold',
    color: '#00FFFF',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  gameTimelineSubtitle: {
    fontSize: isDesktop ? 15 : isTablet ? 14 : 13,
    color: '#00FFFF',
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  gameTimelineDescription: {
    fontSize: isDesktop ? 13 : isTablet ? 12 : 11,
    color: '#CCCCCC',
    lineHeight: isDesktop ? 18 : isTablet ? 16 : 14,
    letterSpacing: 0.2,
  },
  gameTimelineConnector: {
    width: isDesktop ? 40 : isTablet ? 30 : 25,
    height: 2,
    backgroundColor: 'rgba(255, 215, 0, 0.4)',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.4)',
    zIndex: 5,
  },
  gameTimelineDot: {
    width: isDesktop ? 16 : isTablet ? 14 : 12,
    height: isDesktop ? 16 : isTablet ? 14 : 12,
    borderRadius: isDesktop ? 8 : isTablet ? 7 : 6,
    backgroundColor: '#FFD700',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    zIndex: 10,
    position: 'absolute',
    left: isDesktop ? '50%' : '50%',
    ...(isDesktop && {
      transform: [{ translateX: -8 }],
    }),
    ...(isTablet && {
      transform: [{ translateX: -7 }],
    }),
    ...(isMobile && {
      transform: [{ translateX: -6 }],
    }),
    ...(Platform.OS === 'web' && {
      boxShadow: '0 2px 8px rgba(255, 215, 0, 0.5)',
    }),
  },
  gameTimelineSpacer: {
    flex: 1,
  },
  timelineCardWrapper: {
    flexDirection: isDesktop ? 'row' : 'column',
    marginBottom: isDesktop ? 25 : isTablet ? 20 : 18,
    position: 'relative',
  },
  timelineCardSpacer: {
    width: isDesktop ? '50%' : 0,
  },
  timelineFeatureCard: {
    width: isDesktop ? '45%' : '100%',
    backgroundColor: '#141E30',
    padding: isDesktop ? 24 : isTablet ? 20 : 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
    position: 'relative',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    }),
  },
  timelineCardLeft: {
    alignSelf: isDesktop ? 'flex-end' : 'flex-start',
    marginRight: isDesktop ? 'auto' : 0,
    marginLeft: isDesktop ? 0 : 0,
  },
  timelineCardRight: {
    alignSelf: isDesktop ? 'flex-start' : 'flex-start',
    marginLeft: isDesktop ? 'auto' : 0,
    marginRight: isDesktop ? 0 : 0,
  },
  timelineCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  timelineCardIconContainer: {
    width: isDesktop ? 48 : isTablet ? 44 : 40,
    height: isDesktop ? 48 : isTablet ? 44 : 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineCardTitle: {
    fontSize: isDesktop ? 20 : isTablet ? 18 : 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  timelineCardDescription: {
    fontSize: isDesktop ? 15 : isTablet ? 14 : 13,
    color: '#CCCCCC',
    lineHeight: isDesktop ? 22 : isTablet ? 20 : 18,
    letterSpacing: 0.2,
  },
  timelineCardConnector: {
    position: 'absolute',
    top: isDesktop ? 34 : isTablet ? 32 : 30,
    width: isDesktop ? 48 : isTablet ? 40 : 32,
    height: 1,
    borderTopWidth: 2,
    borderTopColor: 'rgba(255, 215, 0, 0.4)',
    borderStyle: 'dashed',
  },
  timelineConnectorLeft: {
    right: isDesktop ? -48 : -40,
    ...(isMobile && {
      left: -32,
      right: 'auto',
    }),
  },
  timelineConnectorRight: {
    left: isDesktop ? -48 : -40,
    ...(isMobile && {
      left: -32,
    }),
  },
  timelineCardDot: {
    position: 'absolute',
    top: isDesktop ? 28 : isTablet ? 26 : 24,
    width: isDesktop ? 16 : isTablet ? 14 : 12,
    height: isDesktop ? 16 : isTablet ? 14 : 12,
    borderRadius: isDesktop ? 8 : isTablet ? 7 : 6,
    backgroundColor: '#FFD700',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    zIndex: 10,
    ...(Platform.OS === 'web' && {
      boxShadow: '0 2px 8px rgba(255, 215, 0, 0.5)',
    }),
  },
  timelineDotLeft: {
    right: isDesktop ? -56 : -48,
    ...(isMobile && {
      left: -40,
      right: 'auto',
    }),
  },
  timelineDotRight: {
    left: isDesktop ? -56 : -48,
    ...(isMobile && {
      left: -40,
    }),
  },
  // Features Section
  featuresSection: {
    paddingVertical: isDesktop ? 70 : isTablet ? 50 : 40,
    paddingHorizontal: isDesktop ? width * 0.1 : isTablet ? 40 : 20,
    position: 'relative',
    overflow: 'hidden',
    ...(Platform.OS === 'web' && {
      isolation: 'isolate',
      contain: 'layout style paint',
    }),
  },
  sectionTitle: {
    fontSize: isDesktop ? 36 : isTablet ? 30 : 24,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: isDesktop ? 28 : isTablet ? 24 : 20,
    letterSpacing: 1,
  },
  featuresGrid: {
    flexDirection: isDesktop ? 'row' : isTablet ? 'row' : 'column',
    flexWrap: 'wrap',
    justifyContent: isDesktop ? 'space-between' : isTablet ? 'space-between' : 'center',
    gap: isDesktop ? 35 : isTablet ? 28 : 22,
    maxWidth: 1300,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: isMobile ? 10 : 0,
  },
  featureCard: {
    flex: isDesktop ? 1 : isTablet ? 0.48 : 1,
    minWidth: isDesktop ? 280 : isTablet ? 220 : '100%',
    maxWidth: isDesktop ? 320 : isTablet ? '100%' : '100%',
    backgroundColor: '#1A0A2A',
    padding: isDesktop ? 45 : isTablet ? 35 : 28,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 255, 0.4)',
    marginBottom: isDesktop ? 0 : isTablet ? 0 : 24,
    position: 'relative',
    overflow: 'hidden',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 8px 30px rgba(255, 0, 255, 0.3), 0 0 50px rgba(0, 255, 255, 0.2)',
      transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
    }),
  },
  featureCardGlow: {
    position: 'absolute',
    top: -50,
    left: -50,
    right: -50,
    bottom: -50,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 255, 255, 0.3)',
    ...(Platform.OS === 'web' && {
      filter: 'blur(40px)',
    }),
  },
  featureIconContainer: {
    marginBottom: 24,
  },
  iconGradient: {
    width: isDesktop ? 80 : isTablet ? 70 : 60,
    height: isDesktop ? 80 : isTablet ? 70 : 60,
    borderRadius: isDesktop ? 40 : isTablet ? 35 : 30,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 4px 20px rgba(0, 255, 255, 0.4), 0 0 30px rgba(255, 0, 255, 0.3)',
    }),
  },
  featureTitle: {
    fontSize: isDesktop ? 28 : isTablet ? 24 : 22,
    fontWeight: '800',
    color: '#00FFFF',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    ...(Platform.OS === 'web' && {
      textShadow: '0 0 15px rgba(0, 255, 255, 0.6)',
    }),
  },
  featureDescription: {
    fontSize: isDesktop ? 17 : isTablet ? 16 : 15,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: isDesktop ? 26 : isTablet ? 24 : 22,
    letterSpacing: 0.2,
  },
  // Featured Games Section
  featuredGamesSection: {
    paddingVertical: isDesktop ? 80 : isTablet ? 60 : 50,
    paddingHorizontal: isDesktop ? width * 0.05 : isTablet ? 30 : 20,
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
  },
  // Notice Board
  noticeBoard: {
    width: '100%',
    maxWidth: isDesktop ? 1200 : isTablet ? 900 : '100%',
    alignSelf: 'center',
    marginBottom: isDesktop ? 50 : isTablet ? 40 : 30,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 255, 0.4)',
    marginHorizontal: isMobile ? 0 : 'auto',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 8px 30px rgba(0, 255, 255, 0.2), 0 0 40px rgba(255, 0, 255, 0.15)',
    }),
  },
  noticeBoardGradient: {
    padding: isDesktop ? 28 : isTablet ? 24 : 20,
    position: 'relative',
    overflow: 'hidden',
  },
  noticeBoardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: isDesktop ? 24 : isTablet ? 20 : 18,
    paddingBottom: isDesktop ? 20 : isTablet ? 18 : 16,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0, 255, 255, 0.3)',
    position: 'relative',
    zIndex: 1,
  },
  noticeBoardTitle: {
    fontSize: isDesktop ? 24 : isTablet ? 22 : 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
    ...(Platform.OS === 'web' && {
      textShadow: '0 0 15px rgba(0, 255, 255, 0.6)',
    }),
  },
  noticeBoardContent: {
    gap: isDesktop ? 16 : isTablet ? 14 : 12,
  },
  noticeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: isDesktop ? 14 : isTablet ? 12 : 10,
    paddingVertical: isDesktop ? 8 : isTablet ? 6 : 4,
  },
  noticeText: {
    flex: 1,
    fontSize: isDesktop ? 16 : isTablet ? 15 : 14,
    color: '#CCCCCC',
    lineHeight: isDesktop ? 24 : isTablet ? 22 : 20,
    letterSpacing: 0.3,
  },
  noticeBold: {
    fontWeight: '700',
    color: '#00FFFF',
    ...(Platform.OS === 'web' && {
      textShadow: '0 0 8px rgba(0, 255, 255, 0.5)',
    }),
  },
  // Future Games Section
  futureGamesSection: {
    paddingVertical: isDesktop ? 70 : isTablet ? 50 : 40,
    paddingHorizontal: isDesktop ? width * 0.1 : isTablet ? 40 : 20,
    backgroundColor: '#141E30',
  },
  featuredGamesContainer: {
    maxWidth: isDesktop ? 1400 : isTablet ? 1200 : '100%',
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: isDesktop ? 40 : isTablet ? 30 : 20,
  },
  featuredGamesRow: {
    flexDirection: isDesktop ? 'row' : isTablet ? 'row' : 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    gap: isDesktop ? 40 : isTablet ? 32 : 24,
    marginBottom: isDesktop ? 20 : isTablet ? 18 : 16,
    width: '100%',
  },
  featuredGamesZigZagRow: {
    flexDirection: isDesktop ? 'row' : isTablet ? 'row' : 'column',
    width: '100%',
    marginBottom: isDesktop ? 60 : isTablet ? 50 : 40,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  featuredGamesSpacer: {
    width: '5%',
    minWidth: isDesktop ? '5%' : isTablet ? '5%' : 0,
  },
  featuredGamesHalfSpacer: {
    width: '23.75%',
    minWidth: isDesktop ? '23.75%' : isTablet ? '23.75%' : 0,
  },
  featuredGameCard: {
    flex: isMobile ? 0 : 1,
    width: isDesktop ? '31%' : isTablet ? '48%' : '100%',
    maxWidth: isDesktop ? '31%' : isTablet ? '48%' : '100%',
    backgroundColor: '#1A0A2A',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 0, 255, 0.4)',
    padding: isDesktop ? 28 : isTablet ? 24 : 20,
    minHeight: isDesktop ? 380 : isTablet ? 360 : 'auto',
    position: 'relative',
    overflow: 'hidden',
    alignSelf: 'stretch',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 4px 20px rgba(255, 0, 255, 0.3), 0 0 30px rgba(0, 255, 255, 0.2)',
    }),
  },
  featuredGameCardBorderGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 255, 0.8)',
    ...(Platform.OS === 'web' && {
      boxShadow: 'inset 0 0 30px rgba(255, 0, 255, 0.3), 0 0 40px rgba(0, 255, 255, 0.4)',
    }),
  },
  featuredGameCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 14,
  },
  featuredGameIconContainer: {
    width: isDesktop ? 48 : isTablet ? 44 : 40,
    height: isDesktop ? 48 : isTablet ? 44 : 40,
    borderRadius: isDesktop ? 14 : isTablet ? 12 : 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 255, 0.5)',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 4px 20px rgba(0, 255, 255, 0.4), 0 0 30px rgba(255, 0, 255, 0.3)',
    }),
  },
  featuredGameHeaderContent: {
    flex: 1,
    gap: 10,
  },
  featuredGameCardTitle: {
    fontSize: isDesktop ? 26 : isTablet ? 24 : 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
    lineHeight: isDesktop ? 32 : isTablet ? 30 : 28,
    textTransform: 'uppercase',
    ...(Platform.OS === 'web' && {
      textShadow: '0 0 10px rgba(255, 0, 255, 0.5)',
    }),
  },
  featuredGameBadgeContainer: {
    alignSelf: 'flex-start',
  },
  futureGamesContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isDesktop ? 50 : isTablet ? 40 : 30,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  futureGamesDescription: {
    fontSize: isDesktop ? 22 : isTablet ? 20 : 18,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: isDesktop ? 32 : isTablet ? 28 : 24,
    marginBottom: isDesktop ? 50 : isTablet ? 40 : 30,
    letterSpacing: 0.3,
    paddingHorizontal: 20,
  },
  futureGamesIconContainer: {
    marginBottom: isDesktop ? 40 : isTablet ? 30 : 25,
  },
  futureGamesIcon: {
    width: isDesktop ? 120 : isTablet ? 100 : 80,
    height: isDesktop ? 120 : isTablet ? 100 : 80,
    borderRadius: isDesktop ? 60 : isTablet ? 50 : 40,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 8px 30px rgba(255, 215, 0, 0.4)',
    }),
  },
  futureGamesSubtext: {
    fontSize: isDesktop ? 18 : isTablet ? 16 : 15,
    color: '#00FFFF',
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  featuredGameDivider: {
    height: 2,
    backgroundColor: 'rgba(0, 255, 255, 0.3)',
    marginBottom: 18,
    marginTop: 2,
    ...(Platform.OS === 'web' && {
      boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
    }),
  },
  featuredGameAppSection: {
    width: '100%',
  },
  featuredGameAppBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 255, 255, 0.5)',
  },
  featuredGameAppBadgeText: {
    fontSize: isDesktop ? 12 : isTablet ? 11 : 10,
    fontWeight: '700',
    color: '#00FFFF',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  featuredGameAppDescription: {
    fontSize: isDesktop ? 15 : isTablet ? 14 : 13,
    color: '#CCCCCC',
    lineHeight: isDesktop ? 22 : isTablet ? 20 : 18,
    marginBottom: 18,
    letterSpacing: 0.2,
  },
  featuredGameBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    alignSelf: 'flex-start',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
    }),
  },
  featuredGameBadgeText: {
    fontSize: isDesktop ? 14 : isTablet ? 13 : 12,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 0.5,
  },
  featuredGameTitle: {
    fontSize: isDesktop ? 48 : isTablet ? 40 : 32,
    fontWeight: '900',
    color: '#00FFFF',
    marginBottom: 10,
    letterSpacing: 1,
  },
  featuredGameFullTitle: {
    fontSize: isDesktop ? 24 : isTablet ? 20 : 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  featuredGameSubTagline: {
    fontSize: isDesktop ? 16 : isTablet ? 15 : 14,
    fontWeight: '600',
    color: '#00FFFF',
    marginBottom: 20,
    letterSpacing: 0.5,
    fontStyle: 'italic',
  },
  featuredGameDescription: {
    fontSize: isDesktop ? 18 : isTablet ? 16 : 15,
    color: '#CCCCCC',
    lineHeight: isDesktop ? 28 : isTablet ? 26 : 24,
    marginBottom: 30,
    letterSpacing: 0.3,
  },
  featuredGameAppTitle: {
    fontSize: isDesktop ? 28 : isTablet ? 24 : 22,
    fontWeight: 'bold',
    color: '#00FFFF',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  featuredGameFeatures: {
    gap: 12,
  },
  featuredGameFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 4,
  },
  featuredGameFeatureIcon: {
    width: isDesktop ? 24 : isTablet ? 22 : 20,
    height: isDesktop ? 24 : isTablet ? 22 : 20,
    borderRadius: isDesktop ? 12 : isTablet ? 11 : 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    ...(Platform.OS === 'web' && {
      boxShadow: '0 2px 12px rgba(0, 255, 255, 0.5), 0 0 20px rgba(255, 0, 255, 0.3)',
    }),
  },
  featuredGameFeatureText: {
    fontSize: isDesktop ? 15 : isTablet ? 14 : 13,
    color: '#E0E0E0',
    flex: 1,
    letterSpacing: 0.2,
    lineHeight: isDesktop ? 22 : isTablet ? 20 : 18,
  },
  featuredGameImageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredGameImageWrapper: {
    width: isDesktop ? 400 : isTablet ? 300 : 250,
    height: isDesktop ? 400 : isTablet ? 300 : 250,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    padding: isDesktop ? 40 : isTablet ? 30 : 25,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 8px 30px rgba(255, 215, 0, 0.2)',
    }),
  },
  featuredGameImage: {
    width: '100%',
    height: '100%',
  },
  featuredGameArrow: {
    paddingHorizontal: isDesktop ? 20 : isTablet ? 15 : 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Games Section
  gamesSection: {
    paddingVertical: isDesktop ? 140 : isTablet ? 100 : 70,
    paddingHorizontal: isDesktop ? width * 0.1 : isTablet ? 40 : 20,
    backgroundColor: '#141E30',
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: isDesktop ? 45 : isTablet ? 35 : 25,
    maxWidth: 1100,
    alignSelf: 'center',
    width: '100%',
  },
  gameCard: {
    width: isDesktop ? 240 : isTablet ? 200 : 160,
    backgroundColor: '#1A1F2E',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    padding: isDesktop ? 28 : isTablet ? 24 : 18,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
    }),
  },
  gameImage: {
    width: '75%',
    height: 120,
    marginBottom: 12,
  },
  gameName: {
    fontSize: isDesktop ? 20 : isTablet ? 18 : 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  gameDescription: {
    fontSize: isDesktop ? 14 : isTablet ? 13 : 12,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Tournaments Section
  tournamentsSection: {
    paddingVertical: isDesktop ? 70 : isTablet ? 50 : 40,
    paddingHorizontal: isDesktop ? width * 0.1 : isTablet ? 40 : 20,
    backgroundColor: '#0F1419',
  },
  tournamentsGrid: {
    flexDirection: isDesktop ? 'row' : isTablet ? 'row' : 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: isDesktop ? 30 : isTablet ? 25 : 20,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  tournamentCard: {
    flex: isDesktop ? 1 : isTablet ? 0.48 : 1,
    minWidth: isDesktop ? 300 : isTablet ? 250 : '100%',
    maxWidth: isDesktop ? 380 : isTablet ? '100%' : '100%',
    borderRadius: 24,
    overflow: 'hidden',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
    }),
  },
  tournamentGradient: {
    padding: isDesktop ? 30 : isTablet ? 25 : 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  tournamentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tournamentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  tournamentBadgeText: {
    color: '#00FFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tournamentDate: {
    color: '#CCCCCC',
    fontSize: 14,
    fontWeight: '600',
  },
  tournamentTitle: {
    fontSize: isDesktop ? 24 : isTablet ? 22 : 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  tournamentInfo: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  tournamentInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tournamentInfoText: {
    color: '#CCCCCC',
    fontSize: 14,
    fontWeight: '600',
  },
  tournamentPrize: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 215, 0, 0.2)',
  },
  tournamentPrizeText: {
    fontSize: isDesktop ? 28 : isTablet ? 24 : 20,
    fontWeight: '900',
    color: '#00FFFF',
    letterSpacing: 1,
  },
  // Live Section
  liveSection: {
    paddingVertical: isDesktop ? 40 : isTablet ? 35 : 30,
    paddingHorizontal: isDesktop ? width * 0.1 : isTablet ? 40 : 20,
    alignItems: 'center',
    backgroundColor: '#141E30',
  },
  liveGradient: {
    borderRadius: 30,
    padding: isDesktop ? 80 : isTablet ? 60 : 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 0, 0, 0.3)',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 10px 40px rgba(255, 0, 0, 0.2)',
    }),
  },
  liveContent: {
    alignItems: 'center',
    maxWidth: 800,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    marginBottom: 24,
    gap: 8,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF0000',
    ...(Platform.OS === 'web' && {
      animation: 'pulse 2s infinite',
    }),
  },
  liveBadgeText: {
    color: '#FF0000',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  liveTitle: {
    fontSize: isDesktop ? 36 : isTablet ? 30 : 24,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 1,
  },
  liveDescription: {
    fontSize: isDesktop ? 20 : isTablet ? 18 : 16,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: isDesktop ? 30 : isTablet ? 26 : 24,
    marginBottom: 40,
    letterSpacing: 0.3,
  },
  liveButton: {
    borderRadius: 35,
    overflow: 'hidden',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 8px 25px rgba(255, 0, 0, 0.4)',
    }),
  },
  liveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: isDesktop ? 50 : isTablet ? 42 : 35,
    paddingVertical: isDesktop ? 20 : isTablet ? 18 : 16,
    borderRadius: 35,
    gap: 10,
  },
  liveButtonText: {
    fontSize: isDesktop ? 20 : isTablet ? 18 : 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  // FAQ Section
  faqSection: {
    paddingVertical: isDesktop ? 70 : isTablet ? 50 : 40,
    paddingHorizontal: isDesktop ? width * 0.1 : isTablet ? 40 : 20,
    position: 'relative',
    overflow: 'hidden',
    ...(Platform.OS === 'web' && {
      isolation: 'isolate',
      contain: 'layout style paint',
    }),
  },
  faqContainer: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    flexDirection: isDesktop ? 'row' : 'column',
    alignItems: isDesktop ? 'flex-start' : 'center',
    justifyContent: 'center',
    gap: isDesktop ? 60 : isTablet ? 40 : 30,
  },
  faqTitleContainer: {
    flex: isDesktop ? 1 : 1,
    ...(isDesktop && {
      position: 'sticky',
      top: isDesktop ? 100 : 80,
      alignSelf: 'flex-start',
    }),
    alignItems: isDesktop ? 'flex-start' : 'center',
    justifyContent: isDesktop ? 'flex-start' : 'center',
    width: isMobile ? '100%' : undefined,
    ...(Platform.OS === 'web' && {
      willChange: 'transform',
    }),
  },
  faqTitle: {
    fontSize: isDesktop ? 48 : isTablet ? 40 : 32,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: isDesktop ? 56 : isTablet ? 48 : 40,
    textAlign: isDesktop ? 'left' : 'center',
    letterSpacing: 0.5,
  },
  faqTitleHighlight: {
    color: '#00FFFF',
  },
  faqItemsContainer: {
    flex: isDesktop ? 2 : 1,
    gap: isDesktop ? 16 : isTablet ? 14 : 12,
    width: isMobile ? '100%' : undefined,
    alignItems: 'stretch',
    ...(Platform.OS === 'web' && {
      isolation: 'isolate',
      contain: 'layout style paint',
      transform: 'translateZ(0)',
    }),
  },
  faqItem: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    width: '100%',
    ...(Platform.OS === 'web' && {
      willChange: 'max-height, opacity',
      backfaceVisibility: 'hidden',
      isolation: 'isolate',
      contain: 'layout style paint',
      transform: 'translateZ(0)',
    }),
  },
  faqItemOpen: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderColor: 'rgba(255, 215, 0, 0.4)',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 4px 20px rgba(255, 215, 0, 0.2)',
    }),
  },
  faqItemClosed: {
    backgroundColor: '#1A1F2E',
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  faqButton: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: isDesktop ? 24 : isTablet ? 20 : 18,
    gap: 16,
    width: '100%',
    minHeight: isMobile ? 60 : undefined,
  },
  faqQuestion: {
    flex: 1,
    fontSize: isDesktop ? 18 : isTablet ? 17 : 16,
    fontWeight: 'bold',
    lineHeight: isDesktop ? 26 : isTablet ? 24 : 22,
    letterSpacing: 0.3,
    textAlign: 'left',
  },
  faqQuestionOpen: {
    color: '#00FFFF',
  },
  faqQuestionClosed: {
    color: '#CCCCCC',
  },
  faqIconContainer: {
    width: isDesktop ? 32 : isTablet ? 30 : 28,
    height: isDesktop ? 32 : isTablet ? 30 : 28,
    borderRadius: isDesktop ? 16 : isTablet ? 15 : 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  faqIconContainerOpen: {
    backgroundColor: '#FFD700',
  },
  faqIconContainerClosed: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
  },
  faqAnswerContainer: {
    overflow: 'hidden',
    ...(Platform.OS === 'web' && {
      willChange: 'transform, max-height, opacity',
      backfaceVisibility: 'hidden',
    }),
  },
  faqAnswer: {
    paddingHorizontal: isDesktop ? 24 : isTablet ? 20 : 18,
    paddingBottom: isDesktop ? 24 : isTablet ? 20 : 18,
    paddingTop: 0,
  },
  faqAnswerText: {
    fontSize: isDesktop ? 16 : isTablet ? 15 : 14,
    color: '#CCCCCC',
    lineHeight: isDesktop ? 24 : isTablet ? 22 : 20,
    letterSpacing: 0.2,
  },
  // CTA Section
  ctaSection: {
    paddingVertical: isDesktop ? 70 : isTablet ? 50 : 40,
    paddingHorizontal: isDesktop ? width * 0.1 : isTablet ? 40 : 20,
  },
  ctaGradient: {
    borderRadius: 35,
    padding: isDesktop ? 90 : isTablet ? 70 : 50,
    alignItems: 'center',
    maxWidth: 1000,
    alignSelf: 'center',
    width: '100%',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
    }),
  },
  ctaTitle: {
    fontSize: isDesktop ? 48 : isTablet ? 40 : 32,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 1,
  },
  ctaSubtitle: {
    fontSize: isDesktop ? 22 : isTablet ? 20 : 18,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: isDesktop ? 30 : isTablet ? 25 : 20,
    maxWidth: 750,
    lineHeight: isDesktop ? 32 : isTablet ? 28 : 26,
    letterSpacing: 0.3,
  },
  ctaButtonLarge: {
    borderRadius: 35,
    overflow: 'hidden',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)',
    }),
  },
  // Footer
  footer: {
    backgroundColor: '#0A0E1A',
    paddingVertical: isDesktop ? 60 : isTablet ? 50 : 40,
    paddingHorizontal: isDesktop ? width * 0.1 : isTablet ? 40 : 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 215, 0, 0.1)',
  },
  footerContent: {
    flexDirection: isDesktop ? 'row' : isTablet ? 'row' : 'column',
    justifyContent: 'space-between',
    marginBottom: isDesktop ? 40 : isTablet ? 30 : 25,
    gap: isDesktop ? 40 : isTablet ? 30 : 25,
  },
  footerSection: {
    flex: isDesktop ? 1 : isTablet ? 1 : 1,
  },
  footerLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  footerLogoCircle: {
    width: isDesktop ? 50 : isTablet ? 45 : 40,
    height: isDesktop ? 50 : isTablet ? 45 : 40,
    borderRadius: isDesktop ? 25 : isTablet ? 22.5 : 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#00FFFF',
    overflow: 'hidden',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
    }),
  },
  footerLogo: {
    width: '100%',
    height: '100%',
  },
  footerLogoText: {
    fontSize: isDesktop ? 28 : isTablet ? 24 : 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  footerDescription: {
    fontSize: isDesktop ? 16 : isTablet ? 15 : 14,
    color: '#CCCCCC',
    lineHeight: isDesktop ? 24 : isTablet ? 22 : 20,
    letterSpacing: 0.3,
  },
  footerSectionTitle: {
    fontSize: isDesktop ? 20 : isTablet ? 18 : 16,
    fontWeight: 'bold',
    color: '#00FFFF',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  footerLink: {
    marginBottom: 12,
  },
  footerLinkText: {
    fontSize: isDesktop ? 16 : isTablet ? 15 : 14,
    color: '#CCCCCC',
    letterSpacing: 0.3,
  },
  socialLinks: {
    flexDirection: 'row',
    gap: 15,
  },
  socialButton: {
    width: isDesktop ? 45 : isTablet ? 40 : 35,
    height: isDesktop ? 45 : isTablet ? 40 : 35,
    borderRadius: isDesktop ? 22.5 : isTablet ? 20 : 17.5,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  footerBottom: {
    alignItems: 'center',
    paddingTop: isDesktop ? 30 : isTablet ? 25 : 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 215, 0, 0.1)',
  },
  footerText: {
    fontSize: isDesktop ? 15 : isTablet ? 14 : 13,
    color: '#999999',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  footerSubtext: {
    fontSize: isDesktop ? 13 : isTablet ? 12 : 11,
    color: '#666666',
    letterSpacing: 0.3,
  },
});

export default WebLandingPage;
