import { RiUserLine } from '@remixicon/react';

export function UsersTableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="divide-gray-200 min-w-full divide-y">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-xs text-gray-500 px-6 py-3 text-left font-medium uppercase tracking-wider">
              User
            </th>
            <th className="text-xs text-gray-500 px-6 py-3 text-left font-medium uppercase tracking-wider">
              Email
            </th>
            <th className="text-xs text-gray-500 px-6 py-3 text-left font-medium uppercase tracking-wider">
              Phone
            </th>
            <th className="text-xs text-gray-500 px-6 py-3 text-left font-medium uppercase tracking-wider">
              Role
            </th>
            <th className="text-xs text-gray-500 px-6 py-3 text-left font-medium uppercase tracking-wider">
              Status
            </th>
            <th className="text-xs text-gray-500 px-6 py-3 text-left font-medium uppercase tracking-wider">
              Created
            </th>
            <th className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-gray-200 divide-y bg-white">
          {Array.from({ length: 5 }).map((_, index) => (
            <tr key={index} className="animate-pulse">
              <td className="whitespace-nowrap px-6 py-4">
                <div className="flex items-center">
                  <div className="bg-gray-200 flex size-8 items-center justify-center rounded-full">
                    <RiUserLine className="text-gray-400 size-4" />
                  </div>
                  <div className="ml-4">
                    <div className="bg-gray-200 h-4 w-32 rounded"></div>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="bg-gray-200 h-4 w-40 rounded"></div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="bg-gray-200 h-4 w-24 rounded"></div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="bg-gray-200 h-5 w-16 rounded-full"></div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="bg-gray-200 h-5 w-16 rounded-full"></div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="bg-gray-200 h-4 w-20 rounded"></div>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right">
                <div className="bg-gray-200 h-8 w-8 rounded"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 