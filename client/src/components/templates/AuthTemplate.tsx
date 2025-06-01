import type { ReactNode } from "react"
import type React from "react"

type AuthTemplateProps = {
  title: string
  children: ReactNode
}

const AuthTemplate: React.FC<AuthTemplateProps> = ({title, children}) => {
  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900">{title}</h2>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
        {children}
      </div>

    </div>
  )
}

export default AuthTemplate
