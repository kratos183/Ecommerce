'use client';
import { useTheme } from './ThemeProvider';

// ── Dark and Light token maps ──────────────────────────────────────────────────
export const DARK = {
    // Backgrounds
    bgPage: '#030712',
    bgSection: '#080D18',
    bgAlt: '#060B17',
    bgCard: '#111827',
    bgHero: '#0A0F1E',
    bgNav: '#0C1323',
    bgInput: 'rgba(255,255,255,0.04)',
    bgHover: 'rgba(255,255,255,0.06)',
    bgSubtle: 'rgba(255,255,255,0.02)',
    bgOverlay: 'rgba(255,255,255,0.03)',
    bgToolbar: '#060B17',
    bgMega: '#0F172A',
    bgDropdown: '#111827',
    bgGlass: 'rgba(9,9,20,0.92)',
    bgBottomNav: 'rgba(9,9,20,0.95)',

    // Borders
    borderCard: '#1F2937',
    borderMuted: '#1E293B',
    borderNav: '#0F172A',
    borderInput: 'rgba(255,255,255,0.08)',
    borderSubtle: 'rgba(255,255,255,0.06)',
    borderStrong: '#374151',

    // Text
    textPrimary: '#F9FAFB',
    textSecondary: '#94A3B8',
    textMuted: '#6B7280',
    textFaint: '#475569',
    textVeryFaint: '#334155',
    textTiny: '#1E293B',
    textLink: '#818CF8',
    textLinkHover: '#A5B4FC',
    textWhite: '#F9FAFB',

    // Skeleton shimmer
    shimmer1: '#1F2937',
    shimmer2: '#374151',
};

export const LIGHT = {
    // Backgrounds
    bgPage: '#F5F7FF',
    bgSection: '#EEF2FF',
    bgAlt: '#F0F4FF',
    bgCard: '#FFFFFF',
    bgHero: '#EEF2FF',
    bgNav: '#F0F4FF',
    bgInput: 'rgba(99,102,241,0.05)',
    bgHover: 'rgba(99,102,241,0.09)',
    bgSubtle: 'rgba(99,102,241,0.03)',
    bgOverlay: 'rgba(99,102,241,0.04)',
    bgToolbar: '#E8EDFF',
    bgMega: '#FFFFFF',
    bgDropdown: '#FFFFFF',
    bgGlass: 'rgba(255,255,255,0.92)',
    bgBottomNav: 'rgba(255,255,255,0.95)',

    // Borders
    borderCard: '#E0E7FF',
    borderMuted: '#C7D2FE',
    borderNav: '#E0E7FF',
    borderInput: 'rgba(99,102,241,0.2)',
    borderSubtle: 'rgba(99,102,241,0.1)',
    borderStrong: '#C7D2FE',

    // Text
    textPrimary: '#1E1B4B',
    textSecondary: '#4338CA',
    textMuted: '#6366F1',
    textFaint: '#6B7280',
    textVeryFaint: '#9CA3AF',
    textTiny: '#C7D2FE',
    textLink: '#6366F1',
    textLinkHover: '#4338CA',
    textWhite: '#1E1B4B',

    // Skeleton shimmer
    shimmer1: '#E0E7FF',
    shimmer2: '#C7D2FE',
};

/**
 * Returns the correct token set based on the current theme.
 * Use: const t = useT();  then  style={{ background: t.bgCard }}
 */
export function useT() {
    const { theme } = useTheme();
    return theme === 'dark' ? DARK : LIGHT;
}
