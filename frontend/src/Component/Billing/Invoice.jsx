

// import React from 'react';

// /**
//  * A4 dimensions in pixels at 96 DPI: 794px x 1123px.
//  * This component maintains the exact design while restructuring the billing info section.
//  */
// const Invoice = () => {
//   return (
//     <div className="bg-gray-200 min-h-screen py-10 flex justify-center print:p-0 print:bg-white">
//       {/* A4 Page Container */}
//       <div 
//         className="bg-white shadow-2xl print:shadow-none overflow-hidden"
//         style={{
//           width: '210mm',
//           height: '297mm',
//           padding: '10mm',
//           boxSizing: 'border-box',
//           fontFamily: '"Times New Roman", Times, serif'
//         }}
//       >
//         {/* Main Border Box */}
//         <div className="border-[1.5px] border-black h-full flex flex-col text-[12px] leading-tight text-black">
          
//           {/* Header Section */}
//           <div className="flex border-b-[1.5px] border-black">
//             {/* Top Left: GSTIN */}
//             <div className="w-1/3 p-2">
//               <span className="font-bold">GSTIN: 33AFGPY5715D2ZF</span>
//               <div className="mt-2 text-[10px]">
//                 <img 
//                   src="https://upload.wikimedia.org/wikipedia/en/8/80/Lord_Ganesha_Icon.png" 
//                   alt="Logo" 
//                   className="w-12 opacity-80 grayscale"
//                   onError={(e) => e.target.style.display='none'}
//                 />
//               </div>
//             </div>

//             {/* Top Center: Company Info */}
//             <div className="w-1/3 text-center py-2">
//               <div className="inline-block border-b border-black font-bold px-4 mb-1 uppercase tracking-widest">Tax Invoice</div>
//               <h1 className="text-2xl font-bold tracking-tight">K.P. TEXTILES</h1>
//               <p className="italic font-bold text-[11px] mb-1">Handloom Cloth Merchants</p>
//               <p className="text-[10px]">6/541, Gandhi Nagar, Veeranam Main Road,</p>
//               <p className="text-[10px]">Allikuttai(PO), SALEM - 636 003. (TN)</p>
//             </div>

//             {/* Top Right: Contact */}
//             <div className="w-1/3 text-right p-2 text-[11px] leading-normal font-bold">
//               <p>CELL: (+91) 94864 08083</p>
//               <p>(+91) 95431 82043</p>
//               <p>Phone No: 04272914083</p>
//             </div>
//           </div>

//           {/* Billing Info Section - Restructured with separate columns */}
//           <div className="flex border-b-[1.5px] border-black">
//             {/* 1. TO Details (Restored to original) */}
//             <div className="w-[35%] border-r-[1.5px] border-black p-2">
//               <p className="font-bold mb-1 text-[12px]">TO: M/S SRI SHARADHAA SILKS,</p>
//               <p className="uppercase text-[11px]">AMMAPET, SALEM-636003.</p>
//               <p className="text-[11px]">Mobile No: 9443697161.</p>
//               <p className="font-bold mt-1 text-[10px]">GSTIN / UIN: 33DQDPS3400J2ZZ /</p>
//               <p className="text-[10px]">State Name * Code : Tamil Nadu - 33.</p>
//             </div>

//             {/* 2. Buyer Details Column (New Column) */}
//             <div className="w-[25%] border-r-[1.5px] border-black p-2 relative">
//               <span className="absolute top-0 right-2 text-[9px] italic opacity-60">buyer</span>
//               <div className="mt-2 space-y-1 font-bold text-[11px]">
//                 <p className="text-red-700 italic text-[13px] mb-1">buyer</p>
//                 <p>name: some name</p>
//                 <p>Phno: 32484423</p>
//                 <p>state: TN</p>
//                 <p>gst no: 32372687</p>
//               </div>
//             </div>

