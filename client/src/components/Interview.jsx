// import { AlertCircle, Clock3, Coins, UserRound } from "lucide-react";

// function Interview({ interviewdata }) {
//   const questions = interviewdata?.questions || [];

//   if (!interviewdata || questions.length === 0) {
//     return (
//       <main className="flex min-h-screen items-center justify-center bg-[#F8F9FB] px-4">
//         <div
//           role="alert"
//           className="rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm"
//         >
//           <AlertCircle className="mx-auto mb-3 text-amber-500" size={30} />
//           <h1 className="text-lg font-bold text-gray-900">
//             Interview data is unavailable
//           </h1>
//           <p className="mt-2 text-sm text-gray-600">
//             Go back to setup and try starting the interview again.
//           </p>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-[#F8F9FB] px-4 py-10 sm:px-6">
//       <section className="mx-auto max-w-4xl rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-10">
//         <header className="flex flex-wrap items-start justify-between gap-4">
//           <div>
//             <p className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
//               <UserRound size={17} />
//               Welcome, {interviewdata.userName || interviewdata.username}
//             </p>
//             <h1 className="mt-2 text-2xl font-bold text-gray-950">
//               {interviewdata.role}
//             </h1>
//             <p className="mt-1 text-sm text-gray-500">
//               {interviewdata.experience} · {interviewdata.mode} interview
//             </p>
//             <p className="mt-1 text-xs text-gray-400">
//               Interview ID: {interviewdata.interviewId}
//             </p>
//           </div>
//           <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
//             <Coins size={17} />
//             {interviewdata.creditsLeft ?? "—"} credits left
//           </div>
//         </header>

//         <div className="mt-8">
//           <div className="flex flex-wrap items-end justify-between gap-2">
//             <div>
//               <h2 className="text-lg font-bold text-gray-900">
//                 Your interview questions
//               </h2>
//               <p className="mt-1 text-sm text-gray-500">
//                 {questions.length} questions tailored to your interview setup.
//               </p>
//             </div>
//             <p className="text-sm font-medium text-gray-500">
//               {questions.length} total
//             </p>
//           </div>

//           <ol className="mt-5 space-y-4">
//             {questions.map((item, index) => (
//               <li
//                 key={item._id || `${item.question}-${index}`}
//                 className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
//               >
//                 <div className="flex flex-wrap items-center justify-between gap-3">
//                   <p className="text-sm font-bold text-gray-700">
//                     Question {index + 1}
//                   </p>
//                   <div className="flex flex-wrap items-center gap-2">
//                     <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
//                       {item.difficulty || "Difficulty unavailable"}
//                     </span>
//                     {item.timeLimit != null && (
//                       <span className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs text-gray-600">
//                         <Clock3 size={13} />
//                         {item.timeLimit} sec
//                       </span>
//                     )}
//                   </div>
//                 </div>
//                 <p className="mt-3 text-sm leading-6 text-gray-800">
//                   {item.question}
//                 </p>
//                 <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
//                   {[
//                     ["Score", item.score],
//                     ["Confidence", item.confidence],
//                     ["Communication", item.communication],
//                     ["Correctness", item.correctness],
//                   ].map(([label, value]) => (
//                     <div key={label} className="rounded-xl bg-white p-3">
//                       <dt className="text-xs text-gray-500">{label}</dt>
//                       <dd className="mt-1 text-sm font-bold text-gray-900">
//                         {value ?? 0}
//                         <span className="ml-1 text-xs font-medium text-gray-400">
//                           /10
//                         </span>
//                       </dd>
//                     </div>
//                   ))}
//                 </dl>
//               </li>
//             ))}
//           </ol>
//         </div>
//       </section>
//     </main>
//   );
// }

// export default Interview;


import React from 'react';

const Interview = () => {
  return (
    <div>
      step2
    </div>
  );
}

export default Interview;
