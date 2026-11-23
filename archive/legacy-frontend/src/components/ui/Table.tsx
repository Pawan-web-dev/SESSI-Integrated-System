import React from 'react';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ headers, children }) => {
  return (
    <div className='overflow-x-auto border border-[#cfe4d5] rounded-xl'>
      <table className='w-full text-left border-collapse'>
        <thead className='bg-[#f4fbf6]'>
          <tr>
            {headers.map((header, i) => (
              <th key={i} className='px-6 py-4 text-sm font-bold text-[#0b4d24] border-b border-[#cfe4d5]'>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='divide-y divide-[#cfe4d5] bg-white'>
          {children}
        </tbody>
      </table>
    </div>
  );
};
