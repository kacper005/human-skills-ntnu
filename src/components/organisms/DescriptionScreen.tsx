// "use client"

// import type { ReactNode } from "react"
// import { Button } from "@mui/material"

// interface DescriptionScreenProps {
//   icon: ReactNode
//   title: string
//   description: string
//   instructions: string[]
//   onBack: () => void
//   onStart: () => void
// }

// export function DescriptionScreen({
//   icon,
//   title,
//   description,
//   instructions,
//   onBack,
//   onStart,
// }: DescriptionScreenProps) {
//   return (
//     <div className="min-h-screen bg-slate-100 flex items-center justify-center p-8">
//       <div className="bg-white rounded-xl shadow-2xl p-12 max-w-md w-full text-center space-y-6">
//         <div className="flex justify-center mb-4">{icon}</div>
//         <h1 className="text-4xl font-bold text-slate-900">{title}</h1>
//         <p className="text-slate-600">{description}</p>
//         <div className="text-left space-y-2 text-sm text-slate-600 bg-slate-50 p-4 rounded-lg">
//           {instructions.map((instruction, index) => (
//             <p key={index}>{instruction}</p>
//           ))}
//         </div>
//         <div className="flex gap-3">
//           <Button onClick={onBack} size="large" variant="outlined" className="flex-1 bg-transparent">
//             Back
//           </Button>
//           <Button onClick={onStart} size="large" className="flex-1 bg-orange-500 hover:bg-orange-600">
//             Start Game
//           </Button>
//         </div>
//       </div>
//     </div>
//   )
// }
