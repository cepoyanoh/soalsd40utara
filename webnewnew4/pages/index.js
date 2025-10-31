const openForm = (form) => {
  window.open(form.googleFormUrl, '_blank');
};

const isFormActive = (dueDate) => {
  const now = new Date();
  const due = new Date(dueDate);
  return now <= due;
};

//   <div className="fixed inset-0 z-50 overflow-y-auto">
//     <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//       <div className="fixed inset-0 transition-opacity" aria-hidden="true">
//         <div 
//           className="absolute inset-0 bg-gray-500 opacity-75"
//           onClick={closeForm}
//         ></div>
//       </div>

//       <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
//         <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//           <div className="sm:flex sm:items-start">
//             <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
//               <h3 className="text-lg leading-6 font-medium text-gray-900">
//                 {selectedForm.title}
//               </h3>
//               <div className="mt-2 w-full">
//                 <iframe 
//                   src={selectedForm.googleFormUrl}
//                   width="100%"
//                   height="600"
//                   frameBorder="0"
//                   marginHeight="0"
//                   marginWidth="0"
//                 >
//                   Memuat...
//                 </iframe>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//           <button
//             type="button"
//             onClick={closeForm}
//             className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//           >
//             Tutup
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// )}
