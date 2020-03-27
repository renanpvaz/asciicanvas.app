declare module '*.png' {
  const value: any
  export default value
}

interface CSSStyleDeclaration {
  '--icon-x'?: string
  '--icon-y'?: string
}

interface Navigator {
  share?: (opts: any) => void
}