//             {/* 3. Invoice Meta Details */}
//             <div className="w-[40%] text-[11px]">
//               <div className="flex border-b border-black">
//                 <div className="w-1/2 p-1 border-r border-black uppercase font-semibold">Reverse Charge</div>
//                 <div className="w-1/2 p-1 text-right font-bold pr-2">No</div>
//               </div>
//               <div className="flex border-b border-black">
//                 <div className="w-1/2 p-1 border-r border-black font-bold uppercase">Invoice No</div>
//                 <div className="w-1/2 p-1 text-right font-bold pr-2 text-red-600">00198</div>
//               </div>
//               <div className="flex border-b border-black">
//                 <div className="w-1/2 p-1 border-r border-black font-bold uppercase">Invoice Date</div>
//                 <div className="w-1/2 p-1 text-right font-bold pr-2">05-02-2025</div>
//               </div>
//               <div className="flex border-b border-black">
//                 <div className="w-1/2 p-1 border-r border-black font-semibold uppercase text-[10px]">Carriers</div>
//                 <div className="w-1/2 p-1 text-right pr-2"></div>
//               </div>
//               <div className="flex border-b border-black">
//                 <div className="w-1/2 p-1 border-r border-black font-semibold uppercase text-[10px]">No of Articles</div>
//                 <div className="w-1/2 p-1 text-right pr-2 font-bold">102</div>
//               </div>
//               <div className="flex border-b border-black">
//                 <div className="w-1/2 p-1 border-r border-black font-semibold uppercase text-[10px]">Way Bill No</div>
//                 <div className="w-1/2 p-1 text-right pr-2"></div>
//               </div>
//               <div className="flex border-b border-black">
//                 <div className="w-1/2 p-1 border-r border-black font-bold uppercase text-[10px]">State code</div>
//                 <div className="w-1/2 p-1 text-right pr-2 font-bold uppercase">Tamilnadu 33</div>
//               </div>
//             </div>
//           </div>

//           {/* Table Header */}
//           <div className="flex border-b border-black font-bold text-center text-[10px] items-stretch uppercase bg-gray-50">
//             <div className="w-12 border-r border-black py-1">S.No</div>
//             <div className="flex-grow border-r border-black py-1 text-left px-2">Product Description</div>
//             <div className="w-16 border-r border-black py-1">HSN Code</div>
//             <div className="w-16 border-r border-black py-1">Per Meter</div>
//             <div className="w-20 border-r border-black py-1">Rate ₹</div>
//             <div className="w-16 border-r border-black py-1">Qty</div>
//             <div className="w-24 py-1 pr-2 text-right">Total ₹</div>
//           </div>

//           {/* Table Content */}
//           <div className="flex-grow flex flex-col border-b border-black min-h-[400px]">
//             {/* Item 1 */}
//             <div className="flex border-b border-gray-200 h-10 items-center text-[11px]">
//               <div className="w-12 border-r border-black h-full flex items-center justify-center font-bold">1</div>
//               <div className="flex-grow border-r border-black h-full flex items-center px-2 font-bold italic">20.00 M ASHA SPCIAL SHIRTING PIECES 0</div>
//               <div className="w-16 border-r border-black h-full flex items-center justify-center">5407</div>
//               <div className="w-16 border-r border-black h-full flex items-center justify-center"></div>
//               <div className="w-20 border-r border-black h-full flex items-center justify-end px-2 italic font-bold">125.00</div>
//               <div className="w-16 border-r border-black h-full flex items-center justify-center font-bold text-[13px]">102</div>
//               <div className="w-24 h-full flex items-center justify-end px-2 font-bold text-[13px]">12,750.00</div>
//             </div>

//             {/* Empty Spacer Rows */}
//             <div className="flex-grow flex bg-white opacity-40">
//               <div className="w-12 border-r border-black"></div>
//               <div className="flex-grow border-r border-black"></div>
//               <div className="w-16 border-r border-black"></div>
//               <div className="w-16 border-r border-black"></div>
//               <div className="w-20 border-r border-black"></div>
//               <div className="w-16 border-r border-black"></div>
//               <div className="w-24"></div>
//             </div>
//           </div>

//           {/* Summary / Calculation Section */}
//           <div className="flex h-52">
//             {/* Left Footer: Totals and Words */}
//             <div className="w-[60%] border-r-[1.5px] border-black p-2 flex flex-col justify-between">
//               <div className="text-[11px] leading-relaxed">
//                 <p>Total : <span className="font-bold  text-[13px]">102 QTY</span></p>
//                 <p>Total : <span className="font-bold">0 MTRS</span></p>
//                 <div className="mt-4">
//                   <p className="text-[10px] italic">Invoice Total Amount (in words)</p>
//                   <p className="font-bold uppercase text-[11px] ">Thirteen Thousand Three Hundred and Eighty Eight Rupees Only</p>
//                 </div>
//               </div>

