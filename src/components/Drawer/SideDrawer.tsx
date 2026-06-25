import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Modal, Dimensions, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useDrawer } from '../../context/DrawerContext';
import { useTheme } from '../../context/ThemeContext';
import { RADIUS, SPACING } from '../../styles/spacing';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.8, 320);

interface ProjectDetails {
  id: string;
  name: string;
  category: 'Trading Systems' | 'AI & Dev Tools' | 'Showcase Apps';
  tag: string;
  tech: string[];
  desc: string;
  folders: string[];
}

const PROJECTS_DATA: ProjectDetails[] = [
  {
    id: 'exchange-v2',
    name: 'Exchange-v2',
    category: 'Trading Systems',
    tag: 'Matching Engine',
    tech: ['C++', 'Go', 'API', 'WebSockets', 'DB', 'Docker'],
    desc: 'Real-time order book matching engine and trading proxy backend. Handles millisecond execution speeds, websockets broadcasting, order routing, and market making services.',
    folders: ['/api', '/db', '/docker', '/engine', '/exchange-proxy', '/frontend', '/mm', '/ws'],
  },
  {
    id: 'exchange-v1',
    name: 'Exchange-v1',
    category: 'Trading Systems',
    tag: 'Realtime Terminal',
    tech: ['React', 'Binance Sockets', 'Vite', 'TypeScript'],
    desc: 'Real-time cryptocurrency trading frontend dashboard integrated directly with Binance streaming websockets and order proxies.',
    folders: ['/binance-frontend-realtime', '/exchange-proxy'],
  },
  {
    id: 'automatex',
    name: 'AutomateX',
    category: 'Trading Systems',
    tag: 'Workflow Engine',
    tech: ['Next.js', 'Prisma', 'Postgres', 'Turborepo'],
    desc: 'Visual trading workflow automation platform where users configure trigger nodes and action items (e.g. webhooks, buy/sell alerts) that execute automations on-the-fly.',
    folders: ['/packages', '/apps/web', '/apps/api'],
  },
  {
    id: 'predictly',
    name: 'Predictly',
    category: 'AI & Dev Tools',
    tag: 'Predictive Analytics',
    tech: ['Turborepo', 'TypeScript', 'Bun', 'React Native'],
    desc: 'A machine learning predictive forecasting application. Uses Turborepo architecture to unify prediction calculations, databases, and UI clients under a bun-based framework.',
    folders: ['/packages/db', '/packages/ui', '/packages/eslint-config'],
  },
  {
    id: 'terminal-ui',
    name: 'Terminal-UI',
    category: 'AI & Dev Tools',
    tag: 'Agent UI Library',
    tech: ['Vite', 'React', 'Shadcn', 'TailwindCSS'],
    desc: 'A library of beautiful terminal components designed for AI agent interaction. Includes terminal consoles, logs streams, prompt indicators, and interactive code blocks.',
    folders: ['/src/components', '/src/hooks', '/src/utils'],
  },
  {
    id: 'portfolio-v3',
    name: 'Portfolio-v3',
    category: 'Showcase Apps',
    tag: 'Personal Website',
    tech: ['Vite', 'React', 'TypeScript', 'CSS'],
    desc: 'Interactive personal portfolio site showcase showcasing development history, coding experience, projects overview, and contact interfaces.',
    folders: ['/src/components', '/src/styles', '/src/assets'],
  },
  {
    id: 'kiddos',
    name: 'Kiddos',
    category: 'Showcase Apps',
    tag: 'Active SDUI Store',
    tech: ['React Native', 'Expo 56', 'Zustand', 'Reanimated'],
    desc: 'Server-Driven UI e-commerce store with over-the-air theme repainting, horizontal scrolling carousels, responsive animated overlays, and checkout calculations.',
    folders: ['/src/types', '/src/components', '/src/context', '/src/app'],
  },
];

