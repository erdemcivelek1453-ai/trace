import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

interface AppTextProps {
  children: React.ReactNode;
  variant ? : keyof typeof typography.fontSize;
  color ? : keyof typeof colors.text | string;
  weight ? : keyof typeof typography.fontWeight;
  style ? : TextStyle;
  numberOfLines ? : number;
}

export const AppText: React.FC < AppTextProps > = ({
  children,
  variant = 'md',
  color = 'primary',
  weight = 'regular',
  style,
  numberOfLines,
}) => {
  const textColor = colors.text[color as keyof typeof colors.text] || color;
  
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        {
          fontSize: typography.fontSize[variant],
          lineHeight: typography.lineHeight[variant],
          fontWeight: typography.fontWeight[weight] as TextStyle['fontWeight'],
          color: textColor,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};