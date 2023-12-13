import Icon, {
  type CustomIconComponentProps,
} from '@ant-design/icons/lib/components/Icon'

export const IconBase = ({
  svgPaths,
  ...props
}: IconProps & { svgPaths: string[] }) => {
  return (
    <Icon
      {...props}
      component={() => (
        <svg
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
        >
          {svgPaths.map((path) => (
            <path d={path} fill="currentColor" key={path} />
          ))}
        </svg>
      )}
    />
  )
}

export type IconProps = Partial<CustomIconComponentProps> & {
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onFocus?: () => void
  onClick?: () => void
}
