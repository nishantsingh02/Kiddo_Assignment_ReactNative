import { TextStyle } from 'react-native';

export const TYPOGRAPHY = {
  display: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
  } as TextStyle,
  heading1: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
  } as TextStyle,
  heading2: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
  } as TextStyle,
  heading3: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  } as TextStyle,
  body1: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  } as TextStyle,
  body2: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
  } as TextStyle,
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  } as TextStyle,
  price: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
  } as TextStyle,
  priceCrossed: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    textDecorationLine: 'line-through',
  } as TextStyle,
  cta: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  } as TextStyle,
  micro: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '400',
  } as TextStyle,
} as const;