export const SideDrawer: React.FC = () => {
  const theme = useTheme();
  const { isDrawerOpen, closeDrawer } = useDrawer();
  const [selectedProject, setSelectedProject] = useState<ProjectDetails | null>(null);

  const translateX = useSharedValue(-DRAWER_WIDTH);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    translateX.value = withTiming(isDrawerOpen ? 0 : -DRAWER_WIDTH, {
      duration: 250,
      easing: Easing.bezier(0.25, 1, 0.5, 1),
    });
    backdropOpacity.value = withTiming(isDrawerOpen ? 1 : 0, {
      duration: 250,
    });
  }, [isDrawerOpen]);

  const animatedDrawerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const animatedBackdropStyle = useAnimatedStyle(() => {
    return {
      opacity: backdropOpacity.value,
      pointerEvents: isDrawerOpen ? 'auto' : 'none',
    };
  });

  // Categorize projects
  const tradingSystems = PROJECTS_DATA.filter((p) => p.category === 'Trading Systems');
  const aiDevTools = PROJECTS_DATA.filter((p) => p.category === 'AI & Dev Tools');
  const showcaseApps = PROJECTS_DATA.filter((p) => p.category === 'Showcase Apps');

  const renderProjectItem = (proj: ProjectDetails) => {
    const isActive = proj.id === 'kiddos';
    return (
      <Pressable
        key={proj.id}
        onPress={() => setSelectedProject(proj)}
        style={({ pressed }) => [
          styles.projectItem,
          {
            backgroundColor: isActive ? theme.primaryLight : theme.background,
            borderColor: isActive ? theme.primary : theme.border,
            borderRadius: RADIUS.radiusMedium,
            opacity: pressed ? 0.9 : 1,
          },
        ]}
      >
        <View style={styles.projectInfo}>
          <View style={styles.projectHeaderRow}>
            <Text style={[styles.projectName, { color: theme.textPrimary }]}>{proj.name}</Text>
            <View style={[styles.badge, { backgroundColor: isActive ? theme.primary : '#E0E0E0', borderRadius: RADIUS.radiusSmall }]}>
              <Text style={[styles.badgeText, { color: isActive ? '#FFFFFF' : theme.textSecondary }]}>{proj.tag}</Text>
            </View>
          </View>
          <Text style={[styles.projectTechText, { color: theme.textSecondary }]} numberOfLines={1}>
            {proj.tech.join(' • ')}
          </Text>
        </View>
        <Feather name="chevron-right" size={16} color={theme.textSecondary} />
      </Pressable>
    );
  };

  return (
    <>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, animatedBackdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={closeDrawer} />
      </Animated.View>

      {/* Slide-out Menu Panel */}
      <Animated.View style={[styles.drawer, animatedDrawerStyle, { backgroundColor: theme.surface }]}>
        {/* Profile Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <View style={styles.profileRow}>
            <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
              <Text style={styles.avatarText}>NS</Text>
            </View>
            <View>
              <Text style={[styles.profileName, { color: theme.textPrimary }]}>Nishant Singh</Text>
              <Text style={[styles.profileRole, { color: theme.textSecondary }]}>Projects Workspace</Text>
            </View>
          </View>
          <Pressable onPress={closeDrawer} style={styles.closeBtn}>
            <Feather name="x" size={20} color={theme.dark} />
          </Pressable>
        </View>

        {/* Scrollable Categories */}
        <ScrollView style={styles.scrollList} showsVerticalScrollIndicator={false}>
          {/* Trading Systems */}
          <View style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <Ionicons name="trending-up-outline" size={16} color={theme.primary} />
              <Text style={[styles.categoryTitle, { color: theme.textSecondary }]}>Trading Systems</Text>
            </View>
            <View style={styles.categoryContent}>{tradingSystems.map(renderProjectItem)}</View>
          </View>

          {/* AI & Dev Tools */}
          <View style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <Ionicons name="construct-outline" size={16} color={theme.primary} />
              <Text style={[styles.categoryTitle, { color: theme.textSecondary }]}>AI & Dev Tools</Text>
            </View>
            <View style={styles.categoryContent}>{aiDevTools.map(renderProjectItem)}</View>
          </View>

          {/* Showcase Apps */}
          <View style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <Ionicons name="shapes-outline" size={16} color={theme.primary} />
              <Text style={[styles.categoryTitle, { color: theme.textSecondary }]}>Showcase Apps</Text>
            </View>
            <View style={styles.categoryContent}>{showcaseApps.map(renderProjectItem)}</View>
          </View>
        </ScrollView>
      </Animated.View>

      {/* Project Details Modal */}
      <Modal
        visible={selectedProject !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedProject(null)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setSelectedProject(null)}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            {selectedProject && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>📁 {selectedProject.name}</Text>
                  <Pressable onPress={() => setSelectedProject(null)} style={styles.modalCloseBtn}>
                    <Feather name="x" size={20} color={theme.textSecondary} />
                  </Pressable>
                </View>

                <Text style={[styles.modalCategoryText, { color: theme.primary }]}>
                  {selectedProject.category} • {selectedProject.tag}
                </Text>

                <Text style={[styles.modalDesc, { color: theme.textSecondary }]}>
                  {selectedProject.desc}
                </Text>

                <Text style={[styles.subheading, { color: theme.textPrimary }]}>Core Folders:</Text>
                <View style={styles.foldersContainer}>
                  {selectedProject.folders.map((folder) => (
                    <View key={folder} style={styles.folderRow}>
                      <Feather name="folder" size={14} color={theme.primary} style={{ marginRight: 6 }} />
                      <Text style={[styles.folderText, { color: theme.textPrimary }]}>{folder}</Text>
                    </View>
                  ))}
                </View>

                <Text style={[styles.subheading, { color: theme.textPrimary }]}>Tech Stack:</Text>
                <View style={styles.techContainer}>
                  {selectedProject.tech.map((t) => (
                    <View key={t} style={[styles.techTag, { backgroundColor: theme.background, borderColor: theme.border }]}>
                      <Text style={[styles.techText, { color: theme.primary }]}>{t}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 990,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: DRAWER_WIDTH,
    height: SCREEN_HEIGHT,
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  header: {
    height: 80,
    paddingTop: 24,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  profileName: {
    fontSize: 15,
    fontWeight: '700',
  },
  profileRole: {
    fontSize: 12,
  },
  closeBtn: {
    padding: 6,
  },
  scrollList: {
    flex: 1,
    padding: 16,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categoryContent: {
    gap: 8,
  },
  projectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  projectInfo: {
    flex: 1,
    marginRight: 10,
  },
  projectHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  projectName: {
    fontSize: 14,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
  projectTechText: {
    fontSize: 11,
    marginTop: 2,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 16,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalCategoryText: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
    marginBottom: 10,
  },
  modalDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  subheading: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
  },
  foldersContainer: {
    gap: 6,
    marginBottom: 16,
  },
  folderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  folderText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  techContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  techTag: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  techText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