//               <div className="mt-4 border-t border-dotted border-black pt-2">
//                 <p className="font-bold underline italic text-[10px]">Terms & Conditions:</p>
//                 <p className="text-[9px]">1. Goods once sold will not be taken back or exchanged</p>
//                 <p className="text-[9px]">2. All disputes are subject to Salem jurisdiction</p>
//               </div>
//             </div>

//             {/* Right Footer: Tax Calculations */}
//             <div className="w-[40%] text-[11px] flex flex-col">
//               <div className="flex border-b border-black">
//                 <div className="flex-grow p-1 border-r border-black font-bold uppercase italic text-[10px]">Basic Amount</div>
//                 <div className="w-32 p-1 text-right font-bold px-2 whitespace-nowrap">: Rs. 12,750.00</div>
//               </div>
//               <div className="flex border-b border-black">
//                 <div className="flex-grow p-1 border-r border-black font-semibold uppercase text-[10px]">Add SGST 2.50 %</div>
//                 <div className="w-32 p-1 text-right px-2">: Rs. 318.75</div>
//               </div>
//               <div className="flex border-b border-black">
//                 <div className="flex-grow p-1 border-r border-black font-semibold uppercase text-[10px]">Add CGST 2.50 %</div>
//                 <div className="w-32 p-1 text-right px-2">: Rs. 318.75</div>
//               </div>
//               <div className="flex border-b border-black">
//                 <div className="flex-grow p-1 border-r border-black font-semibold uppercase text-[10px]">Add IGST 5 %</div>
//                 <div className="w-32 p-1 text-right px-2">: Rs. </div>
//               </div>
//               <div className="flex border-b border-black bg-gray-50">
//                 <div className="flex-grow p-1 border-r border-black font-bold uppercase">Tax Amount</div>
//                 <div className="w-32 p-1 text-right font-bold px-2">: Rs. 637.50</div>
//               </div>
//               <div className="flex border-b border-black">
//                 <div className="flex-grow p-1 border-r border-black font-semibold uppercase text-[10px]">Handling / Fright</div>
//                 <div className="w-32 p-1 text-right px-2">: Rs. </div>
//               </div>
//               <div className="flex border-b border-black">
//                 <div className="flex-grow p-1 border-r border-black font-bold uppercase font-bold italic ">Round Off</div>
//                 <div className="w-32 p-1 text-right px-2 font-bold italic ">: Rs. 0.50</div>
//               </div>
//               <div className="flex flex-grow items-center bg-gray-100">
//                 <div className="flex-grow p-1 h-full flex items-center border-r border-black font-black uppercase text-sm italic tracking-widest">Grand Total</div>
//                 <div className="w-32 p-1 h-full flex items-center justify-end font-black text-sm px-2  decoration-double">: Rs. 13,388.00</div>
//               </div>
//             </div>
//           </div>

//           {/* Final Footer: Bank Details & Signatory */}
//           <div className="flex border-t-[1.5px] border-black bg-gray-50 h-28">
//             <div className="w-2/3 p-2 text-[10px] font-bold leading-tight border-r border-black">
//               <p className="underline mb-1 uppercase tracking-tight">Bank Details:</p>
//               <p className="uppercase text-[11px]">KARUR VYSYA BANK,</p>
//               <p>Branch : SALEM MAIN.</p>
//               <p>IFSC : KVBL0001186,</p>
//               <p>Acc No : 1186 135 000002755</p>
//               <p className="mt-4 font-normal italic text-[8px]">E & O.E</p>
//             </div>
//             <div className="w-1/3 flex flex-col justify-between p-2 text-center">
//               <p className="font-black text-[11px] uppercase underline decoration-double">For K.P. TEXTILES</p>
//               <div className="mb-2 relative">
//                 <div className="font-serif italic text-blue-800 text-lg opacity-80 mb-[-12px] transform -rotate-3 select-none">
                  
