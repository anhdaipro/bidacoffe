// File: styles/UI.ts
import styled from 'styled-components';
import type { HTMLAttributes } from 'react';

// ========== LAYOUT ========== //
interface FlexProps extends HTMLAttributes<HTMLDivElement> {
  direction?: string;
  align?: string;
  justify?: string;
  wrap?: string;
  gap?: string;
  margin?: string;
  padding?: string;
  mobiledirection?: string;
  mobilealign?: string;
  mobilejustify?: string;
  mobileGap?: string;
}
interface ItemFlex extends HTMLAttributes<HTMLDivElement> {
  flex?: number;
}
export const FlexBox = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${(props) => props.direction || 'row'};
  align-items: ${(props) => props.align || 'center'};
  justify-content: ${(props) => props.justify || 'flex-start'};
  flex-wrap: ${(props) => props.wrap || 'nowrap'};
  gap: ${(props) => props.gap || '0.5rem'};
  margin: ${(props) => props.margin || '0'};
  padding: ${(props) => props.padding || '0'};

  @media (max-width: 768px) {
    flex-direction: ${(props) => props.mobiledirection || props.direction};
    align-items: ${(props) => props.mobilealign || props.align};
    justify-content: ${(props) => props.mobilejustify || props.justify};
    gap: ${(props) => props.mobileGap || props.gap};
  }
`;
export const ItemFlex = styled(FlexBox)<ItemFlex>`
  flex: ${(props) => props.flex || 1};
`
interface GridProps {
  columns?: string;
  gap?: string;
  mobileColumns?: string;
}

export const GridBox = styled.div<GridProps>`
  display: grid;
  grid-template-columns: ${(props) => props.columns || '1fr 1fr'};
  gap: ${(props) => props.gap || '1rem'};

  @media (max-width: 768px) {
    grid-template-columns: ${(props) => props.mobileColumns || '1fr'};
  }
`;

interface ContainerProps {
  maxWidth?: string;
  padding?: string;
}

export const Container = styled.div<ContainerProps>`
  max-width: ${(props) => props.maxWidth || '1200px'};
  margin: 0 auto;
  padding: ${(props) => props.padding || '0 1rem'};
`;

interface SectionProps {
  padding?: string;
  bg?: string;
}

export const Section = styled.section<SectionProps>`
  padding: ${(props) => props.padding || '2rem 0'};
  background-color: ${(props) => props.bg || 'transparent'};
`;

interface SpacerProps {
  height?: string;
}

export const Spacer = styled.div<SpacerProps>`
  height: ${(props) => props.height || '1rem'};
`;

// ========== TEXT ========== //
interface TextProps {
  size?: string;
  weight?: string;
  color?: string;
  align?: string;
  margin?: string;
  padding?: string;
  mobileSize?: string;
  mobilealign?: string;
}

export const Text = styled.p<TextProps>`
  font-size: ${(props) => props.size || '14px'};
  font-weight: ${(props) => props.weight || 'normal'};
  color: ${(props) => props.color || '#222'};
  text-align: ${(props) => props.align || 'left'};
  margin: ${(props) => props.margin || '0'};
  padding: ${(props) => props.padding || '0'};

  @media (max-width: 768px) {
    font-size: ${(props) => props.mobileSize || props.size};
    text-align: ${(props) => props.mobilealign || props.align};
  }
`;

interface TitleProps {
  size?: string;
  weight?: string;
  margin?: string;
  align?: string;
}

export const Title = styled.h1<TitleProps>`
  font-size: ${(props) => props.size || '2rem'};
  font-weight: ${(props) => props.weight || 'bold'};
  margin: ${(props) => props.margin || '0 0 1rem'};
  text-align: ${(props) => props.align || 'left'};
`;

interface LinkProps {
  color?: string;
  hoverColor?: string;
}

export const LinkText = styled.a<LinkProps>`
  color: ${(props) => props.color || '#0070f3'};
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: ${(props) => props.hoverColor || '#005bb5'};
  }
