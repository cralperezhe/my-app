import { MaterialCommunityIcons } from '@expo/vector-icons'
import { GlassView } from 'expo-glass-effect'
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import colors from '../utils/colors'

export type TabKey = 'mapa' | 'rutas'

export interface TabItem {
    key: TabKey
    label: string
    icon: keyof typeof MaterialCommunityIcons.glyphMap
}

interface BottomNavigationProps {
    tabs: TabItem[]
    activeTab: TabKey
    onChangeTab: (tab: TabKey) => void
}

// Liquid Glass solo está disponible en iOS 26 o superior
const isLiquidGlassSupported =
    Platform.OS === 'ios' && Number(Platform.Version) >= 26

const TabButton = ({
    tab,
    active,
    onChange,
}: {
    tab: TabItem
    active: boolean
    onChange: (tab: TabKey) => void
}) => (
    <TouchableOpacity
        style={styles.tab_button}
        activeOpacity={0.7}
        onPress={() => onChange(tab.key)}
    >
        <MaterialCommunityIcons
            name={tab.icon}
            size={26}
            color={active ? colors.primary : colors.primary_dark}
        />
        <Text style={[styles.tab_label, active && styles.tab_label_active]}>
            {tab.label}
        </Text>
    </TouchableOpacity>
)

export default function BottomNavigation({
    tabs,
    activeTab,
    onChangeTab,
}: BottomNavigationProps) {
    const content = (
        <View style={styles.tabs}>
            {tabs.map((tab) => (
                <TabButton
                    key={tab.key}
                    tab={tab}
                    active={tab.key === activeTab}
                    onChange={onChangeTab}
                />
            ))}
        </View>
    )

    return (
        <View style={styles.wrapper}>
            {isLiquidGlassSupported ? (
                <GlassView
                    style={styles.bar}
                    glassEffectStyle="regular"
                    isInteractive
                >
                    {content}
                </GlassView>
            ) : (
                <View style={styles.bar_fallback}>{content}</View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    bar: {
        borderRadius: 26,
        overflow: 'hidden',
    },
    bar_fallback: {
        borderRadius: 26,
        backgroundColor: colors.primary_light,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
    },
    tabs: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    tab_button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 28,
        paddingVertical: 4,
        gap: 2,
    },
    tab_label: {
        fontSize: 12,
        color: colors.primary_dark,
    },
    tab_label_active: {
        color: colors.primary,
        fontWeight: '600',
    },
})