//                 </div>
//                 <div className="border-t border-black pt-1 font-bold text-[9px] uppercase tracking-tighter">
//                   Authorized Signatory
//                 </div>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Invoice;

import React from 'react';

/**
 * Tax Invoice Component
 * Strictly maintains A4 layout (210mm x 297mm) 
 * Mobile Responsiveness: Horizontal scrolling to preserve exact design integrity.
 */
const Invoice = () => {
  return (
    <div className="bg-gray-200 min-h-screen py-0 md:py-10 flex md:justify-center overflow-x-auto">
      {/* Wrapper for Mobile: 
          min-w-max ensures the A4 container doesn't squish on small screens,
          preserving every single line and alignment exactly.
      */}
      <div className="min-w-max h-fit">
        {/* A4 Page Container */}
        <div 
          className="bg-white shadow-2xl print:shadow-none overflow-hidden mx-auto"
          style={{
            width: '210mm',
            height: '297mm',
            padding: '10mm',
            boxSizing: 'border-box',
            fontFamily: '"Times New Roman", Times, serif'
          }}
        >
          {/* Main Border Box */}
          <div className="border-[1.5px] border-black h-full flex flex-col text-[12px] leading-tight text-black">
            
            {/* Header Section */}
            <div className="flex border-b-[1.5px] border-black">
              {/* Top Left: GSTIN */}
              <div className="w-1/3 p-2">
                <span className="font-bold">GSTIN: 33AFGPY5715D2ZF</span>
                <div className="mt-2 text-[10px]">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/en/8/80/Lord_Ganesha_Icon.png" 
                    alt="Logo" 
                    className="w-12 opacity-80 grayscale"
                    onError={(e) => e.target.style.display='none'}
                  />
                </div>
              </div>

              {/* Top Center: Company Info */}
              <div className="w-1/3 text-center py-2">
                <div className="inline-block border-b border-black font-bold px-4 mb-1 uppercase tracking-widest">Tax Invoice</div>
                <h1 className="text-2xl font-bold tracking-tight">K.P. TEXTILES</h1>
                <p className="italic font-bold text-[11px] mb-1">Handloom Cloth Merchants</p>
                <p className="text-[10px]">6/541, Gandhi Nagar, Veeranam Main Road,</p>
                <p className="text-[10px]">Allikuttai(PO), SALEM - 636 003. (TN)</p>
              </div>

              {/* Top Right: Contact */}
              <div className="w-1/3 text-right p-2 text-[11px] leading-normal font-bold">
                <p>CELL: (+91) 94864 08083</p>
                <p>(+91) 95431 82043</p>
                <p>Phone No: 04272914083</p>
              </div>
            </div>

            {/* Billing Info Section */}
            <div className="flex border-b-[1.5px] border-black">
              {/* 1. TO Details */}
              <div className="w-[35%] border-r-[1.5px] border-black p-2">
                <p className="font-bold mb-1 text-[12px]">TO: M/S SRI SHARADHAA SILKS,</p>
                <p className="uppercase text-[11px]">AMMAPET, SALEM-636003.</p>
                <p className="text-[11px]">Mobile No: 9443697161.</p>
                <p className="font-bold mt-1 text-[10px]">GSTIN / UIN: 33DQDPS3400J2ZZ /</p>
                <p className="text-[10px]">State Name * Code : Tamil Nadu - 33.</p>
              </div>

              {/* 2. Buyer Details Column */}
              <div className="w-[25%] border-r-[1.5px] border-black p-2 relative">
                <span className="absolute top-0 right-2 text-[9px] italic opacity-60">buyer</span>
                <div className="mt-2 space-y-1 font-bold text-[11px]">
                  <p className="text-red-700 italic text-[13px] mb-1">buyer</p>
                  <p>name: some name</p>
                  <p>Phno: 32484423</p>
                  <p>state: TN</p>
                  <p>gst no: 32372687</p>
                </div>
              </div>

              {/* 3. Invoice Meta Details */}
              <div className="w-[40%] text-[11px]">
                <div className="flex border-b border-black">
                  <div className="w-1/2 p-1 border-r border-black uppercase font-semibold">Reverse Charge</div>
                  <div className="w-1/2 p-1 text-right font-bold pr-2">No</div>
                </div>
                <div className="flex border-b border-black">
                  <div className="w-1/2 p-1 border-r border-black font-bold uppercase">Invoice No</div>
                  <div className="w-1/2 p-1 text-right font-bold pr-2 text-red-600">00198</div>
                </div>
                <div className="flex border-b border-black">
                  <div className="w-1/2 p-1 border-r border-black font-bold uppercase">Invoice Date</div>
                  <div className="w-1/2 p-1 text-right font-bold pr-2">05-02-2025</div>
                </div>
                <div className="flex border-b border-black">
                  <div className="w-1/2 p-1 border-r border-black font-semibold uppercase text-[10px]">Carriers</div>
                  <div className="w-1/2 p-1 text-right pr-2"></div>
                </div>
                <div className="flex border-b border-black">
                  <div className="w-1/2 p-1 border-r border-black font-semibold uppercase text-[10px]">No of Articles</div>
                  <div className="w-1/2 p-1 text-right pr-2 font-bold">102</div>
                </div>
                <div className="flex border-b border-black">
                  <div className="w-1/2 p-1 border-r border-black font-semibold uppercase text-[10px]">Way Bill No</div>
                  <div className="w-1/2 p-1 text-right pr-2"></div>
                </div>
                <div className="flex border-b border-black">
                  <div className="w-1/2 p-1 border-r border-black font-bold uppercase text-[10px]">State code</div>
                  <div className="w-1/2 p-1 text-right pr-2 font-bold uppercase">Tamilnadu 33</div>
                </div>
              </div>
            </div>

            {/* Table Header */}
            <div className="flex border-b border-black font-bold text-center text-[10px] items-stretch uppercase bg-gray-50">
              <div className="w-12 border-r border-black py-1">S.No</div>
              <div className="flex-grow border-r border-black py-1 text-left px-2">Product Description</div>
              <div className="w-16 border-r border-black py-1">HSN Code</div>
              <div className="w-16 border-r border-black py-1">Per Meter</div>
              <div className="w-20 border-r border-black py-1">Rate ₹</div>
              <div className="w-16 border-r border-black py-1">Qty</div>
              <div className="w-24 py-1 pr-2 text-right">Total ₹</div>
            </div>

            {/* Table Content */}
            <div className="flex-grow flex flex-col border-b border-black min-h-[400px]">
              {/* Item 1 */}
              <div className="flex border-b border-gray-200 h-10 items-center text-[11px]">
                <div className="w-12 border-r border-black h-full flex items-center justify-center font-bold">1</div>
                <div className="flex-grow border-r border-black h-full flex items-center px-2 font-bold italic">20.00 M ASHA SPCIAL SHIRTING PIECES 0</div>
                <div className="w-16 border-r border-black h-full flex items-center justify-center">5407</div>
                <div className="w-16 border-r border-black h-full flex items-center justify-center"></div>
                <div className="w-20 border-r border-black h-full flex items-center justify-end px-2 italic font-bold">125.00</div>
                <div className="w-16 border-r border-black h-full flex items-center justify-center font-bold text-[13px]">102</div>
                <div className="w-24 h-full flex items-center justify-end px-2 font-bold text-[13px]">12,750.00</div>
              </div>

              {/* Empty Spacer Rows */}
              <div className="flex-grow flex bg-white opacity-40">
                <div className="w-12 border-r border-black"></div>
                <div className="flex-grow border-r border-black"></div>
                <div className="w-16 border-r border-black"></div>
                <div className="w-16 border-r border-black"></div>
                <div className="w-20 border-r border-black"></div>
                <div className="w-16 border-r border-black"></div>
                <div className="w-24"></div>
              </div>
            </div>

            {/* Summary / Calculation Section */}
            <div className="flex h-52">
              {/* Left Footer: Totals and Words */}
              <div className="w-[60%] border-r-[1.5px] border-black p-2 flex flex-col justify-between">
                <div className="text-[11px] leading-relaxed">
                  <p>Total : <span className="font-bold  border-black text-[13px]">102 QTY</span></p>
                  <p>Total : <span className="font-bold">0 MTRS</span></p>
                  <div className="mt-4">
                    <p className="text-[10px] italic">Invoice Total Amount (in words)</p>
                    <p className="font-bold uppercase text-[11px] ">Thirteen Thousand Three Hundred and Eighty Eight Rupees Only</p>
                  </div>
                </div>

                <div className="mt-4 border-t border-dotted border-black pt-2">
                  <p className="font-bold underline italic text-[10px]">Terms & Conditions:</p>
                  <p className="text-[9px]">1. Goods once sold will not be taken back or exchanged</p>
                  <p className="text-[9px]">2. All disputes are subject to Salem jurisdiction</p>
                </div>
              </div>

              {/* Right Footer: Tax Calculations */}
              <div className="w-[40%] text-[11px] flex flex-col">
                <div className="flex border-b border-black">
                  <div className="flex-grow p-1 border-r border-black font-bold uppercase italic text-[10px]">Basic Amount</div>
                  <div className="w-32 p-1 text-right font-bold px-2 whitespace-nowrap">: Rs. 12,750.00</div>
                </div>
                <div className="flex border-b border-black">
                  <div className="flex-grow p-1 border-r border-black font-semibold uppercase text-[10px]">Add SGST 2.50 %</div>
                  <div className="w-32 p-1 text-right px-2">: Rs. 318.75</div>
                </div>
                <div className="flex border-b border-black">
                  <div className="flex-grow p-1 border-r border-black font-semibold uppercase text-[10px]">Add CGST 2.50 %</div>
                  <div className="w-32 p-1 text-right px-2">: Rs. 318.75</div>
                </div>
                <div className="flex border-b border-black">
                  <div className="flex-grow p-1 border-r border-black font-semibold uppercase text-[10px]">Add IGST 5 %</div>
                  <div className="w-32 p-1 text-right px-2">: Rs. </div>
                </div>
                <div className="flex border-b border-black bg-gray-50">
                  <div className="flex-grow p-1 border-r border-black font-bold uppercase">Tax Amount</div>
                  <div className="w-32 p-1 text-right font-bold px-2">: Rs. 637.50</div>
                </div>
                <div className="flex border-b border-black">
                  <div className="flex-grow p-1 border-r border-black font-semibold uppercase text-[10px]">Handling / Fright</div>
                  <div className="w-32 p-1 text-right px-2">: Rs. </div>
                </div>
                <div className="flex border-b border-black">
                  <div className="flex-grow p-1 border-r border-black font-bold uppercase font-bold italic ">Round Off</div>
                  <div className="w-32 p-1 text-right px-2 font-bold italic ">: Rs. 0.50</div>
                </div>
                <div className="flex flex-grow items-center bg-gray-100">
                  <div className="flex-grow p-1 h-full flex items-center border-r border-black font-black uppercase text-sm italic tracking-widest">Grand Total</div>
                  <div className="w-32 p-1 h-full flex items-center justify-end font-black text-sm px-2  decoration-double">: Rs. 13,388.00</div>
                </div>
              </div>
            </div>

            {/* Final Footer: Bank Details & Signatory */}
            <div className="flex border-t-[1.5px] border-black bg-gray-50 h-28">
              <div className="w-2/3 p-2 text-[10px] font-bold leading-tight border-r border-black">
                <p className="underline mb-1 uppercase tracking-tight">Bank Details:</p>
                <p className="uppercase text-[11px]">KARUR VYSYA BANK,</p>
                <p>Branch : SALEM MAIN.</p>
                <p>IFSC : KVBL0001186,</p>
                <p>Acc No : 1186 135 000002755</p>
                <p className="mt-4 font-normal italic text-[8px]">E & O.E</p>
              </div>
              <div className="w-1/3 flex flex-col justify-between p-2 text-center">
                <p className="font-black text-[11px] uppercase  decoration-double">For K.P. TEXTILES</p>
                <div className="mb-2 relative">
                  <div className="font-serif italic text-blue-800 text-lg opacity-80 mb-[-12px] transform -rotate-3 select-none">
                    
                  </div>
                  <div className="border-t border-black pt-1 font-bold text-[9px] uppercase tracking-tighter">
                    Authorized Signatory
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;