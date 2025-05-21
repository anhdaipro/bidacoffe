// Styled Toast.tsx
import styled from 'styled-components';

export const ToastWrapper = styled.div`
  background-color: #333;
  color: white;
  padding: 24px;
  margin-bottom: 10px;
  border-radius: 5px;
  min-width: 200px;
  position: relative;
  z-index: 9999;

  &.success {
    background-color: #4caf50;
  }

  &.error {
    background-color: #f44336;
  }
`;

export const Message = styled.p`
  margin: 0;
  font-size:16px;
  margin-bottom: 12px;
  text-align:center;
`;

export const CloseButton = styled.button`
  background: none;
  color: white;
  border: none;
  font-size: 18px;
  cursor: pointer;
  position: absolute;
  top: 5px;
  right: 5px;
`;
export const ToastContainerWrapper = styled.div`
position: fixed;
top: 64px;
left: 50%;
transform:translateX(-50%);
z-index: 9999;
`;