`;

// ========== BUTTON ========== //
interface ButtonProps {
  padding?: string;
  bg?: string;
  color?: string;
  size?: string;
  radius?: string;
  hoverBg?: string;
  margin?: string;
}
export const Button = styled.button<ButtonProps>`
  padding: ${(props) => props.padding || '0.5rem 1rem'};
  background-color: ${(props) => props.bg || '#0070f3'};
  color: ${(props) => props.color || '#fff'};
  font-size: ${(props) => props.size || '14px'};
  border: none;
  border-radius: ${(props) => props.radius || '6px'};
  cursor: pointer;
  transition: background-color 0.3s;
  margin:${(props) => props.margin || '0'};
  &:hover {
    background-color: ${(props) => props.hoverBg || '#005bb5'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const PrimaryButton = styled(Button)``;
export const SecondaryButton = styled(Button)`
  background-color: #f0f0f0;
  color: #333;
  &:hover {
    background-color: #e0e0e0;
  }
`;

export const DangerButton = styled(Button)`
  background-color: #dc3545;
  &:hover {
    background-color: #c82333;
  }
`;

export const IconButton = styled(Button)`
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// ========== FORM ========== //
interface FormProps{
}
export const FormContainer = styled.div`
  width:100%;
`
interface InputProps {
  padding?: string;
  borderColor?: string;
  radius?: string;
  size?: string;
  width?: string;
  focusBorder?: string;
}

export const Input = styled.input<InputProps>`
  padding: ${(props) => props.padding || '0.25rem'};
  border: 1px solid ${(props) => props.borderColor || '#ccc'};
  border-radius: ${(props) => props.radius || '4px'};
  font-size: ${(props) => props.size || '14px'};
  width: ${(props) => props.width || '100%'};
  outline: none;

  &:focus {
    border-color: ${(props) => props.focusBorder || '#0070f3'};
  }
`;
export const Select = styled.select<InputProps>`
  padding: ${(props) => props.padding || '0.25rem'};
  border: 1px solid ${(props) => props.borderColor || '#ccc'};
  border-radius: ${(props) => props.radius || '4px'};
  font-size: ${(props) => props.size || '14px'};
  width: ${(props) => props.width || '100%'};
  outline: none;
`;
interface TextAreaProps extends InputProps {
  resize?: string;
  minHeight?: string;
}

export const TextArea = styled.textarea<TextAreaProps>`
  padding: ${(props) => props.padding || '0.5rem'};
  border: 1px solid ${(props) => props.borderColor || '#ccc'};
  border-radius: ${(props) => props.radius || '4px'};
  font-size: ${(props) => props.size || '14px'};
  width: ${(props) => props.width || '100%'};
  resize: ${(props) => props.resize || 'vertical'};
  outline: none;
  min-height: ${(props) => props.minHeight || '80px'};
  transition: border-color 0.2s, box-shadow 0.2s;
  &:focus {
    border-color: ${(props) => props.focusBorder || '#1976d2'}; /* MUI blue */
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.25); /* giống MUI focus ring */
  }
`;

interface LabelProps {
  size?: string;
  width?:string | number
}

export const Label = styled.label<LabelProps>`
  font-size: ${(props) => props.size || '14px'};
  width:${(props) => props.width || 'auto'};
  display: block;
  text-align:end;
`;

interface FormGroupProps {
  direction?:string
  gap?: string;
  margin?: string;
}

export const FormGroup = styled.div<FormGroupProps>`
  display: flex;
  flex-direction:${(props) => props.direction || 'column'};
  gap: ${(props) => props.gap || '0.25rem'};
  align-items:center;
  margin-bottom: ${(props) => props.margin || '1rem'};
`;

// ========== FEEDBACK ========== //
interface AlertProps {
  type?: 'success' | 'danger' | 'warning' | 'info';
}

export const Alert = styled.div<AlertProps>`
  padding: 1rem;
  border-radius: 4px;
  color: #fff;
  background-color: ${(props) =>
    props.type === 'success'
      ? '#28a745'
      : props.type === 'danger'
      ? '#dc3545'
      : props.type === 'warning'
      ? '#ffc107'
      : '#0070f3'};
`;

interface DividerProps {
  margin?: string;
}

export const Divider = styled.hr<DividerProps>`
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: ${(props) => props.margin || '1rem 0'};
`;

export const LoadingSpinner = styled.div`
  width: 30px;
  height: 30px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0070f3;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  color: #777;
`;

