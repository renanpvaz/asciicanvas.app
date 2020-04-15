declare module '*.png' {
  const value: any
  export default value
}

interface Navigator {
  share?: (opts: any) => void
}

interface Window {
  clipboardData: DataTransfer | null
}
