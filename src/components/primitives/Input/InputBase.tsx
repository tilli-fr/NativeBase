import React, { memo, forwardRef } from 'react';
import { TextInput, Platform } from 'react-native';
import type { IInputProps } from './types';
import { useToken } from '../../../hooks';
import { usePropsResolution } from '../../../hooks/useThemeProps';
import { useHover } from '@react-native-aria/interactions';
import { mergeRefs } from '../../../utils';
import { makeStyledComponent } from '../../../utils/styled';
import { useResolvedFontFamily } from '../../../hooks/useResolvedFontFamily';
import { useHasResponsiveProps } from '../../../hooks/useHasResponsiveProps';

const StyledInput = makeStyledComponent(TextInput);

const InputBase = (
  {
    onKeyPress,
    onFocus,
    onBlur,
    disableFocusHandling,
    inputProps,
    wrapperRef,
    ...props
  }: IInputProps & {
    disableFocusHandling?: boolean;
    inputProps: any;
  },
  ref: any
) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const handleFocus = (focusState: boolean, callback: any) => {
    !disableFocusHandling && setIsFocused(focusState);
    callback();
  };

  const inputThemeProps = {
    isDisabled: inputProps.disabled,
    isInvalid: inputProps.accessibilityInvalid,
    isReadOnly: inputProps.accessibilityReadOnly,
    isRequired: inputProps.required,
  };

  const {
    isFullWidth,
    isDisabled,
    isInvalid,
    isReadOnly,
    ariaLabel,
    accessibilityLabel,
    placeholderTextColor,
    selectionColor,
    underlineColorAndroid,
    type,
    _hover,
    _focus,
    _disabled,
    _readOnly,
    _invalid,
    fontFamily,
    fontWeight,
    fontStyle,
    ...themedProps
  } = usePropsResolution('Input', {
    ...inputThemeProps,
    ...props,
  });

  const _ref = React.useRef(null);
  const { isHovered } = useHover({}, _ref);

  const resolvedFontFamily = useResolvedFontFamily({
    fontFamily,
    fontWeight,
    fontStyle,
  });
  const resolvedPlaceholderTextColor = useToken('colors', placeholderTextColor);
  const resolvedSelectionColor = useToken('colors', selectionColor);
  const resolvedUnderlineColorAndroid = useToken(
    'colors',
    underlineColorAndroid
  );
  //TODO: refactor for responsive prop
  if (
    useHasResponsiveProps({
      ...props,
      onKeyPress,
      onFocus,
      onBlur,
      disableFocusHandling,
      inputProps,
    })
  ) {
    return null;
  }
  return (
    <StyledInput
      {...inputProps}
      {...resolvedFontFamily}
      secureTextEntry={type === 'password'}
      accessible
      accessibilityLabel={ariaLabel || accessibilityLabel}
      editable={isDisabled || isReadOnly ? false : true}
      w={isFullWidth ? '100%' : undefined}
      {...themedProps}
      {...(isHovered && _hover)}
      {...(isFocused && _focus)}
      {...(isReadOnly && _readOnly)}
      {...(isInvalid && _invalid)}
      {...(isDisabled && _disabled)}
      placeholderTextColor={resolvedPlaceholderTextColor}
      selectionColor={resolvedSelectionColor}
      underlineColorAndroid={resolvedUnderlineColorAndroid}
      onKeyPress={(e: any) => {
        e.persist();
        onKeyPress && onKeyPress(e);
      }}
      onFocus={(e: any) => {
        handleFocus(true, onFocus ? () => onFocus(e) : () => {});
      }}
      onBlur={(e: any) => {
        handleFocus(false, onBlur ? () => onBlur(e) : () => {});
      }}
      {...(Platform.OS === 'web'
        ? {
            disabled: isDisabled,
            cursor: isDisabled ? 'not-allowed' : 'auto',
          }
        : {})}
      ref={mergeRefs([ref, _ref, wrapperRef])}
    />
  );
};

export default memo(forwardRef(InputBase));
