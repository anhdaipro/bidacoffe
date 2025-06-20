// SVG Icon cộng
interface Props{
  width: string;
}
const PlusIcon:React.FC<Props> = ({width  = '12px' }) => (
    <svg width={width} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
  
  // SVG Icon trừ
const MinusIcon:React.FC<Props> = ({width  = '12px' }) => (
<svg width={width} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
</svg>
);
const CloseIcon:React.FC<Props> = ({width  = '12px'}) => (
<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
</svg>
);
const RequiredLable:React.FC<{required:boolean}> = ({required}) =>{
  if(!required) return <></>;
  return(
      <span style={{ color: 'red' }}> *</span>
  )
}
export {PlusIcon,MinusIcon,CloseIcon,RequiredLable}