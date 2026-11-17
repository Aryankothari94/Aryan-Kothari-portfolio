const WIDTH_CLASSES = {
  narrow: 'max-w-4xl',
  default: 'max-w-7xl',
  wide: 'max-w-[1440px]',
};

export function Container({
  as: Component = 'div',
  size = 'default',
  className = '',
  children,
  ...props
}) {
  const widthClass = WIDTH_CLASSES[size] || WIDTH_CLASSES.default;

  return (
    <Component
      className={`mx-auto w-full px-5 sm:px-8 lg:px-12 ${widthClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}

